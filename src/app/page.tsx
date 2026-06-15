import { HeroSection } from "@/components/sections/hero"
import { StatsSection } from "@/components/sections/stats"
import { SelectedWorkSection } from "@/components/sections/selected-work"
import { ServicesSection } from "@/components/sections/services"

import { ProcessSection } from "@/components/sections/process"
import { AboutSection } from "@/components/sections/about"
import { ContactSection } from "@/components/sections/contact"

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <SelectedWorkSection />
      <ServicesSection />
      <ProcessSection />
      <AboutSection />
      <ContactSection />
      <footer className="border-t border-zinc-800 px-4 py-8 text-center text-sm text-zinc-600">
        &copy; {new Date().getFullYear()} Irfan Ariff. All rights reserved.
      </footer>
    </>
  )
}
