import React from "react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#070b17] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(7,11,23,1))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              About this demo
            </span>
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                About this AI-powered storefront
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                This demo store shows how to integrate AI search with a simple
                e-commerce frontend. It uses Tailwind for styling and a small dataset
                seeded locally.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-400">Tech</p>
              <p className="mt-2 text-3xl font-semibold text-white">Next.js</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-400">AI</p>
              <p className="mt-2 text-3xl font-semibold text-white">GenAI</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-sm text-slate-400">Design</p>
              <p className="mt-2 text-3xl font-semibold text-white">Tailwind</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white">Our mission</h2>
          <p className="mt-4 text-slate-300">
            Build small, useful tools that demonstrate full-stack patterns and AI
            integrations in a compact, developer-friendly demo.
          </p>
        </div>
      </section>
    </main>
  )
}
