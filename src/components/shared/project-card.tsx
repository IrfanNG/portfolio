"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/types"
import { cn } from "@/lib/utils"

function ProjectPreview({ project }: { project: Project }) {
  const isMobilePreview = project.previewType === "mobile"

  return (
    <div className="border border-zinc-800 bg-zinc-950/70">
      <div className="flex items-center gap-1.5 border-b border-zinc-800/60 px-3 py-2.5">
        <span className="h-2 w-2 bg-red-500/50" />
        <span className="h-2 w-2 bg-yellow-500/50" />
        <span className="h-2 w-2 bg-green-500/50" />
        <span className="ml-2 text-[9px] font-mono uppercase tracking-wider text-zinc-600">
          {isMobilePreview ? "mobile showcase" : "web preview"}
        </span>
      </div>

      <div
        className={cn(
          "relative overflow-hidden bg-zinc-950",
          isMobilePreview ? "aspect-[16/10]" : "aspect-[16/9]",
        )}
      >
        <Image
          src={project.image}
          alt={`${project.title} project showcase`}
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className={cn(
            "object-contain opacity-80 grayscale-[18%] transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100 group-hover:grayscale-0",
            isMobilePreview ? "p-3 md:p-5" : "p-0",
          )}
          priority={project.title === "CetakNow"}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/[0.03]" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute inset-x-0 top-0 h-px bg-blue-400/40" />
          <div className="absolute bottom-0 right-0 h-24 w-32 bg-blue-500/10 blur-3xl" />
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
        borderColor: hovered ? "rgba(59,130,246,0.22)" : "",
      }}
    >
      <div className={`flex flex-col md:flex-row ${isReversed ? "md:flex-row-reverse" : ""}`}>
        <div className="relative w-full md:w-[55%]">
          <div className="p-4 md:p-6">
            <ProjectPreview project={project} />
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: hovered
                ? "radial-gradient(520px at 50% 50%, rgba(59,130,246,0.06), transparent 70%)"
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

            {(project.liveUrl || project.githubUrl) && <span className="text-zinc-700">/</span>}

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

          <Link
            href={`/work/${project.slug}`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-all duration-300 hover:text-zinc-400"
          >
            <span>View case study</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
