import { Project } from "@/types"

export const projects: Project[] = [
  {
    title: "Nexus Dashboard",
    category: "Full-Stack SaaS",
    description:
      "A real-time analytics dashboard for monitoring distributed system health. Built with WebSocket streaming and D3 visualizations.",
    techStack: ["Next.js", "TypeScript", "D3.js", "PostgreSQL", "WebSocket"],
    image: "/projects/nexus.jpg",
    status: "live",
    liveUrl: "https://nexus-dashboard.vercel.app",
    githubUrl: "https://github.com/irfan-ariff/nexus-dashboard",
  },
  {
    title: "Verde Marketplace",
    category: "E-Commerce",
    description:
      "Sustainable goods marketplace with carbon footprint tracking per order. Features a custom checkout engine and vendor portal.",
    techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
    image: "/projects/verde.jpg",
    status: "live",
    liveUrl: "https://verde-marketplace.vercel.app",
  },
  {
    title: "Spectral CMS",
    category: "Headless CMS",
    description:
      "A developer-friendly headless CMS with visual block editor, GraphQL API, and real-time preview. Designed for performance teams.",
    techStack: ["Next.js", "GraphQL", "PostgreSQL", "Tailwind CSS", "Docker"],
    image: "/projects/spectral.jpg",
    status: "development",
    githubUrl: "https://github.com/irfan-ariff/spectral-cms",
  },
  {
    title: "Drift Social",
    category: "Social Platform",
    description:
      "Anonymous location-based social platform with ephemeral content. Built with real-time messaging and proximity matching.",
    techStack: ["React Native", "Firebase", "Node.js", "Mapbox", "Socket.io"],
    image: "/projects/drift.jpg",
    status: "archived",
  },
]
