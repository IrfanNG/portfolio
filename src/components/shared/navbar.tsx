"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { MagneticButton } from "@/components/shared/magnetic-button"

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "60183823063"
const waMessage = encodeURIComponent(
  "Hi Irfan, I have a project in mind and would like to discuss it.",
)
const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`

const sections = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
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
  return (
    <nav className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <div className="flex flex-col items-center gap-5">
        <button
          onClick={() => scrollTo("hero-section")}
          className="mb-2 text-[10px] font-bold tracking-tight text-zinc-600 transition-colors hover:text-zinc-300"
        >
          IA
        </button>
        <div className="h-12 w-px bg-zinc-800" />
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onNav(s.id)}
            className="group flex cursor-pointer items-center gap-3 py-1.5"
          >
            <span
              className="h-px transition-all duration-300 group-hover:w-6"
              style={{
                background: active === s.id ? "rgba(59,130,246,0.6)" : "rgba(63,63,70,1)",
                width: active === s.id ? "24px" : "12px",
              }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.15em] transition-all duration-300 group-hover:text-zinc-400"
              style={{
                color: active === s.id ? "rgba(148,163,184,1)" : "rgba(113,113,122,0.6)",
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
