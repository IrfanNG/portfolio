"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { SectionShell, SectionHeading, SectionWatermark } from "@/components/shared/section-shell"
import { profile } from "@/data/profile"

const techStack = ["Next.js", "React", "TypeScript", "Tailwind", "Node.js"]

export function AboutSection() {
  return (
    <SectionShell id="about" className="relative">
      <SectionWatermark>ABOUT</SectionWatermark>
      <SectionHeading label="About" title="The Developer Behind the Code" />

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
        >
          <p className="text-base leading-relaxed text-zinc-300">
            I&apos;m a full-stack developer based in {profile.location}, focused on building fast,
            reliable, and visually refined digital products. I work across websites, web apps,
            dashboards, and internal systems — combining clean engineering with thoughtful interface
            craft.
          </p>
          <p className="mt-5 text-base leading-relaxed text-zinc-500">
            My goal is simple: help businesses turn rough ideas into polished systems that are easy
            to use, easy to scale, and ready to ship.
          </p>
        </motion.div>

        <FactsPanel />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-800/60 pt-6"
      >
        {techStack.map((tech) => (
          <span key={tech} className="border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-600">
            {tech}
          </span>
        ))}
      </motion.div>
    </SectionShell>
  )
}

function FactsPanel() {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const facts = [
    { label: "Location", value: `Based in ${profile.location}` },
    { label: "Focus", value: "Focused on freelance systems" },
    { label: "Scope", value: "Frontend, backend, and deployment" },
    { label: "Status", value: "Available for selected projects" },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border bg-zinc-900/20 p-6 transition-colors duration-500 md:p-8"
      style={{
        borderColor: hovered ? "rgba(59,130,246,0.2)" : "rgba(39,39,42,1)",
      }}
    >
      <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
        Quick Facts
      </h3>

      <div className="space-y-5">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-baseline gap-4">
            <span className="w-16 shrink-0 text-[10px] uppercase tracking-wider text-zinc-600">
              {fact.label}
            </span>
            <span
              className="h-px flex-1 transition-colors duration-500"
              style={{ background: hovered ? "rgba(59,130,246,0.15)" : "rgba(39,39,42,1)" }}
            />
            <span className="text-sm text-zinc-300">{fact.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
