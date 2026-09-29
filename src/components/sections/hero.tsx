"use client"

import { ArrowRight } from "lucide-react"
import { FaWhatsapp, FaEnvelope, FaThreads, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa6"
import { MagneticButton } from "@/components/shared/magnetic-button"
import { WebGLHero } from "@/components/webgl/webgl-hero"
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
  return (
    <section
      id="hero-section"
      data-intro-hero
      className="relative min-h-screen overflow-hidden"
    >
      <WebGLHero />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 md:px-8">
        <div className="flex flex-col items-center text-center">
          <div
            data-hero-eyebrow
            className="mb-4 text-xs text-zinc-500"
          >
            Available for freelance projects
          </div>

          <h1
            data-hero-heading
            aria-label={profile.name}
            className="text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
          >
            {profile.name.split(" ").map((word, index, words) => (
              <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
                <span data-hero-word className="inline-block">
                  {word}{index < words.length - 1 ? "\u00a0" : ""}
                </span>
              </span>
            ))}
          </h1>

          <div
            data-hero-supporting
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
          </div>

          <p
            data-hero-supporting
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg"
          >
            {profile.tagline}
          </p>

          <div
            data-hero-supporting
            className="mt-6 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            <MagneticButton href="#about" size="md">
              About Me
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#work" variant="outline" size="md">
              View My Work
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
