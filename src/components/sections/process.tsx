"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SectionShell, SectionHeading, SectionWatermark } from "@/components/shared/section-shell"
import { processSteps } from "@/data/process"

const num = (i: number) => String(i).padStart(2, "0")

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  const lineFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <SectionShell id="process" className="relative">
      <SectionWatermark>PROCESS</SectionWatermark>
      <SectionHeading label="Process" title="How I Work" />

      <div ref={containerRef} className="relative mx-auto max-w-3xl">
        <div className="absolute left-[27px] top-0 hidden h-full w-px bg-zinc-800 md:block">
          <motion.div
            className="w-full bg-gradient-to-b from-blue-500/40 to-teal-500/40"
            style={{ height: lineFill }}
          />
        </div>

        <div className="space-y-16 md:space-y-20">
          {processSteps.map((step, index) => (
            <StepRow key={step.step} step={step} index={index} />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

function StepRow({ step, index }: { step: (typeof processSteps)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0, 1] }}
      className="relative flex flex-col gap-3 md:flex-row md:gap-0"
    >
      <div className="flex items-start gap-4 md:w-48 md:flex-col md:gap-2">
        <span
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center border bg-zinc-950 text-sm font-mono font-bold tracking-wider transition-all duration-500"
          style={{
            borderColor: isVisible ? "rgba(59,130,246,0.5)" : "rgba(63,63,70,1)",
            color: isVisible ? "rgba(148,163,184,1)" : "rgba(113,113,122,0.6)",
          }}
        >
          {num(step.step)}
        </span>
        <h3 className="pt-1 text-lg font-bold tracking-tight text-zinc-100 md:pt-0 md:text-xl">
          {step.title}
        </h3>
      </div>

      <motion.div
        className="ml-16 flex-1 md:ml-0 md:pl-10"
        animate={{ opacity: isVisible ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
          {step.description}
        </p>
      </motion.div>
    </motion.div>
  )
}
