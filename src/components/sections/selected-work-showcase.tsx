"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { projects } from "@/data/projects"
import { cn } from "@/lib/utils"
import { MobileHorizontalScroll } from "./mobile-horizontal-scroll"
import type { Project } from "@/types"

function ShowcasePanel({
  project,
  index,
  isActive,
  onActivate,
}: {
  project: Project
  index: number
  isActive: boolean
  onActivate: (index: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    margin: "-35% 0px -35% 0px",
    amount: "some",
  })

  useEffect(() => {
    if (isInView) onActivate(index)
  }, [isInView, index, onActivate])

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[60vh] flex-col justify-center transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-30",
      )}
    >
      <span className="mb-3 text-[10px] font-mono uppercase tracking-wider text-zinc-600">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl lg:text-5xl">
        {project.title}
      </h3>
      <span className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
        {project.category}
      </span>
      <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-500">
        {project.description}
      </p>
    </div>
  )
}

function PreviewFrame({
  project,
  priority = false,
}: {
  project: Project
  priority?: boolean
}) {
  const isMobile = project.previewType === "mobile"

  return (
    <div className="border border-zinc-800 bg-zinc-950/70">
      <div className="flex items-center gap-1.5 border-b border-zinc-800/60 px-3 py-2.5">
        <span className="h-2 w-2 bg-red-500/50" />
        <span className="h-2 w-2 bg-yellow-500/50" />
        <span className="h-2 w-2 bg-green-500/50" />
        <span className="ml-2 text-[9px] font-mono uppercase tracking-wider text-zinc-600">
          {isMobile ? "mobile showcase" : "web preview"}
        </span>
      </div>
      <div
        className={cn(
          "relative overflow-hidden bg-zinc-950",
          isMobile ? "aspect-[16/10]" : "aspect-[16/9]",
        )}
      >
        <Image
          src={project.image}
          alt={`${project.title} project showcase`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className={cn("object-contain", isMobile ? "p-3 md:p-5" : "p-0")}
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/[0.03]" />
      </div>
    </div>
  )
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-5 text-[10px] uppercase tracking-wider">
        <span
          className={cn(
            project.status === "live"
              ? "text-emerald-400/80"
              : project.status === "development"
                ? "text-amber-400/80"
                : "text-zinc-500",
          )}
        >
          {project.status}
        </span>
        {(project.liveUrl || project.githubUrl) && (
          <span className="text-zinc-700">/</span>
        )}
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

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-mono uppercase tracking-wider text-zinc-600"
          >
            {tech}
          </span>
        ))}
      </div>

      <Link
        href={`/work/${project.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-all duration-300 hover:text-zinc-400"
      >
        <span>View case study</span>
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function DesktopShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = projects[activeIndex]

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  return (
    <div className="hidden md:flex">
      <div className="w-1/2 pr-12">
        {projects.map((project, index) => (
          <ShowcasePanel
            key={project.slug}
            project={project}
            index={index}
            isActive={index === activeIndex}
            onActivate={handleActivate}
          />
        ))}
      </div>

      <div className="w-1/2">
        <div className="sticky top-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.slug}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
            >
              <PreviewFrame project={activeProject} />
              <ProjectMeta project={activeProject} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function SelectedWorkShowcase() {
  return (
    <>
      <DesktopShowcase />
      <div className="md:hidden">
        <MobileHorizontalScroll />
      </div>
    </>
  )
}
