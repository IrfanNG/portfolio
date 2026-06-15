"use client"

import { useRef, useState, useEffect } from "react"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"

export function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const [done, setDone] = useState(false)
  const { prefersReducedMotion } = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const duration = 1400
        const start = performance.now()
        function tick(now: number) {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(eased * target))
          if (progress >= 1) setDone(true)
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <span>{target}{suffix}</span>
  }

  return (
    <span ref={ref}>
      {display}
      {done && suffix}
    </span>
  )
}
