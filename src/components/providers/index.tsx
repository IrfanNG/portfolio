"use client"

import { ReducedMotionProvider } from "./reduced-motion-provider"
import { SmoothScrollProvider } from "./smooth-scroll-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReducedMotionProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </ReducedMotionProvider>
  )
}
