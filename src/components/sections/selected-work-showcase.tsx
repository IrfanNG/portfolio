"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { useSmoothScroll } from "@/components/providers/smooth-scroll-provider"
import { projects } from "@/data/projects"
import { getProjectFocusProgress, getShowcaseEntryClip, getShowcaseFrame } from "@/lib/project-showcase"
import type { Project } from "@/types"

gsap.registerPlugin(ScrollTrigger)

function ProjectImage({ project, index }: { project: Project; index: number }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="project-showcase__wipe">
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-950 text-zinc-100">
          <span>{project.title}</span>
          <span className="text-sm text-zinc-400">Preview unavailable. Open case study.</span>
        </div>
      ) : (
        <Image src={project.image} alt={`${project.title}: view case study`} fill
          loading="eager" fetchPriority={index === 0 ? "high" : "auto"}
          className="project-showcase__image" onError={() => setFailed(true)} />
      )}
    </span>
  )
}

export function SelectedWorkShowcase() {
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const { prefersReducedMotion } = useReducedMotion()
  const { ready, scrollTo } = useSmoothScroll()

  useEffect(() => {
    const root = rootRef.current
    if (!root || !ready || prefersReducedMotion || projects.length < 2) return
    const layers = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-project-layer]"))
    const section = root.closest<HTMLElement>("#work")
    root.dataset.enhanced = "true"
    const media = gsap.matchMedia()
    media.add({ desktop: "(min-width: 768px) and (pointer: fine)", mobile: "(max-width: 767px), (pointer: coarse)" }, (context) => {
      const desktop = Boolean(context.conditions?.desktop)
      const render = (progress: number) => {
        const frame = getShowcaseFrame(progress, layers.length)
        layers.forEach((layer, index) => {
          const reveal = String(frame.reveals[index])
          if (layer.style.getPropertyValue("--reveal") !== reveal) {
            layer.style.setProperty("--reveal", reveal)
          }
        })
      }
      render(0)
      const trigger = ScrollTrigger.create({
        id: "project-showcase", trigger: root, pin: true,
        start: desktop ? "top top" : "center center",
        end: () => `+=${layers.length * window.innerHeight * (desktop ? 1 : 0.65)}`,
        invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => render(self.progress), onRefresh: (self) => render(self.progress),
      })
      triggerRef.current = trigger
      let entryHeight = 0
      const renderEntry = (progress: number) => {
        if (!section) return
        if (progress < 1 && !entryHeight && !trigger.isActive) {
          // Measure the unpinned stage, not the scroll distance added by its spacer.
          const stageContainer = root.parentElement?.classList.contains("pin-spacer") ? root.parentElement : root
          entryHeight = stageContainer.getBoundingClientRect().top - section.getBoundingClientRect().top + root.offsetHeight
        }
        section.style.clipPath = getShowcaseEntryClip(progress, entryHeight)
      }
      const entry = section ? ScrollTrigger.create({
        id: "project-showcase-entry", trigger: section,
        start: "top bottom", end: () => trigger.start,
        invalidateOnRefresh: true,
        onUpdate: (self) => renderEntry(self.progress),
        onRefresh: (self) => { entryHeight = 0; renderEntry(self.progress) },
      }) : null
      if (entry) renderEntry(entry.progress)
      return () => {
        entry?.kill()
        if (section) section.style.clipPath = ""
        trigger.kill()
        triggerRef.current = null
      }
    })
    const refresh = () => ScrollTrigger.refresh()
    const images = Array.from(root.querySelectorAll("img"))
    images.forEach((image) => image.addEventListener("load", refresh))
    void document.fonts.ready.then(() => { if (root.isConnected) ScrollTrigger.refresh() })
    return () => {
      images.forEach((image) => image.removeEventListener("load", refresh))
      media.revert()
      delete root.dataset.enhanced
      layers.forEach((layer) => layer.style.removeProperty("--reveal"))
    }
  }, [ready, prefersReducedMotion])

  const revealFocusedProject = (index: number) => {
    const trigger = triggerRef.current
    if (!trigger) return
    scrollTo(trigger.start + getProjectFocusProgress(index, projects.length) * (trigger.end - trigger.start), false)
    ScrollTrigger.update()
  }

  return (
    <div ref={rootRef} className="project-showcase" role="region" aria-label="Project showcases">
      {projects.map((project, index) => (
        <Link key={project.slug} href={`/work/${project.slug}`} data-project-layer
          data-project-slug={project.slug} className="project-showcase__layer"
          style={{ zIndex: index + 1 }} onFocus={() => revealFocusedProject(index)}>
          <ProjectImage project={project} index={index} />
        </Link>
      ))}
    </div>
  )
}
