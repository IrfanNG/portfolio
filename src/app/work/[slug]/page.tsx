import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink, ArrowLeft, ArrowUpRight } from "lucide-react"
import { MagneticButton } from "@/components/shared/magnetic-button"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects"

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "60183823063"
const waMessage = encodeURIComponent(
  "Hi Irfan, I have a project in mind and would like to discuss it.",
)
const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800/60 px-6 py-4 md:px-12 lg:px-16">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to work
        </Link>
      </nav>

      <header className="border-b border-zinc-800/60 px-6 py-16 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-500">
                {project.category}
              </span>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-wider text-zinc-600">
                <span>{project.role}</span>
                <span className="text-zinc-800">/</span>
                <span>{project.year}</span>
                <span className="text-zinc-800">/</span>
                <span
                  className={
                    project.status === "live"
                      ? "text-emerald-400/80"
                      : "text-amber-400/80"
                  }
                >
                  {project.status}
                </span>
              </div>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-700 px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-300 transition-colors hover:border-zinc-500"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Live
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="border-b border-zinc-800/60">
        <div className="relative mx-auto max-w-6xl px-6 py-12 md:px-12 lg:px-16">
          <div className="relative overflow-hidden border border-zinc-800 bg-zinc-950">
            <Image
              src={project.image}
              alt={`${project.title} showcase`}
              width={1280}
              height={project.previewType === "mobile" ? 800 : 720}
              className="h-auto w-full object-contain opacity-90"
              priority
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24 lg:px-16">
        <section className="mb-16">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
            Overview
          </h2>
          <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
            {project.overview}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
            Problem
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            {project.problem}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
            Solution
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            {project.solution}
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
            Key Features
          </h2>
          <ul className="space-y-3">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400 md:text-base">
                <span className="mt-2 h-px w-4 shrink-0 bg-zinc-700" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
            Outcome
          </h2>
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            {project.outcome}
          </p>
        </section>

        <div className="border-t border-zinc-800/60 pt-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500"
              >
                <ExternalLink className="h-4 w-4" />
                Open Live
              </a>
            )}
            <MagneticButton href={waUrl} size="lg">
              Start a Similar Project
              <ArrowUpRight className="h-5 w-5" />
            </MagneticButton>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/#work"
              className="text-xs uppercase tracking-wider text-zinc-600 transition-colors hover:text-zinc-400"
            >
              &larr; Back to all projects
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-600">
        &copy; {new Date().getFullYear()} Irfan Ariff. All rights reserved.
      </footer>
    </div>
  )
}
