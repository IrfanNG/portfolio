export interface Project {
  title: string
  category: string
  description: string
  techStack: string[]
  image: string
  status: "live" | "development" | "archived"
  liveUrl?: string
  githubUrl?: string
}

export interface Service {
  title: string
  description: string
  deliverables: string[]
  icon: string
}

export interface Profile {
  name: string
  role: string
  tagline: string
  location: string
  email?: string
  whatsappNumberEnvKey: string
  socialLinks: SocialLink[]
}

export interface SocialLink {
  label: string
  url: string
  icon: string
}

export interface Skill {
  category: string
  items: string[]
}

export interface ProcessStep {
  step: number
  title: string
  description: string
}
