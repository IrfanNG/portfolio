import { Project } from "@/types"

export const projects: Project[] = [
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
    liveUrl: "https://cetaknow-production.up.railway.app/",
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
    title: "JourneyJoy",
    slug: "journeyjoy",
    category: "Travel Planner App",
    description:
      "Offline-first Flutter travel planner for trips, expenses, flights, activities, packing, documents, and itinerary planning.",
    techStack: ["Flutter", "Firebase Auth", "Cloud Firestore", "Hive", "Provider"],
    image: "/projects/journeyjoy-showcase.png",
    previewType: "mobile",
    status: "live",
    role: "Mobile Developer",
    year: "2025",
    overview:
      "JourneyJoy is an offline-first travel planning app that helps users organize trips from start to finish — covering flights, accommodation, activities, packing, documents, and daily itineraries in one place.",
    problem:
      "Most travel planning tools either required constant internet access, scattered trip information across multiple apps (notes, spreadsheets, booking confirmations), or were too complex for casual travelers. Users needed a simple, unified app that worked offline and synced when connected.",
    solution:
      "I built a Flutter app with Hive for offline local storage and Cloud Firestore for cross-device sync. Users create trips, add flight and accommodation details, plan daily activities, build packing lists, and attach document photos — all available offline with automatic sync.",
    features: [
      "Offline-first architecture with Hive local storage",
      "Cross-device sync via Cloud Firestore",
      "Trip creation with flight, hotel, and transport details",
      "Daily itinerary builder with activity scheduling",
      "Packing checklist with per-trip customization",
      "Document storage with photo capture and notes",
      "Expense tracking per trip and category",
    ],
    outcome:
      "JourneyJoy enables travelers to plan every aspect of a trip in a single app, work offline during travel, and sync data seamlessly when connectivity is available — eliminating the need for multiple disjointed tools.",
    liveUrl: "https://journey-joy-dbc69.web.app/#/home",
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
