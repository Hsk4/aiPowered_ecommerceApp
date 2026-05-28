"use client"

import React from "react"
import { SignIn } from "@clerk/nextjs"
import { useSearchParams } from "next/navigation"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/'

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 text-white sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Clerk</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Sign in</h1>
          <p className="mt-3 text-sm text-slate-300">Sign in to continue shopping and add items to your cart.</p>
        </div>

        <SignIn routing="path" path="/sign-in" forceRedirectUrl={redirectUrl} fallbackRedirectUrl="/" />
      </div>
    </main>
  )
}
