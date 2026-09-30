"use client"

import { SectionHeading } from "@/components/shared/section-shell"
import { SelectedWorkShowcase } from "./selected-work-showcase"

export function SelectedWorkSection() {
  return (
    <section id="work" className="relative w-full pt-8 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 xl:px-24">
        <SectionHeading
          label="Selected Work"
          title="Projects I've Built"
          className="mb-8 md:mb-16"
          animated={false}
        />
      </div>
      <SelectedWorkShowcase />
    </section>
  )
}
