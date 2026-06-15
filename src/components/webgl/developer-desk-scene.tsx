"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function Particles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!)
  const elapsedRef = useRef(0)

  const geometry = useMemo(() => {
    const r = seededRandom(42)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * 20
      pos[i * 3 + 1] = (r() - 0.5) * 14
      pos[i * 3 + 2] = (r() - 0.5) * 12
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    return geo
  }, [count])

  const velocities = useMemo(() => {
    const r = seededRandom(137)
    return Float32Array.from({ length: count }, () => 0.001 + r() * 0.003)
  }, [count])

  useFrame(({ pointer }, delta) => {
    if (!meshRef.current) return
    elapsedRef.current += delta
    const attr = meshRef.current.geometry.attributes.position
    const array = attr.array as Float32Array
    const time = elapsedRef.current
    const px = pointer.x * 4
    const py = pointer.y * 3

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      array[i3 + 1] += Math.sin(time * velocities[i] + array[i3] * 0.3) * 0.0002
      array[i3] += Math.cos(time * velocities[i] * 0.7 + array[i3 + 1] * 0.3) * 0.0001

      const dx = array[i3] - px
      const dy = array[i3 + 1] - py
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 2.5) {
        const force = (1 - dist / 2.5) * 0.002
        array[i3] += dx * force
        array[i3 + 1] += dy * force
      }
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Atmosphere() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Particles />
    </>
  )
}

export function DeveloperDeskScene() {
  return <Atmosphere />
}
