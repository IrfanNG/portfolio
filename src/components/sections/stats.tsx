"use client"

import { AnimatedCounter } from "@/components/shared/animated-counter"

export function StatsSection() {
  return (
    <section className="relative border-t border-b border-zinc-800/60 px-4 py-24 md:py-32 lg:px-16 xl:px-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(80px,14vw,200px)] font-black text-white/[0.04]">
        SHIPPED
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[clamp(72px,16vw,140px)] font-bold tracking-tight leading-none text-zinc-100">
            <AnimatedCounter target={11} suffix="+" />
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Projects shipped
          </span>
        </div>

        <p className="mx-auto mt-8 max-w-lg text-sm leading-relaxed text-zinc-600">
          From landing pages to full-stack systems — shipped with performance, responsiveness, and
          clean execution.
        </p>
      </div>
    </section>
  )
}
