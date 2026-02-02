// src/data/projects.js

export const PROJECTS_FALLBACK = [
  {
    orderIndex: 1,
    title: "Emergency Incident Dispatch & Operations Management System",
    status: "Ongoing",
    category: "Enterprise / Mission-Critical",
    period: "Ongoing",
    description:
      "Enterprise-scale, real-time emergency response platform for incident lifecycle management, intelligent dispatching, and live operations.",
    techStack:
      "Java, Spring Boot, Spring Security (JWT), PostgreSQL, JPA/Hibernate, REST APIs, WebSockets, Scheduler Jobs, Docker",
    githubLink: "https://github.com/yourname/emergency-dispatch-system",
    liveLink: null,
    highlights: [
      "State-machine workflow: reporting → triage → dispatch → response → resolution → closure",
      "RBAC authentication with audit trails & activity logging",
      "Incident module: triage, severity, duplicate detection, approvals, attachments, notes, timeline",
      "SLA monitoring + automated breach detection + escalations",
      "GPS-based unit tracking + availability/capability + heatmaps + optimization",
      "Distance-aware unit assignment (Haversine) + multi-unit dispatch",
      "WebSocket live updates: incidents, movements, assignments, alerts",
      "Operational dashboards: stats, unit distribution, SLA performance, system health",
    ],
  },
  {
    orderIndex: 2,
    title: "Smart Waste Monitoring & Route Optimization Platform",
    status: "Ongoing",
    category: "Smart City / Optimization",
    period: "Ongoing",
    description:
      "Real-time smart waste management system for IoT-like monitoring, routing optimization, driver workflows, and analytics.",
    techStack:
      "Java / Node.js, WebSockets, REST APIs, Leaflet.js, Chart.js, PostgreSQL",
    githubLink: "https://github.com/yourname/smart-waste-platform",
    liveLink: null,
    highlights: [
      "Simulated IoT telemetry: fill levels, overflow alerts, timestamps (no hardware needed)",
      "Real-time map visualization with urgency indicators via WebSockets",
      "Route optimization to collect bins above thresholds efficiently",
      "Interactive maps with Leaflet.js + route visualization",
      "Driver & fleet workflows: accounts, capacity, assignments, collection status",
      "Collection history with routes, distances, volumes, completions",
      "Analytics dashboards: trends, hotspots, driver efficiency, delayed collections",
      "Extensions: predictive filling, SLA alerts, role-based access control",
    ],
  },
  {
    orderIndex: 3,
    title: "Smart Hospital Patient Flow & Resource Management System",
    status: "Planned / Building",
    category: "Healthcare / Systems",
    period: "Planned",
    description:
      "Hospital operations platform for triage-based queues, bed/ward occupancy, doctor assignment, SLA alerts, and patient journey tracking.",
    techStack: "Java, Spring Boot, PostgreSQL, WebSockets, Analytics Dashboard",
    githubLink: "https://github.com/yourname/smart-hospital-flow",
    liveLink: null,
    highlights: [
      "Triage-based queue prioritization (CRITICAL → HIGH → MEDIUM → LOW) + auto advancement",
      "Admission & bed management with occupancy tracking + auto allocation/release",
      "AI-assisted doctor assignment (least-loaded + specialization match)",
      "Live alerts + SLA escalation for long waiting times",
      "Analytics dashboard: flow metrics, visit time analytics, occupancy trends + forecasting",
      "End-to-end patient journey tracking with full audit & movement history",
    ],
  },
  {
    orderIndex: 4,
    title: "Royal Bakes – Online Delivery & Reservation System",
    status: "Completed",
    category: "MERN / Real-Time App",
    period: "Aug 2025 – Nov 2025",
    description:
      "MERN platform for online orders, table reservations, delivery ops, real-time tracking, and customer communications.",
    techStack:
      "MongoDB, Express.js, React.js, Node.js, Socket.IO, Leaflet.js, REST APIs",
    githubLink: "https://github.com/yourname/royal-bakes",
    liveLink: null,
    highlights: [
      "Online orders + reservations + delivery operations workflows",
      "Driver assignment with GPS + Haversine distance (manual + auto)",
      "Live chat (Socket.IO) + map-based tracking (Leaflet + OpenStreetMap)",
      "Delay detection + automated customer notifications",
      "Secure role-based access via REST APIs",
    ],
  },
  {
    orderIndex: 5,
    title: "Online Event Planning System",
    status: "Completed",
    category: "Java MVC / OOP",
    period: "Feb 2025 – May 2025",
    description:
      "MVC-based event management system applying core OOP principles with CRUD operations, dashboards, and persistence.",
    techStack: "Java, MVC, OOP, JSP, MySQL, JDBC",
    githubLink: "https://github.com/yourname/online-event-planning",
    liveLink: null,
    highlights: [
      "Full CRUD for users and events with JSP UI",
      "MySQL persistence via JDBC + session management",
      "Dynamic dashboards + interactive forms",
      "Structured service layers with OOP best practices",
    ],
  },
];

export default PROJECTS_FALLBACK;
