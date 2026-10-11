"use client"

// Must evaluate before R3F's <Canvas> mounts its internal THREE.Clock.
import "@/lib/suppress-three-clock-warning"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { DeveloperDeskScene } from "./developer-desk-scene"

function Scene() {
  return <DeveloperDeskScene />
}

export function WebGLHero() {
  const { prefersReducedMotion } = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black" />
    )
  }

  return (
    <div ref={containerRef} className="absolute inset-0" data-hero-ambient>
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#09090b" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
