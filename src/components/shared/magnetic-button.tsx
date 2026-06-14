"use client"

import { useRef, type ReactNode } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/components/providers/reduced-motion-provider"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  size = "md",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion } = useReducedMotion()

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantClasses = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40",
    outline: "border border-zinc-700 text-white hover:bg-zinc-800",
    ghost: "text-zinc-400 hover:text-white",
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion || !ref.current) return
    ref.current.style.transform = "translate(0px, 0px)"
  }

  const Tag = href ? motion.a : motion.button

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Tag
        href={href}
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-none font-medium transition-colors",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </Tag>
    </motion.div>
  )
}
