"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth, SignInButton, useUser } from "@clerk/nextjs"
import { useCart } from "../../context/CartContext"

export default function PaymentPage() {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { items, clear } = useCart()
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    address: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  React.useEffect(() => {
    if (items.length === 0) {
      router.replace('/checkout')
    }
  }, [items.length, router])

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isSignedIn) {
      setMessage('Please sign in before placing an order.')
      return
    }
    try {
      setLoading(true)
      setMessage(null)

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user?.id || '',
          items: items.map((item) => ({
            product: item.product._id || null,
            title: item.product.title,
            price: Number(item.product.price),
            quantity: item.quantity,
          })),
          total: Number(total),
          customer: {
            name: form.name,
            email: form.email,
            address: form.address,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Order failed')

      clear()
      setMessage(`Order placed successfully. Order ID: ${data.order?._id ?? 'unknown'}`)
      router.push('/')
    } catch (error: unknown) {
      const text = error instanceof Error ? error.message : 'Failed to place order'
      setMessage(text)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 text-slate-100 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Payment details</h1>
        <p className="mt-2 text-sm text-slate-400">Review your order and enter payment information</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-medium text-white">Shipping details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={form.name} onChange={handleChange('name')} placeholder="Full name" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
              <input value={form.email} onChange={handleChange('email')} type="email" placeholder="Email" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
              <textarea value={form.address} onChange={handleChange('address')} placeholder="Address" required className="min-h-28 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 sm:col-span-2" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium text-white">Payment details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={form.cardName} onChange={handleChange('cardName')} placeholder="Name on card" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 sm:col-span-2" />
              <input value={form.cardNumber} onChange={handleChange('cardNumber')} placeholder="Card number" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 sm:col-span-2" />
              <input value={form.expiry} onChange={handleChange('expiry')} placeholder="MM/YY" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
              <input value={form.cvv} onChange={handleChange('cvv')} placeholder="CVV" required className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => router.push('/checkout')} className="rounded-md border border-white/10 px-4 py-2 text-sm text-white">
              Back to cart
            </button>
            {isSignedIn ? (
              <button type="submit" disabled={loading} className="rounded-md bg-cyan-500 px-5 py-3 font-medium text-white hover:bg-cyan-600 disabled:opacity-60">
                {loading ? 'Placing order...' : 'Place order'}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button type="button" className="rounded-md bg-cyan-500 px-5 py-3 font-medium text-white hover:bg-cyan-600">
                  Sign in to place order
                </button>
              </SignInButton>
            )}
          </div>

          {message && <p className="text-sm text-slate-200">{message}</p>}
        </section>

        <aside className="h-fit rounded-3xl border border-white/10 bg-black/10 p-6">
          <h2 className="text-xl font-medium text-white">Order summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.product._id ?? item.product.title} className="flex items-center gap-4">
                <Image src={item.product.image} alt={item.product.title} width={64} height={64} unoptimized className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-white">{item.product.title}</div>
                  <div className="text-sm text-slate-300">Qty {item.quantity}</div>
                </div>
                <div className="text-sm font-medium text-cyan-300">${(Number(item.product.price) * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="text-lg font-medium text-white">Total</div>
            <div className="text-2xl font-semibold text-cyan-300">${total.toFixed(2)}</div>
          </div>
        </aside>
      </form>
    </main>
  )
}
