"use client"

import { motion } from "framer-motion"
import { SectionShell, SectionHeading } from "@/components/shared/section-shell"
import { skills } from "@/data/skills"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
}

export function TechStackSection() {
  return (
    <SectionShell id="stack">
      <SectionHeading label="Tech Stack" title="Tools & Technologies" />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {skills.map((skillGroup) => (
          <div key={skillGroup.category}>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500">
              {skillGroup.category}
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-wrap gap-2"
            >
              {skillGroup.items.map((skill) => (
                <motion.span
                  key={skill}
                  variants={itemVariants}
                  className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
