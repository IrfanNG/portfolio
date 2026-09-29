import { HeroSection } from "@/components/sections/hero"
import { StatsSection } from "@/components/sections/stats"
import { SelectedWorkSection } from "@/components/sections/selected-work"
import { AboutSection } from "@/components/sections/about"
import { ContactSection } from "@/components/sections/contact"
import { PortfolioIntro } from "@/components/sections/portfolio-intro"

export default function Home() {
  return (
    <PortfolioIntro>
      <HeroSection />
      <StatsSection />
      <SelectedWorkSection />
      <AboutSection />
      <ContactSection />
      <footer className="border-t border-zinc-800 px-4 py-8 text-center text-sm text-zinc-600">
        &copy; {new Date().getFullYear()} Irfan Ariff. All rights reserved.
      </footer>
    </PortfolioIntro>
  )
}
