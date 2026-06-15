"use client"

import { SectionShell, SectionHeading, SectionWatermark } from "@/components/shared/section-shell"
import { ProjectCard } from "@/components/shared/project-card"
import { projects } from "@/data/projects"

export function SelectedWorkSection() {
  return (
    <SectionShell id="work">
      <SectionWatermark>WORK</SectionWatermark>
      <SectionHeading label="Selected Work" title="Projects I've Built" />

      <div className="space-y-6 md:space-y-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </SectionShell>
  )
}
