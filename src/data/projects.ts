import { Project } from "@/types"

export const projects: Project[] = [
  {
    title: "UTP MedTech",
    slug: "utp-medtech",
    category: "Multimedia Production Studio",
    description:
      "Corporate website for UTP MedTech Crew — a multimedia production studio covering photography, videography, live streaming, and end-to-end event solutions for leading organizations.",
    techStack: ["React", "TypeScript", "Vite", "Supabase", "Framer Motion"],
    image: "/projects/medtech-showcase.png",
    previewType: "web",
    status: "live",
    role: "Frontend Developer",
    year: "2026",
    overview:
      "UTP MedTech Crew is a multimedia production studio crafting photography, videography, live streaming and end-to-end event solutions for leading organizations across Malaysia and beyond.",
    problem:
      "The club needed a modern digital presence that matched the quality of their production work. Their existing site didn't reflect the scale of their operations — covering 500+ events for clients like PETRONAS, UTP, TM, and MDEC.",
    solution:
      "I built a cinematic, high-impact corporate website with React, TypeScript, and Vite. The site features a bold hero section, services showcase, featured projects carousel, client testimonials, and a full portfolio — designed to feel as polished as the media they produce.",
    features: [
      "Cinematic hero section with full production branding",
      "Services showcase (photography, videography, technical, design, website)",
      "Featured projects carousel with filterable portfolio",
      "Client testimonials and trust badges",
      "Contact and quote request flow",
      "Supabase-powered content management",
    ],
    outcome:
      "The new website gives UTP MedTech a professional online presence that matches their reputation — presenting their services, portfolio, and client base in a way that builds trust with leading organizations.",
    liveUrl: "https://utp-medtech.irfanariff.com/",
  },
  {
    title: "CetakNow",
    slug: "cetaknow",
    category: "Print Ordering Platform",
    description:
      "Multi-tenant online printing order system for shop subscriptions, PDF order uploads, automated pricing, payment flow, pickup slots, admin dashboards, and revenue monitoring.",
    techStack: ["Node.js", "PostgreSQL", "Railway", "Billplz", "Native HTTP"],
    image: "/projects/cetaknow-showcase.png",
    previewType: "web",
    status: "live",
    role: "Full-Stack Developer",
    year: "2025",
    overview:
      "CetakNow is a multi-tenant SaaS platform that connects print shops with their customers through a centralized ordering, payment, and pickup management system.",
    problem:
      "Small to mid-size print shops in Malaysia relied on manual WhatsApp-based ordering, PDF collection via chat, and cash-on-delivery payments. Shop owners had no visibility into order volume, revenue, or pickup schedules. Customers had no way to track the status of their prints or know when to collect them.",
    solution:
      "I built a web-based ordering platform where print shop owners can subscribe, configure their pricing, and receive orders through a structured dashboard. Customers upload PDFs, get instant price calculations, and complete payment through Billplz. The system automatically assigns pickup time slots and sends status notifications.",
    features: [
      "Multi-tenant shop subscription and onboarding",
      "PDF upload with automated pricing calculation",
      "Billplz payment gateway integration",
      "Pickup slot scheduling and management",
      "Shop admin dashboard with revenue monitoring",
      "Order status tracking and notifications",
    ],
    outcome:
      "Print shops using CetakNow have reduced order management time, eliminated lost orders from chat-based workflows, and gained clear visibility into their daily revenue and pickup traffic.",
    liveUrl: "https://cetaknow.irfanariff.com/",
  },
  {
    title: "BMoris",
    slug: "bmoris",
    category: "Language Learning App",
    description:
      "AI-powered Bahasa Melayu learning app for pronunciation practice, lessons, quizzes, translation, gamification, and admin content management.",
    techStack: ["Flutter", "Firebase Auth", "Cloud Firestore", "Speech-to-Text", "Flutter TTS"],
    image: "/projects/bmoris-showcase.png",
    previewType: "mobile",
    status: "live",
    role: "Mobile Developer",
    year: "2025",
    overview:
      "BMoris is an AI-assisted language learning app designed to help non-native speakers practice and improve their Bahasa Melayu pronunciation, vocabulary, and comprehension through structured lessons and real-time speech feedback.",
    problem:
      "Existing language learning platforms for Bahasa Melayu lacked native-level pronunciation training. Learners had no way to practice speaking and receive feedback on accuracy. Teachers needed a way to create custom content and track student progress without relying on generic third-party tools.",
    solution:
      "I developed a Flutter mobile app with Firebase backend that delivers structured lessons with speech recognition for pronunciation scoring. The app includes text-to-speech for correct pronunciation modeling, gamified quizzes to reinforce vocabulary, and an admin panel for content management.",
    features: [
      "Speech-to-text pronunciation scoring and feedback",
      "Text-to-speech for correct pronunciation modeling",
      "Structured lessons with vocabulary and comprehension",
      "Gamified quizzes with progress tracking",
      "Translation and transliteration support",
      "Admin content management panel",
    ],
    outcome:
      "BMoris provides a complete self-paced learning experience with real-time pronunciation feedback, enabling learners to practice independently and track improvement across lessons and quizzes.",
  },
  {
    title: "UTP EVEX Club",
    slug: "evex-utp",
    category: "Event Management Club Website",
    description:
      "Website for UTP EVEX Club, supporting Event, Conference & Visit Management through student-led planning, creative production, and on-ground coordination.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Lenis"],
    image: "/projects/evex-utp-showcase.jpg",
    previewType: "web",
    status: "live",
    role: "Frontend Developer",
    year: "2026",
    overview:
      "UTP EVEX Club operates under Event, Conference & Visit Management at Universiti Teknologi PETRONAS. The site presents the club's services, selected work, working process, and enquiry details in one place.",
    problem:
      "The club needed a dedicated digital presence to introduce its event services, showcase its work, and give prospective clients a clear way to get in touch.",
    solution:
      "Built a single-page event showcase with Next.js, React, TypeScript, and Tailwind CSS. GSAP and Lenis provide animated storytelling and smooth-scrolling interactions throughout the site.",
    features: [
      "Full-screen event-focused hero section",
      "Event planning, creative production, and on-ground coordination service showcase",
      "Selected-work gallery for campus events",
      "Four-step process from brief to showtime",
      "GSAP ScrollTrigger animations and Lenis smooth scrolling",
      "Contact and event-enquiry section",
    ],
    outcome:
      "The site gives UTP EVEX Club a polished central presence for explaining its role, showcasing its event work, and directing visitors to make an enquiry.",
    liveUrl: "https://evex-utp.irfanariff.com/",
  },
  {
    title: "MyUmrahGuide",
    slug: "myumrahguide",
    category: "Pilgrim Companion App",
    description:
      "Flutter Umrah practice and guidance app with ritual progression, manual/location modes, Tawaf and Sa'i simulation, offline caching, and ML-assisted recommendations.",
    techStack: ["Flutter", "Firebase Auth", "Cloud Firestore", "flutter_map", "FastAPI ML"],
    image: "/projects/myumrahguide-showcase.png",
    previewType: "mobile",
    status: "live",
    role: "Mobile Developer",
    year: "2025",
    overview:
      "MyUmrahGuide is a mobile companion for Umrah pilgrims that provides step-by-step ritual guidance, interactive Tawaf and Sa'i simulations, location-aware progress tracking, and ML-powered recommendations.",
    problem:
      "First-time Umrah pilgrims often struggled with ritual sequences, especially in crowded conditions at the Grand Mosque. Existing guides were static PDFs or generic videos that could not adapt to the pilgrim's location or progress through the rituals.",
    solution:
      "I developed a Flutter app with flutter_map for interactive ritual mapping and a FastAPI ML backend for personalized recommendations. The app features manual step-by-step mode and automatic location-based mode that tracks pilgrim progress through Tawaf and Sa'i.",
    features: [
      "Step-by-step ritual progression with dua and transliteration",
      "Manual and automatic GPS-based location tracking modes",
      "Interactive Tawaf and Sa'i simulation with flutter_map",
      "Offline caching for ritual content and maps",
      "ML-assisted recommendations based on pilgrim progress",
      "Ritual completion tracking and history",
    ],
    outcome:
      "MyUmrahGuide provides pilgrims with a reliable, offline-capable companion that adapts to their progress, offers location-aware guidance, and helps them complete rituals with confidence even without internet access.",
    liveUrl: "https://myumrahguide-nisa.web.app",
  },
]
