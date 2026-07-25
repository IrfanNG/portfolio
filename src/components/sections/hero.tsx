"use client"

import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { FaWhatsapp, FaEnvelope, FaTiktok, FaThreads, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa6"
import { MagneticButton } from "@/components/shared/magnetic-button"
import { AnimatedText } from "@/components/shared/animated-text"
import { WebGLHero } from "@/components/webgl/webgl-hero"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { profile } from "@/data/profile"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  whatsapp: FaWhatsapp,
  email: FaEnvelope,
  instagram: FaInstagram,
  threads: FaThreads,
  github: FaGithub,
  linkedin: FaLinkedin,
}

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion } = useReducedMotion()

  const isInView = useInView(sectionRef, { amount: 0.45 })

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative min-h-screen overflow-hidden"
    >
      <WebGLHero />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 md:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="mb-4 text-xs text-zinc-500"
          >
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
            className="mt-4 flex items-center gap-4"
          >
            {profile.socialLinks.map((link) => {
              const Icon = iconMap[link.icon]
              if (!Icon) return null
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto text-zinc-500 transition-colors duration-300 hover:text-zinc-200"
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </motion.div>

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
            <MagneticButton href="#about" size="lg">
              About Me
              <ArrowRight className="h-5 w-5" />
            </MagneticButton>
            <MagneticButton href="#work" variant="outline" size="lg">
              View My Work
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
