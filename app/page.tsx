"use client"
import Image from "next/image"
import Link from "next/link"
import {useEffect, useState} from "react"

type Product = {
  _id?: string
  title: string
  description: string
  price: string
  category: string
  image: string
}

export default function Home() {

  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState<string>("")
  useEffect(() => { 
    fetch("/api/products")
     .then((res) => res.json())
     .then((data) => setProducts(data))
     .catch((err) => console.log(err))
  },[])

  const handleSearch = async () => {
    try {
      if (!query.trim()) {
        const res = await fetch("/api/products")

        if (!res.ok) {
          throw new Error("Default products request failed")
        }

        const data = await res.json()
        setProducts(data)
        return
      }

      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) {
        throw new Error("Search request failed")
      }

      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main className="min-h-screen bg-[#070b17] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(7,11,23,1))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              Product showcase
            </span>
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                A sharp storefront built to spotlight every product.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Browse the catalog in a high-contrast grid with clear pricing,
                category labels, and a polished modern presentation.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-400">Products</p>
              <p className="mt-2 text-3xl font-semibold text-white">{products.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-400">Layout</p>
              <p className="mt-2 text-3xl font-semibold text-white">Grid</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-400">Style</p>
              <p className="mt-2 text-3xl font-semibold text-white">Tailwind</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Catalog</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Featured products
            </h2>
          </div>

          <div className="w-full max-w-xl lg:pt-1">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                onClick={handleSearch}
                className="h-12 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
              >
                Search
              </button>
            </div>
            <p className="mt-4 pr-1 text-right text-sm text-slate-400">
              {products.length} items ready to explore
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index: number) => (
            <article
              key={product._id ?? `${product.title}-${index}`}
              className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-cyan-200 backdrop-blur">
                  {product.category}
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-white">
                    {product.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                  <span className="text-2xl font-semibold text-cyan-300">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <Link
                    href={`/product/${product._id}`}
                    className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
} 