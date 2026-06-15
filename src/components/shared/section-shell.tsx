"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"

interface SectionShellProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionShell({ children, className, id }: SectionShellProps) {
  const { prefersReducedMotion } = useReducedMotion()

  return (
    <motion.section
      id={id}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
      className={cn(
        "relative w-full px-4 py-20 md:px-8 md:py-28 lg:px-16 xl:px-24",
        className,
      )}
    >
      <motion.div
        initial={prefersReducedMotion ? {} : { y: 24 }}
        whileInView={prefersReducedMotion ? {} : { y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
        className="mx-auto max-w-7xl"
      >
        {children}
      </motion.div>
    </motion.section>
  )
}

export function SectionHeading({
  label,
  title,
  className,
}: {
  label?: string
  title: string
  className?: string
}) {
  const { prefersReducedMotion } = useReducedMotion()

  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      {label && (
        <motion.span
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
          className="mb-2 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
        className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
    </div>
  )
}

export function SectionWatermark({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion } = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <motion.div
      ref={ref}
      style={prefersReducedMotion ? {} : { y }}
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(80px,14vw,200px)] font-black text-white/[0.06]",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
