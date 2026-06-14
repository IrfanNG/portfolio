"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/types"

function ProjectPreview() {
  return (
    <div className="border border-zinc-800 bg-zinc-900/80">
      <div className="flex items-center gap-1.5 border-b border-zinc-800/60 px-3 py-2.5">
        <span className="h-2 w-2 bg-red-500/40" />
        <span className="h-2 w-2 bg-yellow-500/40" />
        <span className="h-2 w-2 bg-green-500/40" />
        <span className="ml-2 text-[9px] font-mono uppercase tracking-wider text-zinc-600">preview</span>
      </div>
      <div className="flex aspect-[4/3] items-center justify-center p-5">
        <div className="flex h-full w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="h-2 w-8 bg-blue-500/30" />
              <span className="h-2 w-12 bg-zinc-800/50" />
            </div>
            <div className="flex gap-1">
              <span className="h-2 w-2 bg-zinc-800/40" />
              <span className="h-2 w-2 bg-zinc-800/40" />
              <span className="h-2 w-2 bg-zinc-800/40" />
            </div>
          </div>
          <div className="flex flex-1 gap-3">
            <div className="flex flex-1 flex-col justify-end gap-2">
              <div className="h-16 bg-gradient-to-t from-blue-500/15 to-transparent" />
              <div className="flex gap-1">
                <span className="h-6 flex-1 bg-blue-500/10" />
                <span className="h-6 flex-1 bg-teal-500/10" />
                <span className="h-6 flex-1 bg-blue-500/10" />
                <span className="h-6 flex-1 bg-teal-500/10" />
              </div>
            </div>
            <div className="flex w-1/4 flex-col gap-1.5">
              <span className="h-2 flex-1 bg-zinc-800/40" />
              <span className="h-2 flex-1 bg-zinc-800/30" />
              <span className="h-2 flex-1 bg-zinc-800/40" />
              <span className="h-2 flex-1 bg-zinc-800/20" />
            </div>
          </div>
          <div className="flex gap-2">
            <span className="h-1.5 flex-1 bg-zinc-800/30" />
            <span className="h-1.5 w-16 bg-zinc-800/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const isReversed = index % 2 === 1

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group border border-zinc-800 bg-zinc-900/20 transition-colors duration-500"
      style={{
        borderColor: hovered ? "rgba(59,130,246,0.15)" : "",
      }}
    >
      <div className={`flex flex-col md:flex-row ${isReversed ? "md:flex-row-reverse" : ""}`}>
        <div className="relative w-full md:w-[55%]">
          <div className="p-4 md:p-6">
            <ProjectPreview />
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: hovered
                ? "radial-gradient(500px at 50% 50%, rgba(59,130,246,0.04), transparent 70%)"
                : "none",
            }}
          />
        </div>

        <div className="flex w-full flex-col justify-center border-t border-zinc-800 px-6 py-8 md:w-[45%] md:border-t-0 md:px-10 md:py-12">
          <span className="mb-2 inline-block text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
            {project.category}
          </span>

          <h3 className="text-2xl font-bold tracking-tight text-zinc-100 md:text-3xl">
            {project.title}
          </h3>

          <p className="mt-3 text-base leading-relaxed text-zinc-400">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
            {project.techStack.map((tech) => (
              <span key={tech} className="text-[10px] font-mono uppercase tracking-wider text-zinc-600">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-5 text-[10px] uppercase tracking-wider">
            <span
              className={
                project.status === "live"
                  ? "text-emerald-400/80"
                  : project.status === "development"
                    ? "text-amber-400/80"
                    : "text-zinc-500"
              }
            >
              {project.status}
            </span>

            <span className="text-zinc-700">/</span>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-blue-400"
              >
                Open Live
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-zinc-300"
              >
                Source
              </a>
            )}
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-sm text-zinc-600 transition-all duration-300">
            <span className="transition-all duration-300" style={{ color: hovered ? "rgba(148,163,184,1)" : "" }}>
              View case study
            </span>
            <ArrowUpRight
              className="h-4 w-4 transition-all duration-300"
              style={{
                transform: hovered ? "translate(3px, -3px)" : "",
                color: hovered ? "rgba(148,163,184,1)" : "",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
