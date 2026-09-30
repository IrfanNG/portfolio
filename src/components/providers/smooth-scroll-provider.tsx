"use client"

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { useReducedMotion } from "./reduced-motion-provider"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

type ScrollOwner = "intro" | "menu"
type SmoothScrollControls = {
  pause: (owner?: ScrollOwner) => void
  resume: (owner?: ScrollOwner) => void
  scrollTo: (target: string | number, smooth?: boolean) => void
  ready: boolean
}

const SmoothScrollContext = createContext<SmoothScrollControls>({
  pause: () => {}, resume: () => {}, scrollTo: () => {}, ready: false,
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { prefersReducedMotion } = useReducedMotion()
  const smootherRef = useRef<ScrollSmoother | null>(null)
  const locks = useRef(new Set<ScrollOwner>())
  const [readyPath, setReadyPath] = useState<string | null>(null)

  const scrollTo = useCallback((target: string | number, smooth = true) => {
    const element = typeof target === "string" ? document.getElementById(target.replace(/^#/, "")) : null
    if (typeof target === "string" && !element) return
    if (smootherRef.current) {
      smootherRef.current.scrollTo(element ?? target, smooth, "top top")
    } else if (element) {
      element.scrollIntoView({ behavior: smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "instant" })
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "instant" })
    }
  }, [])

  const pause = useCallback((owner: ScrollOwner = "intro") => {
    locks.current.add(owner)
    smootherRef.current?.paused(true)
  }, [])

  const resume = useCallback((owner: ScrollOwner = "intro") => {
    locks.current.delete(owner)
    if (locks.current.size) return
    smootherRef.current?.paused(false)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (owner === "intro" && window.location.hash) scrollTo(window.location.hash, false)
    })
  }, [scrollTo])

  useLayoutEffect(() => {
    const wrapper = document.getElementById("smooth-wrapper")
    const content = document.getElementById("portfolio-content")
    let smoother: ScrollSmoother | undefined
    if (pathname === "/" && wrapper && content && !prefersReducedMotion) {
      smoother = ScrollSmoother.create({ wrapper, content, smooth: 0.8, smoothTouch: 0.1, effects: false })
      smootherRef.current = smoother
      if (locks.current.size || document.documentElement.dataset.introActive === "true") smoother.paused(true)
    }
    const frame = requestAnimationFrame(() => setReadyPath(pathname))
    const handleHash = () => {
      if (!locks.current.size && window.location.hash) scrollTo(window.location.hash, false)
    }
    const handleAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname !== pathname || !url.hash || !document.getElementById(url.hash.slice(1))) return
      event.preventDefault()
      if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash)
      scrollTo(url.hash)
    }
    document.addEventListener("click", handleAnchor)
    window.addEventListener("hashchange", handleHash)
    window.addEventListener("popstate", handleHash)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("click", handleAnchor)
      window.removeEventListener("hashchange", handleHash)
      window.removeEventListener("popstate", handleHash)
      smoother?.kill()
      if (smootherRef.current === smoother) smootherRef.current = null
    }
  }, [pathname, prefersReducedMotion, scrollTo])

  return (
    <SmoothScrollContext.Provider value={{ pause, resume, scrollTo, ready: readyPath === pathname }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
