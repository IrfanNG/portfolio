"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"
import { useReducedMotion } from "./reduced-motion-provider"

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { prefersReducedMotion } = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}
