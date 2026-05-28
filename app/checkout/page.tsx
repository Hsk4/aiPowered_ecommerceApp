"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "../context/CartContext"

export default function CheckoutPage() {
  const { items, updateQty, removeItem, clear } = useCart()
  const router = useRouter()

  const total = items.reduce((s, it) => s + Number(it.product.price) * it.quantity, 0)

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 text-slate-100 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Checkout</h1>
          <p className="mt-2 text-sm text-slate-400">Review your cart before going to payment</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-slate-300">No items in cart</p>
      ) : (
        <div className="mt-8 grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.product._id ?? it.product.title} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/10 p-4">
                <div className="flex items-center gap-4">
                  <Image src={it.product.image} alt={it.product.title} width={72} height={72} unoptimized className="h-18 w-18 rounded-xl object-cover" />
                  <div>
                    <div className="font-medium text-white">{it.product.title}</div>
                    <div className="text-sm text-slate-300">${Number(it.product.price).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) => updateQty(it.product._id, Number(e.target.value))}
                    className="w-20 rounded border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
                  />
                  <button onClick={() => removeItem(it.product._id)} className="text-sm text-rose-400">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/10 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="text-lg font-medium text-white">Cart total</div>
              <div className="text-2xl font-semibold text-cyan-300">${total.toFixed(2)}</div>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>• Shipping details and payment info will be collected on the next page.</p>
              <p>• You can still change quantities here before continuing.</p>
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button onClick={() => clear()} className="rounded-md border border-white/10 px-4 py-2 text-sm text-white">Clear cart</button>
              <button onClick={() => router.push('/checkout/payment')} className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-white hover:bg-cyan-600">
                Proceed to payment
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
