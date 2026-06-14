"use client"

import { useRef, useEffect } from "react"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"

interface Blob {
  x: number
  y: number
  radius: number
  opacity: number
  stretch: number
  angle: number
}

export function CursorSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { prefersReducedMotion } = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let mouseX = -1000
    let mouseY = -1000
    let posX = -1000
    let posY = -1000
    let prevX = -1000
    let prevY = -1000
    let blobs: Blob[] = []
    let rafId: number

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const isTouch = "ontouchstart" in window
    if (isTouch) return

    function onMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", onMove)

    function animate() {
      prevX = posX
      prevY = posY
      posX += (mouseX - posX) * 0.08
      posY += (mouseY - posY) * 0.08

      const dx = posX - prevX
      const dy = posY - prevY
      const speed = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      if (speed > 0.5) {
        blobs.push({
          x: posX,
          y: posY,
          radius: 8 + Math.min(speed * 2.5, 40),
          opacity: Math.min(0.08 + speed * 0.004, 0.18),
          stretch: Math.min(speed * 0.15, 2.5),
          angle,
        })
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i]
        b.radius += 0.6
        b.opacity -= 0.0035
        b.stretch = Math.max(b.stretch - 0.02, 1)

        if (b.opacity <= 0) {
          blobs.splice(i, 1)
          continue
        }

        const rx = b.radius * b.stretch
        const ry = b.radius

        ctx!.save()
        ctx!.translate(b.x, b.y)
        ctx!.rotate(b.angle)

        ctx!.beginPath()
        ctx!.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
        const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, rx)
        grad.addColorStop(0, `rgba(59, 130, 246, ${b.opacity})`)
        grad.addColorStop(0.4, `rgba(20, 184, 166, ${b.opacity * 0.5})`)
        grad.addColorStop(1, "rgba(59, 130, 246, 0)")
        ctx!.fillStyle = grad
        ctx!.fill()

        ctx!.beginPath()
        ctx!.ellipse(0, 0, rx * 1.6, ry * 1.6, 0, 0, Math.PI * 2)
        const outerGrad = ctx!.createRadialGradient(0, 0, 0, 0, 0, rx * 1.6)
        outerGrad.addColorStop(0, `rgba(10, 40, 60, ${b.opacity * 0.4})`)
        outerGrad.addColorStop(1, "rgba(10, 40, 60, 0)")
        ctx!.fillStyle = outerGrad
        ctx!.fill()

        ctx!.restore()
      }

      if (blobs.length > 400) {
        blobs = blobs.slice(-400)
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  )
}
