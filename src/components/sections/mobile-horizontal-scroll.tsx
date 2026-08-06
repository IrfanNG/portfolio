"use client"

import { useCallback, useEffect, useRef, useState, type Ref } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { projects } from "@/data/projects"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { cn } from "@/lib/utils"
import type { Project } from "@/types"

gsap.registerPlugin(ScrollTrigger)

const PANEL_GAP = 16

function ProjectPanel({
  project,
  index,
  stacked = false,
  ref,
}: {
  project: Project
  index: number
  stacked?: boolean
  ref?: Ref<HTMLDivElement>
}) {
  const isMobile = project.previewType === "mobile"

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={`Panel ${index + 1} of ${projects.length}`}
      className={cn(
        "relative flex-none overflow-hidden",
        stacked ? "w-full py-6" : "h-dvh w-screen",
      )}
    >
      <div
        className={cn(
          "relative grid gap-3 px-5",
          stacked ? "py-6" : "min-h-dvh content-center",
        )}
      >
        <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-400">
          <span className="text-blue-400/90">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-4 bg-zinc-700" />
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
  const rowRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)

  const getSnapPoints = useCallback(() => {
    const row = rowRef.current
    const container = containerRef.current
    if (!row || !container) return []
    const totalScroll = row.scrollWidth - container.clientWidth
    if (totalScroll <= 0) return []
    return panelRefs.current.map((panel, i) => {
      if (!panel) return 0
      let offset = 0
      for (let j = 0; j < i; j++) {
        const prev = panelRefs.current[j]
        if (prev) offset += prev.offsetWidth + PANEL_GAP
      }
      return offset / totalScroll
    })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const container = containerRef.current
    const row = rowRef.current
    if (!container || !row) return

    ScrollTrigger.config({ ignoreMobileResize: true })

    if (container.clientWidth >= 768) return

    const ctx = gsap.context(() => {
      const totalScroll = row.scrollWidth - container.clientWidth
      if (totalScroll <= 0) return

      const updateActiveIndex = () => {
        const scrollX = Math.abs(gsap.getProperty(row, "x") as number)
        let accumulated = 0
        for (let i = 0; i < panelRefs.current.length; i++) {
          const panel = panelRefs.current[i]
          if (!panel) continue
          accumulated += panel.offsetWidth + PANEL_GAP
          if (scrollX < accumulated - panel.offsetWidth / 2) {
            if (activeIndexRef.current !== i) {
              activeIndexRef.current = i
              setActiveIndex(i)
            }
            break
          }
        }
      }

      const snapPoints = getSnapPoints()

      const snapVars =
        snapPoints.length > 1
          ? {
              snapTo: (value: number) => {
                let nearest = snapPoints[0]
                let minDiff = Math.abs(value - nearest)
                for (const point of snapPoints) {
                  const diff = Math.abs(value - point)
                  if (diff < minDiff) {
                    minDiff = diff
                    nearest = point
                  }
                }
                return nearest
              },
              duration: { min: 0.15, max: 0.35 },
              delay: 0,
              ease: "power2.out",
            }
          : undefined

      gsap.to(row, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=" + totalScroll,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: updateActiveIndex,
          ...(snapVars ? { snap: snapVars } : {}),
        },
      })
    }, container)

    return () => {
      ctx.revert()
    }
  }, [prefersReducedMotion, getSnapPoints])

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
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects horizontal scroll"
      className="relative w-full overflow-hidden"
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Panel {activeIndex + 1} of {projects.length}
      </div>
      <div ref={rowRef} className="flex flex-row flex-nowrap gap-4">
        {projects.map((project, i) => (
          <ProjectPanel
            key={project.slug}
            project={project}
            index={i}
            ref={(el) => {
              panelRefs.current[i] = el
            }}
          />
        ))}
      </div>
    </div>
  )
}
