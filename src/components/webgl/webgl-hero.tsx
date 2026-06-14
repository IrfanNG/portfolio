"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { DeveloperDeskScene } from "./developer-desk-scene"

function Scene() {
  return <DeveloperDeskScene />
}

export function WebGLHero() {
  const { prefersReducedMotion } = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black" />
    )
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
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
