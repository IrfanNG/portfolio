# Mobile Horizontal Scroll for Selected Work Section

Date: 2026-08-06

## Goal

Recreate the Framer "Horiscroll" (Horizontal Scrolling Sections) effect for the Selected Work project section on **mobile views only**: the section pins while the user scrolls vertically, and a row of project panels translates horizontally, snapping to each panel. Desktop behavior stays exactly as-is.

## Context

- Template source: `https://framer.com/m/Horiscroll-FREmZl.js@kdW0E6c4vSHouxoooSlD` — a GSAP + ScrollTrigger component that pins a container and tweens a flex row `x: -totalScroll` with `scrub` (optional `snap`).
- The project already has `gsap@3.15.0` installed (unused so far) and a Lenis smooth-scroll provider (`src/components/providers/smooth-scroll-provider.tsx`).
- Current mobile experience (`MobileCarousel` in `src/components/sections/selected-work-showcase.tsx`): auto-advancing 5s timer, drag/swipe, dot indicators. **This is fully replaced** — no fallback kept.
- Desktop (`DesktopShowcase` in same file): sticky-preview + scroll-activated text panels. **Unchanged.**

## User Decisions

- Horizontal scroll applies **below `md` (768px) only**; desktop keeps the sticky showcase.
- The auto-advancing mobile carousel is **fully replaced**.
- Scrub **snaps to each panel**.
- Panels are **image-forward**: full-bleed screenshot with title overlay, minimal text, footer bar for status/links/tech.
- **No progress indicator** (no dots, no counter, no progress bar).

## Architecture

### New component: `src/components/sections/mobile-horizontal-scroll.tsx`

- `"use client"`.
- Mounted from `SelectedWorkShowcase` inside a `md:hidden` wrapper, replacing `<MobileCarousel />`.
- Renders a pin container with a flex row of `N` panels (one per project from `src/data/projects.ts`).
- Each panel: `flex: none`, width `100vw`, height `100dvh`, `overflow: hidden`.
- Horizontal scroll distance: `row.scrollWidth - container.clientWidth`; the pinned section height becomes viewport + that distance.

### Scroll mechanics (GSAP ScrollTrigger)

- Import `gsap` and `gsap/ScrollTrigger` locally; register `ScrollTrigger`.
- On mount (client, non-reduced-motion, width < 768):
  - `ScrollTrigger.config({ ignoreMobileResize: true })` to prevent iOS address-bar jumps.
  - Inside `gsap.context()`: tween `x: -totalScroll` on the row with `scrollTrigger: { trigger, start: "top top", end: "+=" + totalScroll, scrub: true, pin: true, snap: { snapTo: nearest panel offset / totalScroll, duration, ease: "power2.out" }, anticipatePin: 1, invalidateOnRefresh: true }`.
  - Panel snap points computed from `panel.offsetWidth + gap` (same algorithm as the template).
- Cleanup: `ctx.revert()` on unmount.
- `gsap.ticker` drives the Lenis RAF (see below).

### Lenis integration (`src/components/providers/smooth-scroll-provider.tsx`)

- Add `lenis.on("scroll", ScrollTrigger.update)` and `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `gsap.ticker.lagSmoothing(0)` so scrub tracks smooth scroll accurately.
- Guard: only hook up when `ScrollTrigger` is actually registered/used; destroy listeners on unmount.

### Reduced motion fallback

- If `prefersReducedMotion` (existing provider): render panels as a plain vertical stack (no pinning, no JS animation), matching the template's fallback.

### Panel content (image-forward)

- Full-bleed `next/image` screenshot with `object-cover`, `fill`.
- Bottom gradient scrim (`bg-gradient-to-t from-black/80`).
- Bottom overlay: title (`text-2xl`+ bold), category, status badge.
- Footer bar: status dot/badge, "Open Live" / "Source" links (when present), tech stack chips, "View case study" link (`/work/[slug]`).

### Accessibility

- `role="region"`, `aria-label`; visually hidden `aria-live="polite"` "Panel X of N" text updated during scroll (tracked via tween `onUpdate`/snap index, same as template).
- `alt` text on all images.

## Files Touched

| File | Change |
|---|---|
| `src/components/sections/mobile-horizontal-scroll.tsx` | New component |
| `src/components/sections/selected-work-showcase.tsx` | Remove `MobileCarousel`, mount new component in `md:hidden` wrapper |
| `src/components/providers/smooth-scroll-provider.tsx` | Lenis ↔ ScrollTrigger sync |
| `src/data/projects.ts` | Read-only (data source) |

## Testing

- `npm run lint` passes.
- `npm run build` passes.
- Manual (dev server): mobile viewport (375px) — section pins, panels scroll horizontally with snap; auto-scroll timer is gone; reduced-motion (OS setting) shows stacked panels; desktop (≥768px) unchanged.

## Out of Scope

- No progress indicator of any kind.
- No desktop changes.
- No changes to `/work/[slug]` case study pages.
