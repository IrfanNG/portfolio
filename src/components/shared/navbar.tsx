"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/shared/magnetic-button"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "60183823063"
const waMessage = encodeURIComponent(
  "Hi Irfan, I have a project in mind and would like to discuss it.",
)
const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`

const sections = [
  { id: "work", label: "Work" },


  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth" })
}

function useActiveSection() {
  const [active, setActive] = useState("")
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function update() {
      const anchor = window.innerHeight * 0.35
      let closest = ""
      let closestDist = Infinity

      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top - anchor)
        if (dist < closestDist) {
          closestDist = dist
          closest = s.id
        }
      }

      setActive(closest)
      rafRef.current = null
    }

    function onScroll() {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return [active, setActive] as const
}

export function Navbar() {
  const pathname = usePathname()
  const [active, setActive] = useActiveSection()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = useCallback(
    (id: string) => {
      setActive(id)
      scrollTo(id)
    },
    [setActive],
  )

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), [])

  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = "hidden"
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile()
    }
    window.addEventListener("keydown", handler)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handler)
    }
  }, [mobileOpen, closeMobile])

  if (pathname.startsWith("/work/")) return null

  return (
    <>
      <DesktopNav active={active} onNav={handleNav} />
      <button
        data-intro-nav
        onClick={toggleMobile}
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center border border-zinc-800 bg-zinc-950 md:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-4 w-4 text-zinc-400" /> : <Menu className="h-4 w-4 text-zinc-400" />}
      </button>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-zinc-950/60 md:hidden"
              onClick={closeMobile}
            />
            <MobileDrawer active={active} onNav={handleNav} onClose={closeMobile} />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function DesktopNav({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  const { prefersReducedMotion } = useReducedMotion()
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  const resetProximity = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    sections.forEach((s, i) => {
      const line = lineRefs.current[i]
      const label = labelRefs.current[i]
      if (!line || !label) return
      const isActive = s.id === active
      line.style.width = isActive ? "24px" : "12px"
      line.style.background = isActive ? "rgba(59,130,246,0.6)" : "rgba(63,63,70,1)"
      label.style.color = isActive ? "rgba(148,163,184,1)" : "rgba(113,113,122,1)"
      label.style.opacity = isActive ? "1" : "0.5"
    })
  }, [active])

  const updateProximity = useCallback(
    (pointerY: number) => {
      const maxDist = 120
      sections.forEach((s, i) => {
        const el = itemRefs.current[i]
        if (!el) return
        const rect = el.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const distance = Math.abs(pointerY - centerY)
        const raw = Math.max(0, 1 - distance / maxDist)
        const factor = raw * raw * (3 - 2 * raw)

        const line = lineRefs.current[i]
        const label = labelRefs.current[i]
        if (!line || !label) return

        const isActive = s.id === active
        const restingWidth = isActive ? 24 : 12
        line.style.width = `${restingWidth + factor * (32 - restingWidth)}px`

        const lr = Math.round(63 + factor * (59 - 63))
        const lg = Math.round(63 + factor * (130 - 63))
        const lb = Math.round(70 + factor * (246 - 70))
        const la = isActive ? 0.6 + factor * 0.4 : 1 - factor * 0.4
        line.style.background = `rgba(${lr},${lg},${lb},${la})`

        const emphasis = isActive ? 1 : factor
        const rr = Math.round(113 + emphasis * (148 - 113))
        const rg = Math.round(113 + emphasis * (163 - 113))
        const rb = Math.round(122 + emphasis * (184 - 122))
        label.style.color = `rgba(${rr},${rg},${rb},1)`
        label.style.opacity = String(0.5 + emphasis * 0.5)
      })
    },
    [active],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (prefersReducedMotion) return
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => updateProximity(e.clientY))
    },
    [prefersReducedMotion, updateProximity],
  )

  const handlePointerLeave = useCallback(() => {
    resetProximity()
  }, [resetProximity])

  useEffect(() => {
    resetProximity()
  }, [active, resetProximity])

  return (
    <nav
      data-intro-nav
      className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 md:block"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="flex flex-col items-center gap-5">
        <button
          onClick={() => scrollTo("hero-section")}
          className="mb-2 text-[10px] font-bold tracking-tight text-zinc-600 transition-colors hover:text-zinc-300"
        >
          IA
        </button>
        <div className="h-12 w-px bg-zinc-800" />
        {sections.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            onClick={() => onNav(s.id)}
            className="flex cursor-pointer items-center gap-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label={`Navigate to ${s.label}`}
          >
            <span
              ref={(el) => {
                lineRefs.current[i] = el
              }}
              className="h-px"
              style={{
                background: active === s.id ? "rgba(59,130,246,0.6)" : "rgba(63,63,70,1)",
                width: active === s.id ? "24px" : "12px",
              }}
            />
            <span
              ref={(el) => {
                labelRefs.current[i] = el
              }}
              className="text-[10px] uppercase tracking-[0.15em]"
              style={{
                color: active === s.id ? "rgba(148,163,184,1)" : "rgba(113,113,122,1)",
                opacity: active === s.id ? 1 : 0.5,
              }}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}

function MobileDrawer({
  active,
  onNav,
  onClose,
}: {
  active: string
  onNav: (id: string) => void
  onClose: () => void
}) {
  return (
    <motion.div
      key="drawer"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
      className="fixed inset-y-0 right-0 z-40 flex w-72 flex-col border-l border-zinc-800 bg-zinc-950 md:hidden"
    >
      <div className="flex flex-1 flex-col justify-center gap-6 px-8">
        {sections.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            onClick={() => {
              onNav(s.id)
              onClose()
            }}
            className={cn(
              "text-left text-xl font-bold tracking-tight transition-colors",
              active === s.id ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            {s.label}
          </motion.button>
        ))}
      </div>

      <div className="border-t border-zinc-800 px-8 py-6">
        <MagneticButton href={waUrl} size="md">
          Start a Project
        </MagneticButton>
      </div>
    </motion.div>
  )
}
