"use client"

import { SectionShell, SectionHeading, SectionWatermark } from "@/components/shared/section-shell"
import { SelectedWorkShowcase } from "./selected-work-showcase"

export function SelectedWorkSection() {
  return (
    <SectionShell id="work">
      <SectionWatermark>WORK</SectionWatermark>
      <SectionHeading label="Selected Work" title="Projects I've Built" />
      <SelectedWorkShowcase />
    </SectionShell>
  )
}
