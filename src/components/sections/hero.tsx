"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { MagneticButton } from "@/components/shared/magnetic-button"
import { AnimatedText } from "@/components/shared/animated-text"
import { WebGLHero } from "@/components/webgl/webgl-hero"
import { profile } from "@/data/profile"

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "60123456789"
const waMessage = encodeURIComponent(
  "Hi Irfan, I'm interested in building a website/system. Can we discuss?",
)
const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null

export function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen overflow-hidden"
    >
      <WebGLHero />

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(120px,20vw,280px)] font-black text-white/5">
        DEVELOPER
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 md:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="mb-4 inline-flex items-center gap-2 text-xs text-zinc-500"
          >
            <Sparkles className="h-3 w-3 text-blue-400" />
            Available for freelance projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
            className="text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
          >
            <AnimatedText text={profile.name} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: [0.25, 0.1, 0, 1] }}
            className="mt-1 text-base text-zinc-400 md:text-lg"
          >
            {profile.role} &middot; {profile.location}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.1, 0, 1] }}
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease: [0.25, 0.1, 0, 1] }}
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
          >
            {waUrl && (
              <MagneticButton href={waUrl} size="lg">
                Start a Project
                <ArrowRight className="h-5 w-5" />
              </MagneticButton>
            )}
            <MagneticButton href="#work" variant="outline" size="lg">
              View My Work
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
