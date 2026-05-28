"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Show, SignUpButton, UserButton, useAuth, useUser } from "@clerk/nextjs"
import { useCart } from "../context/CartContext"

export default function NavBar() {
  const { isSignedIn } = useAuth()
  const { isLoaded, user } = useUser()
  const syncedUserIdRef = useRef<string | null>(null)
  const { items } = useCart()
  const count = items.reduce((s, it) => s + it.quantity, 0)

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user?.id || syncedUserIdRef.current === user.id) {
        return
      }

      try {
        const primaryEmail = user.emailAddresses[0]?.emailAddress
        if (!primaryEmail) return

        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkId: user.id,
            email: primaryEmail,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            imageUrl: user.imageUrl || '',
          }),
        })

        if (response.ok) {
          syncedUserIdRef.current = user.id
        }
      } catch {
        // user sync should not block the UI
      }
    }

    syncUser()
  }, [isLoaded, isSignedIn, user])

  return (
    <header className="w-full fixed left-0 top-4 z-50 pointer-events-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-4 flex items-center justify-between gap-6 rounded-full border border-white/10 bg-white/8 px-4 py-2 backdrop-blur-sm shadow-lg pointer-events-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
              <span className="text-lg font-semibold tracking-tight text-white">Ecomm</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-slate-200 hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium text-slate-200 hover:text-white">
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn && (
              <Link href="/checkout" className="relative flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-400/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                Checkout
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white">
                    {count}
                  </span>
                )}
              </Link>
            )}

            <div className="flex items-center gap-2">
              <Show when="signed-out">
                <Link href="/sign-in" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10">
                  Sign in
                </Link>
                <SignUpButton>
                  <button className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-400/20">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <div className="rounded-full border border-white/10 bg-white/5 p-1">
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
