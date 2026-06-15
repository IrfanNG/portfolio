"use client"

import { motion } from "framer-motion"
import { MessageSquare, ArrowRight } from "lucide-react"
import { SectionShell, SectionHeading, SectionWatermark } from "@/components/shared/section-shell"
import { MagneticButton } from "@/components/shared/magnetic-button"
import { profile } from "@/data/profile"

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "60183823063"
const waMessage = encodeURIComponent(
  "Hi Irfan, I have a project in mind and would like to discuss it.",
)
const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`
export function ContactSection() {
  return (
    <SectionShell id="contact" className="relative">
      <SectionWatermark>CONTACT</SectionWatermark>
      <div className="mx-auto max-w-xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] }}
        >
          <SectionHeading
            label="Contact"
            title="Let's Build Something Together"
            className="mb-6 text-center [&>h2]:text-center"
          />

          <p className="mx-auto max-w-md leading-relaxed text-zinc-400">
            Have a project in mind? Send me a short brief and I&apos;ll reply with the next
            step.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
          className="mt-10 border border-zinc-800 bg-zinc-900/20 p-8 md:p-10"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {waUrl && (
              <MagneticButton href={waUrl} size="lg">
                <MessageSquare className="h-5 w-5" />
                Start a Project
                <ArrowRight className="h-5 w-5" />
              </MagneticButton>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-zinc-600">
            <span>Available for freelance projects</span>
            <span className="text-zinc-800">/</span>
            <span>{profile.location} &middot; Remote</span>
            <span className="text-zinc-800">/</span>
            <span>Reply 24&ndash;48h</span>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
