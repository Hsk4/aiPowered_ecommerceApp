'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'

type Product = {
  _id?: string
  title: string
  description?: string
  price: string | number
  category?: string
  image: string
}

type CartItem = {
  product: Product
  quantity: number
}

type CartItemPayload = {
  product: string | undefined
  title: string
  price: number
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  updateQty: (productId: string | undefined, qty: number) => void
  removeItem: (productId: string | undefined) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'ecomm_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const syncedCartKeyRef = useRef<string | null>(null)

  // initial items are loaded via lazy useState initializer to avoid setState in effect

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.warn('Failed to persist cart', e)
    }
  }, [items])

  useEffect(() => {
    const syncCart = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) {
        syncedCartKeyRef.current = null
        return
      }

      const payloadKey = `${user.id}:${JSON.stringify(items.map((item) => ({ id: item.product._id, quantity: item.quantity })))}`
      if (syncedCartKeyRef.current === payloadKey) {
        return
      }

      try {
        const payload: CartItemPayload[] = items.map((item) => ({
          product: item.product._id,
          title: item.product.title,
          price: Number(item.product.price),
          quantity: item.quantity,
        }))

        const response = await fetch('/api/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clerkId: user.id, items: payload }),
        })

        if (response.ok) {
          syncedCartKeyRef.current = payloadKey
        }
      } catch (error) {
        console.warn('Failed to sync cart to MongoDB', error)
      }
    }

    syncCart()
  }, [items, isLoaded, isSignedIn, user?.id])

  const addItem = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id && product._id !== undefined)
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [{ product, quantity: qty }, ...prev]
    })
  }

  const updateQty = (productId: string | undefined, qty: number) => {
    setItems((prev) => prev.map((i) => (i.product._id === productId ? { ...i, quantity: Math.max(0, qty) } : i)).filter(i => i.quantity > 0))
  }

  const removeItem = (productId: string | undefined) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId))
  }

  const clear = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export type { CartItem, Product }
