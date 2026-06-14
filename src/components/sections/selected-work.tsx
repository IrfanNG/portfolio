"use client"

import { SectionShell, SectionHeading } from "@/components/shared/section-shell"
import { ProjectCard } from "@/components/shared/project-card"
import { projects } from "@/data/projects"

export function SelectedWorkSection() {
  return (
    <SectionShell id="work">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(80px,14vw,200px)] font-black text-white/[0.03]">
        WORK
      </div>

      <SectionHeading label="Selected Work" title="Projects I've Built" />

      <div className="space-y-6 md:space-y-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </SectionShell>
  )
}
