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
  getProjectArrivalProfile,
  getProjectDepthState,
  toIntroVisuals,
  type ProjectDepthProfile,
} from "@/lib/intro-projects"

gsap.registerPlugin(ScrollTrigger)

const visuals = toIntroVisuals(projects)
const glideEase = (progress: number) =>
  progress + 0.3 * progress * (1 - progress) * (2 * progress - 1)

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
    let pushScale = 3.4
    let depthProfile: ProjectDepthProfile = {}
    let lateralTravelRatio = 0.15
    let cardTravelRatio = 0.5
    const responsiveMotion = gsap.matchMedia(root)
    responsiveMotion.add("(max-width: 640px)", () => {
      pushScale = 5
      depthProfile = { frontY: 16, verticalStep: 34, depthStep: 24, scaleStep: 0.06 }
      lateralTravelRatio = 0.07
      cardTravelRatio = 0.18
      return () => {
        pushScale = 3.4
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

      timeline = gsap.timeline({ paused: true, defaults: { overwrite: "auto" }, onComplete: finish })

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
        master.play(0)
        return
      }

      const arrivalDuration = 0.56
      const projectStagger = 0.3
      const sequenceSpacing = 0.42
      const finalSettle = 0.12
      const arrivalSequenceDuration = readyCards.length
        ? arrivalDuration + (readyCards.length - 1) * sequenceSpacing
        : 0.42
      const stage = root.querySelector<HTMLElement>(".portfolio-intro__stage")
      const stageRect = stage?.getBoundingClientRect()
      const stageHeight = stageRect?.height ?? 400
      const arrivalDistance = Math.max(120, stageHeight * 0.38)
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
        duration: finalSettle,
        ease: "none",
        snap: { value: 1 },
        onUpdate: counterUpdate,
      }, `visual-sequence+=${arrivalSequenceDuration}`)

      readyCards.forEach((card, index) => {
        const startAt = index * projectStagger
        const cardDuration = arrivalSequenceDuration - startAt
        const hasFollowingProject = index < readyCards.length - 1
        const approachDuration = hasFollowingProject
          ? Math.min(projectStagger, cardDuration * 0.58)
          : Math.min(0.5, cardDuration * 0.58)
        const at = `visual-sequence+=${startAt}`
        const front = getProjectDepthState(0, depthProfile)
        const arrival = getProjectArrivalProfile(index)
        const finalDepth = readyCards.length - 1 - index
        const approachState = hasFollowingProject
          ? {
              x: 0,
              y: front.y + arrivalDistance * 0.6,
              z: front.z - 2,
              scale: Math.min(0.985, arrival.scale + 0.015),
            }
          : {
              x: 0,
              y: front.y + 12,
              z: front.z - 2,
              scale: 0.99,
            }
        const finalState = {
          ...getProjectDepthState(finalDepth, depthProfile),
          x: index < readyCards.length - 1
            ? getProjectArrivalProfile(readyCards.length - 1).counterX
            : 0,
        }
        const incoming = {
          autoAlpha: 0,
          x: arrival.direction * horizontalTravel * arrival.xFactor,
          y: front.y + arrivalDistance * arrival.yFactor,
          z: front.z - 42,
          scale: arrival.scale,
        }

        master.fromTo(card, incoming, {
          ...approachState,
          duration: approachDuration,
          ease: glideEase,
          immediateRender: false,
        }, at)
        master.to(card, {
          autoAlpha: 1,
          duration: Math.min(0.09, approachDuration * 0.2),
          ease: "power1.out",
        }, at)
        master.to(card, {
          ...finalState,
          duration: cardDuration - approachDuration,
          ease: glideEase,
        }, `visual-sequence+=${startAt + approachDuration}`)
      })
      master.to(readyCards, { x: 0, duration: finalSettle, ease: "none" }, `visual-sequence+=${arrivalSequenceDuration}`)

      master.to({}, { duration: 0.18 })
      const exitAt = master.duration()
      const frontCard = readyCards[readyCards.length - 1]
      if (header) master.to(header, { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.in" }, exitAt)
      if (frontCard) {
        master.to(frontCard, {
          scale: pushScale,
          x: 0,
          y: 0,
          borderRadius: 0,
          duration: 0.9,
          ease: "power4.in",
        }, exitAt)
        master.to(frontCard, { autoAlpha: 0, duration: 0.38, ease: "power2.in" }, exitAt + 0.48)
      }
      const trailingCards = readyCards.slice(0, -1)
      if (trailingCards.length) {
        master.to(trailingCards, {
          autoAlpha: 0,
          scale: 1.08,
          duration: 0.45,
          stagger: 0.025,
          ease: "power2.in",
        }, exitAt + 0.14)
      }
      master.to(backdrop, { autoAlpha: 0, duration: 0.72, ease: "power2.inOut" }, exitAt + 0.15)
      if (ambient) master.to(ambient, { autoAlpha: 1, duration: 0.55, ease: "power2.out" }, exitAt + 0.3)
      if (eyebrow) master.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }, exitAt + 0.42)
      if (headingWords.length) master.to(headingWords, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.58,
        stagger: 0.07,
        ease: "power4.out",
      }, exitAt + 0.48)
      if (supporting.length) master.to(supporting, {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.05,
        ease: "power3.out",
      }, exitAt + 0.65)
      if (navItems.length) master.to(navItems, {
        autoAlpha: 1,
        y: 0,
        duration: 0.38,
        stagger: 0.04,
        ease: "power3.out",
      }, exitAt + 0.68)

      master.removePause("assets-ready")
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
      <div id="portfolio-content" aria-busy={active}>
        {children}
      </div>
      {active && <IntroLoader onComplete={complete} />}
    </>
  )
}
