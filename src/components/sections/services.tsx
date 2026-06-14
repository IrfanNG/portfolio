"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SectionShell, SectionHeading } from "@/components/shared/section-shell"
import { services } from "@/data/services"
import type { Service } from "@/types"

const num = (i: number) => String(i + 1).padStart(2, "0")

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group border border-zinc-800 bg-zinc-900/20 p-6 transition-colors duration-500 md:p-8"
      style={{
        borderColor: hovered ? "rgba(59,130,246,0.2)" : "",
      }}
    >
      <span
        className="inline-block text-xs font-mono tracking-wider transition-colors duration-500"
        style={{ color: hovered ? "rgba(148,163,184,1)" : "rgba(113,113,122,0.6)" }}
      >
        {num(index)}
      </span>

      <h3 className="mt-4 text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
        {service.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {service.description}
      </p>

      <ul className="mt-5 space-y-2 border-t border-zinc-800/60 pt-5">
        {service.deliverables.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-zinc-500">
            <span
              className="h-px w-4 transition-colors duration-500"
              style={{ background: hovered ? "rgba(59,130,246,0.4)" : "rgba(63,63,70,1)" }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function ServicesSection() {
  return (
    <SectionShell id="services">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(80px,14vw,200px)] font-black text-white/[0.03]">
        SERVICES
      </div>

      <SectionHeading label="Services" title="What I Can Do For You" />

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>
    </SectionShell>
  )
}
