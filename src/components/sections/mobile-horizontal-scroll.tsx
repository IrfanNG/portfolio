"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { projects } from "@/data/projects"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { cn } from "@/lib/utils"
import type { Project } from "@/types"

const PANEL_GAP = 16

function ProjectPanel({
  project,
  index,
  stacked = false,
}: {
  project: Project
  index: number
  stacked?: boolean
}) {
  const isMobile = project.previewType === "mobile"

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Panel ${index + 1} of ${projects.length}`}
      className={cn(
        "relative flex-none overflow-hidden py-6",
        stacked ? "w-full" : "w-screen snap-start",
      )}
    >
      <div className="relative flex flex-col gap-3 px-5">
        <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-400">
          <span>{project.category}</span>
        </div>
        <div className="border-y border-zinc-800 bg-zinc-950/70">
          <div
            className={cn(
              "relative w-full overflow-hidden bg-zinc-950",
              isMobile ? "aspect-[3/2]" : "aspect-video",
            )}
          >
            <Image
              src={project.image}
              alt={`${project.title} project showcase`}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold tracking-tight text-zinc-100">{project.title}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] uppercase tracking-wider text-zinc-600"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider">
          <span
            className={cn(
              project.status === "live"
                ? "text-emerald-400/90"
                : project.status === "development"
                  ? "text-amber-400/90"
                  : "text-zinc-400/90",
            )}
          >
            {project.status}
          </span>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Open Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-200"
            >
              Source
            </a>
          )}
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Case study
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function MobileHorizontalScroll() {
  const { prefersReducedMotion } = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return

    const container = containerRef.current
    if (!container) return

    const updateActiveIndex = () => {
      const firstPanel = container.querySelector<HTMLElement>('[role="group"]')
      const panelWidth = (firstPanel?.offsetWidth ?? container.clientWidth) + PANEL_GAP
      setActiveIndex(Math.min(projects.length - 1, Math.round(container.scrollLeft / panelWidth)))
    }

    container.addEventListener("scroll", updateActiveIndex, { passive: true })

    return () => {
      container.removeEventListener("scroll", updateActiveIndex)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col gap-4">
        {projects.map((project, i) => (
          <ProjectPanel key={project.slug} project={project} index={i} stacked />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-1 flex items-center gap-2 px-5 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
        <span>Swipe left to explore</span>
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects horizontal scroll"
        className="relative w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Panel {activeIndex + 1} of {projects.length}
        </div>
        <div className="flex flex-row flex-nowrap gap-4">
          {projects.map((project, i) => (
            <ProjectPanel key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
