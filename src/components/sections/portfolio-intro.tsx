"use client"

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { useSmoothScroll } from "@/components/providers/smooth-scroll-provider"
import { profile } from "@/data/profile"
import { projects } from "@/data/projects"
import {
  getProjectArrivalState,
  getProjectDepthState,
  toIntroVisuals,
  type ProjectDepthProfile,
} from "@/lib/intro-projects"

gsap.registerPlugin(ScrollTrigger)

const visuals = toIntroVisuals(projects)

function waitForImage(image: HTMLImageElement) {
  const decode = () => image.decode().catch(() => undefined)

  if (image.complete) return decode()

  return new Promise<void>((resolve) => {
    const settle = () => {
      image.removeEventListener("load", settle)
      image.removeEventListener("error", settle)
      void decode().then(resolve)
    }

    image.addEventListener("load", settle, { once: true })
    image.addEventListener("error", settle, { once: true })
  })
}

function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion } = useReducedMotion()
  const { pause, resume } = useSmoothScroll()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    let cancelled = false
    let completed = false
    let timeline: gsap.core.Timeline | undefined
    let readyTimeout: number | undefined
    let depthProfile: ProjectDepthProfile = {}
    let lateralTravelRatio = 0.15
    let cardTravelRatio = 0.5
    const responsiveMotion = gsap.matchMedia(root)
    responsiveMotion.add("(max-width: 640px)", () => {
      depthProfile = { frontY: 16, verticalStep: 34, depthStep: 24, scaleStep: 0.06 }
      lateralTravelRatio = 0.07
      cardTravelRatio = 0.18
      return () => {
        depthProfile = {}
        lateralTravelRatio = 0.15
        cardTravelRatio = 0.5
      }
    })
    const context = gsap.context(() => {}, root)
    const originalScrollY = window.scrollY

    document.documentElement.dataset.introActive = "true"
    document.getElementById("portfolio-content")?.setAttribute("inert", "")
    window.scrollTo(0, 0)
    pause()

    const finish = () => {
      if (completed) return
      completed = true
      delete document.documentElement.dataset.introActive
      document.getElementById("portfolio-content")?.removeAttribute("inert")
      resume()
      onComplete()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    const imageReady = Array.from(root.querySelectorAll<HTMLImageElement>("img[data-intro-image]"))
    const cards = gsap.utils.toArray<HTMLElement>("[data-intro-card]", root)
    const reduced = prefersReducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const counter = { value: 0 }
    const counterElement = root.querySelector<HTMLElement>("[data-intro-counter]")
    const header = root.querySelector<HTMLElement>("[data-intro-header]")
    const backdrop = root.querySelector<HTMLElement>("[data-intro-backdrop]")
    const hero = document.querySelector<HTMLElement>("[data-intro-hero]")
    const ambient = document.querySelector<HTMLElement>("[data-hero-ambient]")
    const eyebrow = document.querySelector<HTMLElement>("[data-hero-eyebrow]")
    const headingWords = gsap.utils.toArray<HTMLElement>("[data-hero-word]", hero)
    const supporting = gsap.utils.toArray<HTMLElement>("[data-hero-supporting]", hero)
    const navItems = gsap.utils.toArray<HTMLElement>("[data-intro-nav]")
    const counterUpdate = () => {
      if (counterElement) counterElement.textContent = `${Math.min(100, Math.round(counter.value))}%`
    }

    context.add(() => {
      gsap.set(cards, { autoAlpha: 0, x: 0, y: 74, scale: 0.94, transformOrigin: "50% 50%" })
      gsap.set([ambient, eyebrow, ...headingWords, ...supporting, ...navItems].filter(Boolean), {
        autoAlpha: 0,
      })
      gsap.set([eyebrow, ...supporting, ...navItems].filter(Boolean), { y: 12 })
      gsap.set(headingWords, { yPercent: 110 })

      timeline = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } })

      if (reduced) return

      timeline.to(counter, {
        value: 10,
        duration: 0.24,
        ease: "power1.out",
        snap: { value: 1 },
        onUpdate: counterUpdate,
      })
      timeline.addLabel("assets-ready")
      timeline.addPause("assets-ready")
      timeline.play(0)
    })

    const imagesPromise = Promise.allSettled([
      ...imageReady.map((image) => waitForImage(image)),
      document.fonts?.ready ?? Promise.resolve(),
    ])
    const readinessLimit = reduced ? 1200 : 2600
    const timeoutPromise = new Promise<void>((resolve) => {
      readyTimeout = window.setTimeout(resolve, readinessLimit)
    })

    void Promise.race([imagesPromise, timeoutPromise]).then(() => {
      if (readyTimeout) window.clearTimeout(readyTimeout)
      if (cancelled || !timeline) return
      const master = timeline

      const readyCards = cards.filter((card) => {
        const image = card.querySelector<HTMLImageElement>("img[data-intro-image]")
        return card.getClientRects().length > 0 && Boolean(image?.complete && image.naturalWidth > 0)
      })
      const waitingCards = cards.filter((card) => !readyCards.includes(card))
      if (waitingCards.length) gsap.set(waitingCards, { display: "none" })

      if (reduced) {
        gsap.set(counter, { value: 100 })
        counterUpdate()
        if (readyCards.length) gsap.set(readyCards, { autoAlpha: 1, x: 0, y: 0, scale: 1 })
        master.to(backdrop, { autoAlpha: 0, duration: 0.18, ease: "power1.out" })
        if (ambient) master.to(ambient, { autoAlpha: 1, duration: 0.12 }, "<")
        if (eyebrow) master.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.12 }, "<0.02")
        if (headingWords.length) master.to(headingWords, { autoAlpha: 1, yPercent: 0, duration: 0.16, stagger: 0.015 }, "<")
        if (supporting.length) master.to(supporting, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.01 }, "<0.02")
        if (navItems.length) master.to(navItems, { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.015 }, "<")
        master.eventCallback("onComplete", finish)
        master.play(0)
        return
      }

      const arrivalDuration = 0.6
      const projectStagger = 0.1
      const arrivalSequenceDuration = readyCards.length
        ? arrivalDuration + (readyCards.length - 1) * projectStagger
        : 0
      const finalSettle = readyCards.length ? 0.45 : 0
      const stage = root.querySelector<HTMLElement>(".portfolio-intro__stage")
      const stageRect = stage?.getBoundingClientRect()
      const stageHeight = stageRect?.height ?? 400
      const horizontalTravel = Math.min(
        window.innerWidth * lateralTravelRatio,
        (stageRect?.width ?? window.innerWidth * 0.5) * cardTravelRatio,
      )
      master.addLabel("visual-sequence", "assets-ready")
      master.to(counter, {
        value: 90,
        duration: arrivalSequenceDuration,
        ease: "none",
        snap: { value: 1 },
        onUpdate: counterUpdate,
      }, "visual-sequence")
      master.to(counter, {
        value: 100,
        duration: finalSettle || 0.12,
        ease: "none",
        snap: { value: 1 },
        onUpdate: counterUpdate,
      }, `visual-sequence+=${arrivalSequenceDuration}`)

      readyCards.forEach((card, index) => {
        const startAt = index * projectStagger
        const at = `visual-sequence+=${startAt}`
        const spread = getProjectDepthState(readyCards.length - 1 - index, depthProfile)
        master.fromTo(card, {
          ...getProjectArrivalState(index, window.innerHeight, stageHeight, horizontalTravel),
          autoAlpha: 1,
        }, {
          ...spread,
          duration: arrivalDuration,
          ease: "power2.out",
          immediateRender: false,
        }, at)
      })

      readyCards.forEach((card, index) => {
        master.to(card, {
          ...getProjectDepthState(readyCards.length - 1 - index, {
            frontY: 0,
            verticalStep: 8,
            depthStep: 6,
            scaleStep: 0.015,
          }),
          duration: finalSettle,
          ease: "power2.inOut",
        }, `visual-sequence+=${arrivalSequenceDuration}`)
      })

      if (readyCards.length) master.to({}, { duration: 0.25 })
      const exitAt = master.duration()
      if (header) master.to(header, { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.in" }, exitAt)
      if (readyCards.length) {
        master.to(readyCards, {
          autoAlpha: 0,
          y: "-=18",
          duration: 0.35,
          ease: "power2.in",
        }, exitAt)
      }
      master.to(backdrop, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, exitAt)
      if (ambient) master.to(ambient, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, exitAt)
      if (eyebrow) master.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, exitAt + 0.15)
      if (headingWords.length) master.to(headingWords, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power4.out",
      }, exitAt + 0.2)
      if (supporting.length) master.to(supporting, {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: "power3.out",
      }, exitAt + 0.3)
      if (navItems.length) master.to(navItems, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: "power3.out",
      }, exitAt + 0.4)
      master.to({}, { duration: 0.8 }, exitAt)

      master.removePause("assets-ready")
      master.eventCallback("onComplete", finish)
      master.play()
    })

    return () => {
      cancelled = true
      if (readyTimeout) window.clearTimeout(readyTimeout)
      responsiveMotion.revert()
      timeline?.kill()
      context.revert()
      if (!completed) {
        delete document.documentElement.dataset.introActive
        document.getElementById("portfolio-content")?.removeAttribute("inert")
        window.scrollTo(0, originalScrollY)
        resume()
      }
    }
  }, [onComplete, pause, prefersReducedMotion, resume])

  return (
    <div
      id="portfolio-intro"
      ref={rootRef}
      className="portfolio-intro"
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
      data-intro-layer
    >
      <div className="portfolio-intro__backdrop" data-intro-backdrop />
      <header className="portfolio-intro__header" data-intro-header>
        <span>{profile.name}</span>
        <span className="portfolio-intro__counter" data-intro-counter aria-hidden="true">0%</span>
      </header>
      <div className="portfolio-intro__stage" aria-hidden="true">
        {visuals.map((visual, index) => (
          <div
            className="portfolio-intro__card"
            data-intro-card
            data-project-slug={visual.slug}
            style={{ zIndex: index + 1 }}
            key={visual.slug}
          >
            <Image
              src={visual.image}
              alt=""
              fill
              unoptimized
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 68vw, 60vw"
              data-intro-image
              className="portfolio-intro__image"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PortfolioIntro({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(true)
  const complete = useCallback(() => setActive(false), [])

  return (
    <>
      <div id="smooth-wrapper">
        <div id="portfolio-content" aria-busy={active}>
          {children}
        </div>
      </div>
      {active && <IntroLoader onComplete={complete} />}
    </>
  )
}
