import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { SKILLS_FALLBACK } from "../data/skills";

export default function Skills() {
  const [skills] = useState(SKILLS_FALLBACK);
  const [loading] = useState(false);
  const [err] = useState("");
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Group skills by category - using local data
  const groupedByCategory = useMemo(() => {
    const categories = {};
    skills.forEach(skill => {
      const category = skill.category || "Other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(skill);
    });
    return categories;
  }, [skills]);

  // Get all unique categories
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(skills.map(s => s.category || "Other"))];
    return ["all", ...uniqueCats.sort()];
  }, [skills]);

  // Filtered skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") return skills;
    return skills.filter(skill => skill.category === activeCategory);
  }, [skills, activeCategory]);

  // Skill icons mapping - UPDATED with all skills
  const skillIcons = {
    // Original skills
    "Java": "☕",
    "Spring Boot": "🚀",
    "Spring Security": "🔒",
    "JPA/Hibernate": "💾",
    "PostgreSQL": "🐘",
    "Docker": "🐳",
    "WebSocket": "🔌",
    "REST APIs": "🔄",
    "JavaScript": "📜",
    "TypeScript": "📘",
    "React.js": "⚛️",
    "React": "⚛️",
    "HTML5": "🌐",
    "HTML": "🌐",
    "CSS": "🎨",
    "Leaflet.js": "🗺️",
    "OpenStreetMaps": "🌍",
    "Chart.js": "📊",
    "Haversine": "📍",
    "Haversine Formula": "📍",
    "OOP Concepts": "🏗️",
    "Real-time Systems": "⚡",
    "Map Visualization": "📈",
    "OSRM": "🛣️",
    "Maven": "📦",
    "Git": "📝",
    "JWT": "🔑",
    "Socket.io": "🔗",
    "Node.js": "🟢",
    
    // New variations
    "Spring Boot Microservices": "🚀",
    "Docker Compose": "🐳",
    "PostgreSQL Optimization": "🐘",
    "React Hooks": "⚛️",
    "TypeScript Interfaces": "📘",
    "REST API Design": "🔄",
    "WebSocket Implementation": "🔌",
    "Leaflet Map Layers": "🗺️",
    "Chart.js Customization": "📊",
    "Spring Security JWT": "🔒",
    "JPA Query Optimization": "💾",
    "Real-time Data Streaming": "⚡",
    "GIS Data Processing": "🗺️",
    "Map Rendering Optimization": "📈",
    "OSRM Routing Algorithms": "🛣️",
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .skills-container {
      min-height: 100vh;
      width: 100vw;
      position: relative;
      overflow-x: hidden;
      font-family: 'Space Grotesk', sans-serif;
      background: linear-gradient(135deg, #0a0a0f 0%, #0f172a 40%, #1e1b4b 100%);
      color: #f8fafc;
      padding-top: 60px;
    }

    .noise-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.02;
      pointer-events: none;
      z-index: 1;
    }

    /* Main Content */
    .main-content {
      position: relative;
      z-index: 10;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(4rem, 6vw, 6rem) clamp(2rem, 5vw, 4rem);
      width: 100%;
    }

    /* Header */
    .page-header {
      text-align: center;
      margin-bottom: clamp(4rem, 6vw, 6rem);
      position: relative;
    }

    .page-title {
      font-size: clamp(3.5rem, 8vw, 6.5rem);
      font-weight: 900;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981, #3b82f6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 300% 300%;
      animation: gradientFlow 8s ease infinite;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    @keyframes gradientFlow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .page-subtitle {
      font-size: clamp(1.2rem, 2vw, 1.6rem);
      color: #94a3b8;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;
      font-weight: 400;
    }

    /* Stats Overview */
    .stats-overview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: clamp(4rem, 6vw, 6rem);
      position: relative;
      z-index: 20;
    }

    @media (max-width: 768px) {
      .stats-overview {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    .stat-card {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 25px;
      padding: 2.5rem 2rem;
      text-align: center;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
    }

    .stat-card:hover {
      transform: translateY(-15px) scale(1.05);
      box-shadow: 
        0 30px 60px rgba(59, 130, 246, 0.4),
        0 0 50px rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .stat-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .stat-number {
      font-size: clamp(2.5rem, 4vw, 4rem);
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 0.5rem;
      text-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
    }

    .stat-label {
      font-size: 1.1rem;
      color: #cbd5e1;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    /* Category Filter */
    .category-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-bottom: clamp(3rem, 5vw, 5rem);
      position: relative;
      z-index: 20;
      max-width: 100%;
      overflow-x: auto;
      padding: 10px 0;
    }

    .category-filter::-webkit-scrollbar {
      height: 6px;
    }

    .category-filter::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }

    .category-filter::-webkit-scrollbar-thumb {
      background: rgba(59, 130, 246, 0.5);
      border-radius: 10px;
    }

    .category-btn {
      padding: 1rem 2rem;
      border-radius: 15px;
      font-weight: 600;
      font-size: 1rem;
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.15) 0%,
        rgba(37, 99, 235, 0.15) 100%);
      border: 2px solid rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .category-btn:hover {
      transform: translateY(-5px) scale(1.05);
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.25) 0%,
        rgba(37, 99, 235, 0.25) 100%);
      box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
    }

    .category-btn.active {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
    }

    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: clamp(4rem, 6vw, 6rem);
      position: relative;
      z-index: 20;
    }

    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }
    }

    .skill-card {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.85) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      border-radius: 20px;
      padding: 1.5rem;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      min-height: 180px;
    }

    .skill-card:hover {
      transform: translateY(-10px) scale(1.03);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(59, 130, 246, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .skill-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent,
        rgba(59, 130, 246, 0.15),
        transparent);
      transition: left 0.8s ease;
    }

    .skill-card:hover::before {
      left: 100%;
    }

    .skill-header {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 1rem;
    }

    .skill-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.2) 0%,
        rgba(37, 99, 235, 0.2) 100%);
      border: 2px solid rgba(59, 130, 246, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
      flex-shrink: 0;
    }

    .skill-card:hover .skill-icon {
      transform: rotate(10deg) scale(1.1);
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.3) 0%,
        rgba(37, 99, 235, 0.3) 100%);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
    }

    .skill-info {
      flex: 1;
      min-width: 0;
    }

    .skill-name {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .skill-category {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .skill-level {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-top: 0.3rem;
    }

    .level-advanced {
      background: linear-gradient(135deg,
        rgba(16, 185, 129, 0.2) 0%,
        rgba(5, 150, 105, 0.2) 100%);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #6ee7b7;
    }

    .level-intermediate {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.2) 0%,
        rgba(37, 99, 235, 0.2) 100%);
      border: 1px solid rgba(59, 130, 246, 0.4);
      color: #93c5fd;
    }

    .skill-description {
      font-size: 0.9rem;
      color: #94a3b8;
      line-height: 1.4;
      margin-top: 0.8rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Loading State */
    .loading-container {
      text-align: center;
      padding: 4rem;
      grid-column: 1 / -1;
    }

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 3px solid rgba(59, 130, 246, 0.1);
      border-top-color: #3b82f6;
      border-radius: 50%;
      margin: 0 auto 2rem;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: 1.2rem;
      color: #94a3b8;
    }

    /* Error State */
    .error-container {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, 
        rgba(185, 28, 28, 0.1) 0%,
        rgba(127, 29, 29, 0.2) 100%);
      border-radius: 30px;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(220, 38, 38, 0.3);
      grid-column: 1 / -1;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 2rem;
      color: #f87171;
    }

    .error-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #f8fafc;
    }

    .error-text {
      font-size: 1.2rem;
      color: #fca5a5;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Tech Stack Overview */
    .tech-overview {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 35px;
      padding: 3rem;
      margin: clamp(4rem, 6vw, 6rem) 0;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 20;
      overflow: hidden;
    }

    .overview-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #f8fafc;
      text-align: center;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .tech-category {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.15) 0%,
        rgba(37, 99, 235, 0.15) 100%);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .category-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #3b82f6;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .category-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .mini-skill {
      padding: 0.5rem 0.8rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .mini-skill:hover {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
      transform: translateY(-2px);
    }

    /* Skills Count Display */
    .skills-count {
      text-align: center;
      margin: 1rem 0 2rem;
      font-size: 1.1rem;
      color: #94a3b8;
    }

    .skills-count strong {
      color: #3b82f6;
      font-weight: 700;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        padding: 2rem 1rem;
      }

      .page-title {
        font-size: 2.5rem;
      }

      .page-subtitle {
        font-size: 1.1rem;
      }

      .tech-overview {
        padding: 2rem 1rem;
      }

      .overview-grid {
        grid-template-columns: 1fr;
      }

      .category-filter {
        gap: 0.5rem;
        padding: 5px 0;
      }

      .category-btn {
        padding: 0.8rem 1.2rem;
        font-size: 0.9rem;
      }

      .skill-card {
        padding: 1.2rem;
      }

      .skill-icon {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
      }

      .skill-name {
        font-size: 1.1rem;
      }

      .skill-description {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 2rem;
      }

      .skill-card {
        padding: 1rem;
      }

      .skill-header {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }

      .skill-icon {
        margin-bottom: 0.5rem;
      }

      .stat-card {
        padding: 1.5rem 1rem;
      }

      .stat-number {
        font-size: 2rem;
      }
    }
  `;

  // Skill descriptions mapping
  const skillDescriptions = {
    "Java": "Strong foundation in object-oriented programming, multithreading, and enterprise application development.",
    "Spring Boot": "Building scalable microservices and REST APIs with auto-configuration and production-ready features.",
    "Spring Security": "Implementing JWT authentication, authorization, and secure API endpoints.",
    "JPA/Hibernate": "Object-relational mapping for efficient database operations and complex query handling.",
    "PostgreSQL": "Relational database design, optimization, and complex query writing.",
    "Docker": "Containerization for consistent development and deployment environments.",
    "WebSocket": "Real-time bidirectional communication for live updates and notifications.",
    "REST APIs": "Designing and implementing RESTful services with proper status codes and error handling.",
    "JavaScript": "Modern ES6+ features, asynchronous programming, and DOM manipulation.",
    "TypeScript": "Type-safe JavaScript development with interfaces, generics, and strict typing.",
    "React.js": "Building reusable components with hooks, context API, and modern state management.",
    "React": "Building reusable components with hooks, context API, and modern state management.",
    "HTML5": "Semantic markup, accessibility, and modern browser APIs.",
    "HTML": "Semantic markup, accessibility, and modern browser APIs.",
    "CSS": "Responsive design, CSS Grid, Flexbox, and modern styling techniques.",
    "Leaflet.js": "Interactive map visualization with custom layers, markers, and controls.",
    "OpenStreetMaps": "Open-source mapping integration and tile layer management.",
    "Chart.js": "Data visualization with interactive charts and real-time updates.",
    "Haversine": "Distance calculation algorithms for geospatial applications.",
    "Haversine Formula": "Distance calculation algorithms for geospatial applications.",
    "OOP Concepts": "Encapsulation, inheritance, polymorphism, and design patterns.",
    "Real-time Systems": "Live data processing, WebSocket connections, and instant updates.",
    "Map Visualization": "Creating interactive maps with custom data layers and visualization.",
    "OSRM": "Open Source Routing Machine for pathfinding and route optimization.",
    "Maven": "Dependency management, build automation, and project lifecycle.",
    "Git": "Version control, branching strategies, and collaborative workflows.",
    "JWT": "JSON Web Tokens for secure authentication and authorization.",
    "Socket.io": "Real-time, bidirectional event-based communication.",
    "Node.js": "Server-side JavaScript for building scalable network applications.",
    
    // New variations descriptions
    "Spring Boot Microservices": "Designing and implementing microservices architecture with Spring Boot.",
    "Docker Compose": "Orchestrating multi-container Docker applications with Docker Compose.",
    "PostgreSQL Optimization": "Database performance tuning, indexing strategies, and query optimization.",
    "React Hooks": "Using functional components with hooks for state management and side effects.",
    "TypeScript Interfaces": "Defining contracts and type structures with TypeScript interfaces.",
    "REST API Design": "Design principles for creating scalable and maintainable RESTful APIs.",
    "WebSocket Implementation": "Implementing real-time communication protocols for live data.",
    "Leaflet Map Layers": "Working with tile layers, vector layers, and custom map overlays.",
    "Chart.js Customization": "Creating custom visualizations and interactive charts with Chart.js.",
    "Spring Security JWT": "Implementing JWT-based authentication and authorization in Spring.",
    "JPA Query Optimization": "Optimizing database queries using JPA criteria and native queries.",
    "Real-time Data Streaming": "Processing and streaming data in real-time applications.",
    "GIS Data Processing": "Handling and processing geospatial data formats and operations.",
    "Map Rendering Optimization": "Techniques for optimizing map rendering performance.",
    "OSRM Routing Algorithms": "Understanding and implementing routing algorithms with OSRM.",
  };

  // Category icons mapping
  const categoryIcons = {
    "Languages": "💻",
    "Backend": "🔧",
    "Security": "🔒",
    "ORM": "💾",
    "Database": "💾",
    "DevOps": "🚀",
    "Real-time": "⚡",
    "Frontend": "🎨",
    "Mapping": "🗺️",
    "GIS": "🗺️",
    "Visualization": "📊",
    "Algorithms": "🧠",
    "Concepts": "🏗️",
    "Architecture": "⚙️",
    "Routing": "🛣️",
    "Tools": "🛠️",
    "Other": "⚡",
    "Containerization": "🐳",
    "Database ORM": "💾",
    "Data Visualization": "📊",
    "System Architecture": "⚙️",
    "GIS Tools": "🗺️",
    "Authentication": "🔒",
    "SQL Databases": "💾",
    "Java Framework": "☕",
    "Communication Protocol": "🔌",
    "API Design": "🔄",
    "GIS Libraries": "🗺️",
    "Mapping Services": "🗺️",
    "Geospatial Algorithms": "📍",
    "Programming Languages": "💻",
    "Web Technologies": "🌐",
    "Core Languages": "💻",
    "Programming Paradigms": "🏗️",
    "Type-safe JavaScript": "📘",
    "UI Libraries": "⚛️",
  };

  return (
    <>
      <style>{styles}</style>
      <div className="skills-container">
        <div className="noise-overlay" />
        
        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="page-title">Technical Expertise</h1>
            <p className="page-subtitle">
              A comprehensive collection of technologies, frameworks, and tools that power my full-stack development journey
            </p>
          </motion.div>

          {/* Skills Count */}
          <motion.div 
            className="skills-count"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Showing <strong>{filteredSkills.length}</strong> skills in <strong>{activeCategory === "all" ? "all categories" : activeCategory}</strong>
          </motion.div>

          {/* Stats Overview */}
          <div className="stats-overview">
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon">🧠</div>
              <div className="stat-number">{skills.length}</div>
              <div className="stat-label">Total Skills</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon">🏗️</div>
              <div className="stat-number">{categories.length - 1}</div>
              <div className="stat-label">Categories</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-icon">⚡</div>
              <div className="stat-number">{skills.filter(s => s.level === "Advanced").length}</div>
              <div className="stat-label">Advanced Skills</div>
            </motion.div>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(category => (
              <motion.button
                key={category}
                className={`category-btn ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * categories.indexOf(category) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === "all" ? "All Skills" : category}
                <span>{category === "all" ? "🌟" : categoryIcons[category] || "⚡"}</span>
              </motion.button>
            ))}
          </div>

          {/* Loading State - Always hidden since loading is false */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p className="loading-text">Loading technical expertise...</p>
            </div>
          )}

          {/* Error State - Always hidden since err is empty string */}
          {err && !loading && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">Unable to Load Skills</h3>
              <p className="error-text">{err}</p>
            </div>
          )}

          {/* Skills Grid - Always shows local skills data */}
          {!loading && !err && (
            <div className="skills-grid">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={`${skill.id || skill.name}-${index}`}
                  className="skill-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.05 }}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="skill-header">
                    <div className="skill-icon">
                      {skillIcons[skill.name] || "⚡"}
                    </div>
                    <div className="skill-info">
                      <h3 className="skill-name">{skill.name}</h3>
                      <span className="skill-category">{skill.category}</span>
                      <span className={`skill-level level-${skill.level?.toLowerCase() || "intermediate"}`}>
                        {skill.level || "Intermediate"}
                      </span>
                    </div>
                  </div>
                  <p className="skill-description">
                    {skillDescriptions[skill.name] || "Proficient in this technology with practical project experience."}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tech Stack Overview */}
          <motion.div 
            className="tech-overview"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="overview-title">Technology Stack by Category</h2>
            <div className="overview-grid">
              {Object.entries(groupedByCategory).map(([category, categorySkills]) => (
                <div key={category} className="tech-category">
                  <h3 className="category-name">
                    {categoryIcons[category] || "⚡"} {category}
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto' }}>
                      ({categorySkills.length})
                    </span>
                  </h3>
                  <div className="category-skills">
                    {categorySkills.slice(0, 10).map((skill, index) => (
                      <span key={`${skill.id || skill.name}-${index}`} className="mini-skill">
                        {skillIcons[skill.name] || "⚡"} {skill.name}
                      </span>
                    ))}
                    {categorySkills.length > 10 && (
                      <span className="mini-skill" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        +{categorySkills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}