# Mobile Selected Work Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mobile Selected Work section clean and balanced by removing the blurred grey panel background, reducing heading-to-project spacing, and vertically centering each project while its horizontal-scroll panel is pinned.

**Architecture:** Keep the existing GSAP horizontal-scroll interaction and desktop showcase unchanged. Motion-enabled mobile panels retain viewport height so the active project has a stable, centered composition while pinned; a grid content wrapper centers the complete project block vertically. The screenshot remains the visual focus without a blurred full-panel background. The reduced-motion fallback remains content-height, and the parent section uses tighter mobile-only spacing while retaining desktop spacing.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, GSAP ScrollTrigger, `next/image`.

## Global Constraints

- Do not add dependencies or alter project data.
- Desktop (`md` / 768px and above) layout and behavior remain unchanged.
- Preserve horizontal scrolling, snapping, accessibility roles, and reduced-motion vertical fallback.
- Motion-enabled mobile panels use `h-dvh`; reduced-motion stacked panels must remain content-height.
- Use only existing Tailwind utilities and existing project-component conventions.
- This repository has no automated UI test runner; use lint, production build, and repeatable mobile browser checks.
- Commit style: `fix(frontend): ...`.

---

## File Structure

- Modify: `src/components/sections/mobile-horizontal-scroll.tsx` — mobile panel sizing and presentation only.
- Modify: `src/components/sections/selected-work.tsx` — Selected Work vertical spacing only.
- Do not modify: `src/components/sections/selected-work-showcase.tsx` — it remains the desktop/mobile switch boundary.

---

### Task 1: Remove the mobile panel backdrop and center the pinned content

**Files:**
- Modify: `src/components/sections/mobile-horizontal-scroll.tsx:16-136, 259`

**Interfaces:**
- Consumes: `projects`, `ProjectPanel` props, existing GSAP measurement based on each panel’s `offsetWidth`.
- Produces: full-viewport motion panels with centered project content and content-height reduced-motion panels, retaining their full-width horizontal-scroll contract.

- [ ] **Step 1: Capture the current failing mobile reproduction**

Run:

```bash
npm run dev
```

At a viewport width of 375px, navigate to `/#work` and record these current failures:
- the blurred project image produces a grey/dark backdrop around the content;
- during a pinned panel, the project block starts near the top of the viewport and leaves most of the visible space below it.

Expected: both failures are reproducible before the code change.

- [ ] **Step 2: Make the smallest panel-layout change**

In `ProjectPanel`, remove the decorative absolute `<Image>` with `scale-110 object-cover opacity-30 blur-2xl` and remove its `bg-zinc-950/60` overlay. Keep a viewport-height panel for the animated horizontal-scroll path, but keep the reduced-motion stack content-height.

Use this shape:

```tsx
className={cn(
  "relative flex-none overflow-hidden",
  stacked ? "w-full py-6" : "h-dvh w-screen",
)}
```

Use a grid wrapper with an explicit viewport minimum height for the animated path. This avoids relying on percentage height and centers the entire category/screenshot/meta block during pinning:

```tsx
<div
  className={cn(
    "relative grid gap-3 px-5",
    stacked ? "py-6" : "min-h-dvh content-center",
  )}
>
```

Keep the foreground screenshot, title, description, technologies, status, and links unchanged.

- [ ] **Step 3: Verify the focused regression is gone**

With the same 375px viewport:
- no blurred/grey full-panel backdrop is visible;
- each animated panel’s complete content block is vertically centered in the viewport;
- the first and last reduced-motion panels end after their actions plus `py-6` padding;
- horizontal scroll still reaches every project and snaps to each panel.

Expected: during motion-enabled horizontal scrolling, the space above and below the active project is visually balanced rather than concentrated below it.

- [ ] **Step 4: Commit the isolated panel fix**

```bash
git add src/components/sections/mobile-horizontal-scroll.tsx
git commit -m "fix(frontend): compact mobile project panels"
```

---

### Task 2: Tighten the Selected Work section’s mobile spacing

**Files:**
- Modify: `src/components/sections/selected-work.tsx:8-12`

**Interfaces:**
- Consumes: `SectionShell` and `SectionHeading` className passthrough.
- Produces: a mobile-only compact section header while preserving the existing desktop `md:py-28` and `md:mb-16` values.

- [ ] **Step 1: Verify the spacing baseline**

At 375px, measure visually from:
1. the end of the heading “Projects I’ve Built” to the first project’s category row;
2. the last project’s actions to the About eyebrow.

Expected before adjustment: both gaps are visibly larger than their nearby content rhythm.

- [ ] **Step 2: Apply the mobile-only spacing values**

Keep the existing desktop values, and set:
- `SectionShell`: `py-8 md:py-28`
- `SectionHeading`: `mb-3 md:mb-16`

Resulting JSX:

```tsx
<SectionShell id="work" className="py-8 md:py-28">
  <SectionWatermark>WORK</SectionWatermark>
  <SectionHeading
    label="Selected Work"
    title="Projects I've Built"
    className="mb-3 md:mb-16"
  />
  <SelectedWorkShowcase />
</SectionShell>
```

- [ ] **Step 3: Verify at mobile and desktop breakpoints**

Check:
- 375px: header-to-first-project gap is tight but readable; About follows directly after the final panel.
- 767px: the mobile layout is still compact and has no overflow.
- 768px and 1440px: desktop spacing and two-column showcase are unchanged.

- [ ] **Step 4: Commit the isolated spacing fix**

```bash
git add src/components/sections/selected-work.tsx
git commit -m "fix(frontend): tighten selected work mobile spacing"
```

---

### Task 3: Run project verification

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: Tasks 1–2.
- Produces: verified lint, production build, and visual acceptance results.

- [ ] **Step 1: Run static validation**

```bash
npm run lint
npm run build
```

Expected: both commands exit 0 without TypeScript, ESLint, or Next.js build errors.

- [ ] **Step 2: Check the source-level regression guards**

```bash
rg -n 'blur-2xl|opacity-30|h-dvh' src/components/sections/mobile-horizontal-scroll.tsx
```

Expected: no matches. This confirms the three classes responsible for the grey backdrop and full-viewport blank space are absent from the mobile panel component.

- [ ] **Step 3: Perform final browser acceptance check**

At 375px, scroll from the Selected Work heading through all projects into About. Confirm:
- screenshots appear without a surrounding grey panel;
- header-to-content space is reduced;
- the active project’s content is vertically centered while pinned;
- no grey blurred backdrop appears;
- desktop behavior at 768px remains unchanged.

- [ ] **Step 4: Inspect and commit the final verified state**

```bash
git status --short
git log --oneline -2
```

Expected: only the two intended commits are present, with no untracked build artifacts.
