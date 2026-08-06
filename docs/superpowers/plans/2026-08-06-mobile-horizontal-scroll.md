# Mobile Horizontal Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile auto-advancing carousel in the Selected Work section with the Framer "Horiscroll" effect — a pinned section that translates project panels horizontally (with snap) as the user scrolls vertically, mobile viewports only.

**Architecture:** A new `MobileHorizontalScroll` component uses GSAP ScrollTrigger (`pin: true`, `scrub: 0.6`, snap-to-panel) to tween a flex row of full-viewport image-forward panels along `x`. Desktop keeps the existing sticky showcase untouched. Reduced-motion users get a plain vertical stack. Lenis is synced to ScrollTrigger for accurate scrub.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, `gsap@3.15.0` (already a dependency, currently unused), `lenis@1.3.23`, `next/image`.

## Global Constraints

- No new dependencies — `gsap` and `lenis` are already in `package.json`.
- Desktop (≥ `md`/768px) behavior must remain exactly as-is; only the mobile branch changes.
- The auto-advancing carousel (`MobileCarousel`) is removed entirely — no fallback kept.
- Snap to panel is always enabled; no progress indicator (no dots, no counter, no progress bar).
- Respect `prefersReducedMotion` from `src/components/providers/reduced-motion-provider.tsx`: reduced motion ⇒ vertical stacked panels, no pinning, no JS animation.
- All components follow existing conventions: `"use client"`, `cn()` from `@/lib/utils`, data from `@/data/projects` (type `Project` from `@/types`).
- No comments in code unless asked (repo convention).
- There is no test framework in this repo. Verification is `npm run lint`, `npm run build` (Next build type-checks), plus manual dev-server checks.
- Commit style: `feat(frontend): ...` / `fix(frontend): ...` (see `git log`).

---
## Task 1: Sync Lenis with ScrollTrigger

**Files:**
- Modify: `src/components/providers/smooth-scroll-provider.tsx` (entire file)

**Interfaces:**
- Consumes: nothing (existing `useReducedMotion` hook).
- Produces: Lenis instance driven by the `gsap.ticker`, `lenis.on("scroll", ...)` triggering `ScrollTrigger.update()`. Task 2 relies on this for accurate scrub.

- [ ] **Step 1: Replace file contents**

Current file content:

```tsx
"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"
import { useReducedMotion } from "./reduced-motion-provider"

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { prefersReducedMotion } = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}
```

New file content (replaces the manual `requestAnimationFrame` loop with the gsap ticker and adds the scroll→ScrollTrigger bridge):

```tsx
"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "./reduced-motion-provider"

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { prefersReducedMotion } = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    })

    lenisRef.current = lenis

    const onScroll = () => ScrollTrigger.update()
    lenis.on("scroll", onScroll)

    const ticker = gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off("scroll", onScroll)
      gsap.ticker.remove(ticker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [prefersReducedMotion])

  return <>{children}</>
}
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint`
Expected: no errors (exit 0).

Run: `npm run build`
Expected: build succeeds (this also type-checks the file).

- [ ] **Step 3: Commit**

```bash
git add src/components/providers/smooth-scroll-provider.tsx
git commit -m "feat(frontend): sync lenis scroll with gsap scrolltrigger"
```

---

## Task 2: Create `MobileHorizontalScroll` component

**Files:**
- Create: `src/components/sections/mobile-horizontal-scroll.tsx`

**Interfaces:**
- Consumes: `projects` from `@/data/projects`, `useReducedMotion` from `@/components/providers/reduced-motion-provider`, `cn` from `@/lib/utils`, `Project` type from `@/types`, `gsap` + `gsap/ScrollTrigger`. Requires Task 1's Lenis↔ScrollTrigger sync for smooth scrub.
- Produces: named export `MobileHorizontalScroll` (default export not required), used by Task 3.

- [ ] **Step 1: Write the component**

```tsx
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
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={`Panel ${index + 1} of ${projects.length}`}
      className={cn(
        "relative flex-none overflow-hidden",
        stacked ? "h-dvh w-full" : "h-dvh w-screen",
      )}
    >
      <Image
        src={project.image}
        alt={`${project.title} project showcase`}
        fill
        sizes="100vw"
        priority={index === 0}
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
        <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-300">
          <span className="text-blue-400/90">{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-4 bg-zinc-500/70" />
          <span>{project.category}</span>
        </div>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{project.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[10px] uppercase tracking-wider text-zinc-300/80"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider">
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
              className="text-zinc-300 transition-colors hover:text-white"
            >
              Open Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 transition-colors hover:text-white"
            >
              Source
            </a>
          )}
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1 text-zinc-300 transition-colors hover:text-white"
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
          snap:
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
              : false,
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
      <div ref={rowRef} className="flex h-dvh flex-row flex-nowrap gap-4">
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
```

Notes:
- `ref` as a direct prop on `ProjectPanel` relies on React 19's ref-as-prop support (Next 16 + React 19.2 — supported).
- The `container.clientWidth >= 768` guard prevents the trigger from ever being created on desktop (the wrapper in Task 3 is `display: none` there anyway, which yields `clientWidth === 0`).
- `PANEL_GAP = 16` must match the row's `gap-4` (16px) so snap math is correct.

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint`
Expected: no errors (exit 0).

Run: `npm run build`
Expected: build succeeds (type-checks the new component).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/mobile-horizontal-scroll.tsx
git commit -m "feat(frontend): add mobile horizontal scroll project panels"
```

---

## Task 3: Wire into Selected Work showcase and remove carousel

**Files:**
- Modify: `src/components/sections/selected-work-showcase.tsx`

**Interfaces:**
- Consumes: `MobileHorizontalScroll` from `./mobile-horizontal-scroll` (Task 2).
- Produces: `SelectedWorkShowcase` renders `DesktopShowcase` (unchanged) plus the new mobile component inside a `md:hidden` wrapper.

- [ ] **Step 1: Update imports**

Replace lines 1-11 imports. Remove `useReducedMotion` (no longer used). Keep `useState, useCallback, useRef, useEffect` (still used by `ShowcasePanel` and `DesktopShowcase`). Add the new component import:

```tsx
import { MobileHorizontalScroll } from "./mobile-horizontal-scroll"
```

Remove this line (was only used by the carousel):

```tsx
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
```

- [ ] **Step 2: Delete `MobileCarousel`**

Delete the entire `MobileCarousel` function (currently lines 201-328, from `function MobileCarousel({ prefersReducedMotion }` through its closing `}` before `export function SelectedWorkShowcase`).

- [ ] **Step 3: Update `SelectedWorkShowcase`**

Replace this:

```tsx
export function SelectedWorkShowcase() {
  const { prefersReducedMotion } = useReducedMotion()

  return (
    <>
      <DesktopShowcase />
      <MobileCarousel prefersReducedMotion={prefersReducedMotion} />
    </>
  )
}
```

with:

```tsx
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
```

- [ ] **Step 4: Verify lint and build**

Run: `npm run lint`
Expected: no errors (exit 0). If eslint flags unused imports (e.g. `motion`, `AnimatePresence` are still used by `DesktopShowcase`; `cn`, `useInView` still used by `ShowcasePanel` — but verify), remove only the genuinely unused ones.

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual verification (dev server)**

Run: `npm run dev`

Verify:
1. Mobile viewport (375px wide, DevTools device mode):
   - Scroll to the Selected Work section → the section pins and the 4 project panels translate horizontally as you continue scrolling vertically.
   - Release scroll → it snaps so a panel is centered/full-viewport.
   - Panels show full-bleed screenshot with title/category/status/links overlay; "Case study" links to `/work/[slug]`.
   - No dots, no auto-advance timer.
   - Scroll back up → returns to previous panels.
2. OS "prefers-reduced-motion: reduce" enabled → panels render as a plain vertical stack, no pinning.
3. Desktop viewport (≥ 768px) → the original sticky-preview showcase is unchanged.
4. iOS-style behavior: address bar show/hide does not cause the pinned section to jump.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/selected-work-showcase.tsx
git commit -m "feat(frontend): replace mobile project carousel with horizontal scroll"
```

---

## Final Verification

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Manual mobile check passes (Step 5 above)
