"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { useCart } from "../../context/CartContext"

type Product = {
  _id?: string
  title: string
  description: string
  price: string
  category: string
  image: string
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { addItem } = useCart()
  const resolvedParams = React.use(params)
  const [product, setProduct] = React.useState<Product | null>(null)
  const [quantity, setQuantity] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null)
  const signInTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    let cancelled = false

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Failed to load product')

        const products: Product[] = await res.json()
        const current = products.find((item) => item._id === resolvedParams.id)

        if (!cancelled) {
          if (!current) {
            setError('Product not found')
          } else {
            setProduct(current)
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProduct()

    return () => {
      cancelled = true
    }
  }, [resolvedParams.id])

  const handleAddToCart = () => {
    if (!isSignedIn) {
      setAlertMessage('Sign in to add to cart')

      if (signInTimerRef.current) {
        window.clearTimeout(signInTimerRef.current)
      }

      signInTimerRef.current = window.setTimeout(() => {
        router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`)
      }, 900)

      return
    }
      if (!product) {
        setAlertMessage('Product unavailable')
        return
      }

      addItem(product, quantity)
      setAlertMessage(null)
  }

  React.useEffect(() => {
    return () => {
      if (signInTimerRef.current) {
        window.clearTimeout(signInTimerRef.current)
      }
    }
  }, [])

  if (loading) {
    return <main className="mx-auto max-w-7xl px-4 py-20 text-white sm:px-6">Loading product...</main>
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-white sm:px-6">
        <p className="text-slate-300">{error || 'Product not found'}</p>
        <Link href="/" className="mt-6 inline-block rounded-full border border-white/10 px-4 py-2 text-sm text-white">
          Back to home
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 text-slate-100 sm:px-6">
      {alertMessage && (
        <div className="fixed left-1/2 top-6 z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-amber-400/30 bg-amber-400/15 px-4 py-3 text-sm font-medium text-amber-100 shadow-lg shadow-black/30 backdrop-blur-sm sm:w-full">
          {alertMessage}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-900">
            <Image src={product.image} alt={product.title} fill unoptimized className="object-cover" />
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">{product.category}</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{product.title}</h1>
            <p className="mt-4 text-2xl font-semibold text-cyan-300">${Number(product.price).toFixed(2)}</p>
          </div>

          <p className="leading-7 text-slate-300">{product.description}</p>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Quantity</label>
              <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-2 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-semibold text-white hover:bg-white/10"
                  aria-label="Decrease quantity"
                >
                  -
                </button>

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="mx-3 w-full max-w-24 bg-transparent text-center text-lg font-semibold text-white outline-none"
                />

                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-semibold text-white hover:bg-white/10"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-full bg-cyan-500 px-5 py-3 font-medium text-white hover:bg-cyan-600"
            >
              Add to Cart
            </button>

            <Link href="/checkout" className="block rounded-full border border-white/10 px-5 py-3 text-center font-medium text-white hover:bg-white/5">
              Go to checkout
            </Link>
          </div>

          {!isSignedIn && <p className="text-sm text-slate-400">You must be signed in to add products to your cart.</p>}
        </section>
      </div>
    </main>
  )
}
