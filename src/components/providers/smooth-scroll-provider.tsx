"use client"

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "./reduced-motion-provider"

gsap.registerPlugin(ScrollTrigger)

type SmoothScrollControls = {
  pause: () => void
  resume: () => void
}

const SmoothScrollContext = createContext<SmoothScrollControls>({
  pause: () => {},
  resume: () => {},
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { prefersReducedMotion } = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const pausedRef = useRef(false)

  const pause = useCallback(() => {
    pausedRef.current = true
    lenisRef.current?.stop()
  }, [])

  const resume = useCallback(() => {
    pausedRef.current = false
    lenisRef.current?.start()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    })

    lenisRef.current = lenis
    if (pausedRef.current || document.documentElement.dataset.introActive === "true") {
      lenis.stop()
    }

    const onScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onScroll)

    const ticker = gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off("scroll", onScroll)
      gsap.ticker.remove(ticker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [prefersReducedMotion])

  return (
    <SmoothScrollContext.Provider value={{ pause, resume }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
