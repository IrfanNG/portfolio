"use client"

import { cn } from "@/lib/utils"

interface SectionShellProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionShell({ children, className, id }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full px-4 py-20 md:px-8 md:py-28 lg:px-16 xl:px-24",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

export function SectionHeading({
  label,
  title,
  className,
}: {
  label?: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      {label && (
        <span className="mb-2 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500">
          {label}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  )
}
