"use client"

import { SectionShell, SectionHeading, SectionWatermark } from "@/components/shared/section-shell"
import { SelectedWorkShowcase } from "./selected-work-showcase"

export function SelectedWorkSection() {
  return (
    <SectionShell id="work" className="py-8 md:py-28">
      <SectionWatermark>WORK</SectionWatermark>
      <SectionHeading
        label="Selected Work"
        title="Projects I've Built"
        className="mb-3 md:mb-16"
      />
      <SelectedWorkShowcase />
    </SectionShell>
  )
}
