import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { MAILTO, LINKEDIN, GITHUB, YOUTUBE } from "../config/links";

function About() {
  const [isDark, setIsDark] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [waterfallFlow, setWaterfallFlow] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    cgpa: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  
  const aboutRef = useRef(null);
  const waterfallRef = useRef(null);
  const statsRef = useRef(null);
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);

  // Stats to animate
  const stats = {
    projects: 5,
    skills: 18,
    experience: 0,
    cgpa: 3.37,
  };

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollPercent = Math.min(scrollY / 500, 1);
      setWaterfallFlow(scrollPercent);
      
      // Trigger animations when elements are visible
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    setTimeout(() => setIsDark(true), 800);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Stats animation
  useEffect(() => {
    if (isVisible) {
      const duration = 1800;
      const steps = 60;
      const stepDuration = duration / steps;

      Object.keys(stats).forEach((key) => {
        const targetValue = stats[key];
        const stepValue = targetValue / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
          currentStep++;
          setAnimatedStats((prev) => ({
            ...prev,
            [key]: parseFloat((stepValue * currentStep).toFixed(2)),
          }));

          if (currentStep >= steps) {
            clearInterval(interval);
            setAnimatedStats((prev) => ({
              ...prev,
              [key]: targetValue,
            }));
          }
        }, stepDuration);
      });
    }
  }, [isVisible]);

  // Canvas for MIND-BLOWING WATERFALL
  useEffect(() => {
    const canvas = waterfallRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    // Waterfall particles
    const particles = [];
    const maxParticles = 120;
    const rippleCenters = [];
    
    class WaterParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.color = `hsla(${200 + Math.random() * 60}, 100%, 70%, ${Math.random() * 0.4 + 0.2})`;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.06 + 0.03;
        this.life = 1;
        this.decay = Math.random() * 0.002 + 0.001;
      }
      
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.4;
        this.wobble += this.wobbleSpeed;
        this.life -= this.decay;
        
        // Splash effect at bottom
        if (this.y > canvas.height - 30) {
          rippleCenters.push({x: this.x, y: canvas.height, life: 1});
          this.y = Math.random() * -100;
          this.x = Math.random() * canvas.width;
        }
        
        // Respawn at top if dead
        if (this.y < -50 || this.life <= 0) {
          this.y = Math.random() * -100;
          this.x = Math.random() * canvas.width;
          this.life = 1;
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(200, 100%, 90%, ${this.life * 0.7})`);
        gradient.addColorStop(1, `hsla(200, 100%, 60%, ${this.life * 0.2})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
    
    // Ripple effect
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 40;
        this.life = 1;
        this.speed = 1.5;
      }
      
      update() {
        this.radius += this.speed;
        this.life -= 0.03;
      }
      
      draw() {
        if (this.life <= 0) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(200, 100%, 70%, ${this.life * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new WaterParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }
    
    const ripples = [];
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw waterfall base
      const waterfallGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      waterfallGradient.addColorStop(0, 'hsla(210, 100%, 60%, 0.12)');
      waterfallGradient.addColorStop(0.5, 'hsla(210, 100%, 60%, 0.06)');
      waterfallGradient.addColorStop(1, 'hsla(210, 100%, 60%, 0.02)');
      ctx.fillStyle = waterfallGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw main waterfall streams
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        const waveOffset = Math.sin(Date.now() * 0.001 + i) * 8;
        ctx.moveTo(canvas.width * (0.2 + i * 0.3) + waveOffset, 0);
        ctx.lineTo(canvas.width * (0.15 + i * 0.35) + waveOffset * 0.5, canvas.height);
        ctx.strokeStyle = `hsla(210, 100%, 70%, ${0.3 + waterfallFlow * 0.2})`;
        ctx.lineWidth = 12;
        ctx.stroke();
      }
      
      // Create new ripples
      while (rippleCenters.length > 0) {
        const center = rippleCenters.pop();
        ripples.push(new Ripple(center.x, center.y));
      }
      
      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].life <= 0 || ripples[i].radius > ripples[i].maxRadius) {
          ripples.splice(i, 1);
        }
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw mist effect
      const mistGradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height,
        0,
        canvas.width * 0.3, canvas.height,
        150
      );
      mistGradient.addColorStop(0, 'hsla(210, 100%, 70%, 0.08)');
      mistGradient.addColorStop(1, 'hsla(210, 100%, 70%, 0)');
      ctx.fillStyle = mistGradient;
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [waterfallFlow]);

  const skills = [
    { 
      category: "Frontend", 
      skills: ["React.js", "JavaScript", "TypeScript", "CSS", "HTML5"],
      icon: "⚡"
    },
    { 
      category: "Backend", 
      skills: ["Node.js", "Java", "C++", "Spring Boot", "MERN Stack"],
      icon: "🔧"
    },
    { 
      category: "APIs & Tools", 
      skills: ["Socket.io", "JWT", "Maven", "Docker", "REST APIs"],
      icon: "🛠️"
    },
    { 
      category: "Maps & AI", 
      skills: ["Leaflet.js", "OpenStreetMaps", "Google Maps API", "AI Prompt Engineering"],
      icon: "🧠"
    },
  ];

  const honors = [
    {
      title: "Content Creator & Educator",
      organization: "YouTube - imesh weerasuria",
      description: "Run a YouTube channel dedicated to teaching current SLIIT modules with a focus on test preparation, sharing knowledge, and supporting fellow students.",
      icon: "🎓",
      color: "#3b82f6"
    },
    {
      title: "Foundations in Microsoft Office Packages",
      organization: "IDM Nations Campus",
      description: "Successfully completed training in core Microsoft applications including Word, Excel, PowerPoint, and Access, building a strong foundation in productivity tools.",
      icon: "📊",
      color: "#10b981"
    },
    {
      title: "Senior Prefect",
      organization: "Local Dhamma School",
      description: "Served as a senior prefect demonstrating leadership, discipline, and responsibility in managing student activities and upholding school values.",
      icon: "🌟",
      color: "#f59e0b"
    },
    {
      title: "Speech and Drama Training",
      organization: "Wendy Whatmore Academy",
      description: "Engaged in a wide range of speech and drama activities during childhood, enhancing public speaking confidence and creative expression.",
      icon: "🎤",
      color: "#8b5cf6"
    },
  ];

  const timeline = [
    { 
      year: "Present", 
      event: "3rd Year Undergraduate at SLIIT", 
      description: "BSc (Hons) Information Technology specializing in Software Engineering",
      icon: "🎓"
    },
    { 
      year: "2021", 
      event: "Royal College Colombo Alumni", 
      description: "Old Boy Union Member - Proud Royalist",
      icon: "👑"
    },
    { 
      year: "2020", 
      event: "YouTube Channel Launch", 
      description: "Started educational content creation for SLIIT students",
      icon: "🎬"
    },
    { 
      year: "2019", 
      event: "Microsoft Office Certification", 
      description: "Completed comprehensive training in productivity tools",
      icon: "📄"
    },
    { 
      year: "2018", 
      event: "Leadership Role", 
      description: "Senior Prefect at Local Dhamma School",
      icon: "⭐"
    },
    { 
      year: "2015", 
      event: "Creative Development", 
      description: "Speech and Drama training at Wendy Whatmore Academy",
      icon: "🎭"
    },
  ];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

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

    .about-container {
      min-height: 100vh;
      width: 100vw;
      position: relative;
      overflow-x: hidden;
      font-family: 'Space Grotesk', sans-serif;
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      background: linear-gradient(135deg, #0a0a0f 0%, #0f172a 40%, #1e1b4b 100%);
      color: #f8fafc;
      padding-top: 60px;
    }

    /* MIND-BLOWING WATERFALL */
    .waterfall-container {
      position: fixed;
      top: 0;
      right: 0;
      width: 35%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.7;
      filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.4));
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

    .main-content {
      position: relative;
      z-index: 10;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem);
      width: 100%;
    }

    /* Navigation */
    .nav-back {
      position: fixed;
      top: 2rem;
      left: 2rem;
      z-index: 100;
    }

    .back-button {
      padding: 1rem 2rem;
      border-radius: 15px;
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.9) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(59, 130, 246, 0.4);
      color: #e2e8f0;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 0.8rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
    }

    .back-button:hover {
      transform: translateX(-8px) scale(1.05);
      color: #3b82f6;
      border-color: #3b82f6;
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.2) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      box-shadow: 
        0 25px 50px rgba(59, 130, 246, 0.3),
        0 0 40px rgba(59, 130, 246, 0.2);
    }

    /* Header */
    .page-header {
      text-align: center;
      margin-bottom: clamp(3rem, 6vw, 5rem);
      position: relative;
    }

    .page-title {
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 900;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 300% 300%;
      animation: gradientFlow 8s ease infinite;
      letter-spacing: 1px;
      line-height: 1.1;
    }

    @keyframes gradientFlow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .page-subtitle {
      font-size: clamp(1.1rem, 2vw, 1.5rem);
      color: #94a3b8;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Stats Section */
    .stats-section {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: clamp(4rem, 6vw, 6rem);
      position: relative;
      z-index: 20;
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

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.15), transparent);
      opacity: 0;
      transition: opacity 0.5s;
      z-index: -1;
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-number {
      font-size: clamp(2.5rem, 4vw, 4rem);
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 0.8rem;
      text-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
    }

    .stat-label {
      font-size: 1.1rem;
      color: #cbd5e1;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 4rem;
      margin-bottom: clamp(4rem, 6vw, 6rem);
      position: relative;
      z-index: 20;
    }

    /* About Text */
    .about-text {
      font-size: clamp(1.1rem, 1.5vw, 1.3rem);
      line-height: 1.8;
      color: #cbd5e1;
      margin-bottom: 2rem;
    }

    .highlight {
      color: #3b82f6;
      font-weight: 600;
      position: relative;
      display: inline-block;
    }

    .highlight::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }

    .highlight:hover::after {
      transform: scaleX(1);
    }

    /* Education Card */
    .education-card {
      background: linear-gradient(135deg, 
        rgba(185, 28, 28, 0.15) 0%,
        rgba(124, 58, 237, 0.15) 100%);
      border-radius: 25px;
      padding: 2.5rem;
      margin: 2.5rem 0;
      border: 2px solid rgba(185, 28, 28, 0.3);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(20px);
      transition: all 0.4s ease;
    }

    .education-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 50px rgba(185, 28, 28, 0.2);
    }

    .education-icon {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      display: inline-block;
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .education-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.8rem;
      color: #f8fafc;
    }

    .education-subtitle {
      font-size: 1.2rem;
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }

    /* Skills Grid */
    .skills-section {
      position: relative;
      z-index: 20;
    }

    .section-title {
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 2.5rem;
      color: #f8fafc;
      text-align: center;
      position: relative;
      display: inline-block;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 2px;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    .skill-category {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .skill-category:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 
        0 25px 50px rgba(59, 130, 246, 0.3),
        0 0 40px rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .category-icon {
      font-size: 2rem;
      color: #3b82f6;
    }

    .category-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #3b82f6;
    }

    .skill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }

    .skill-item {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.15) 0%,
        rgba(37, 99, 235, 0.15) 100%);
      color: #e2e8f0;
      padding: 0.8rem 1.2rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 500;
      border: 1px solid rgba(59, 130, 246, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
      backdrop-filter: blur(10px);
    }

    .skill-item:hover {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.3) 0%,
        rgba(37, 99, 235, 0.3) 100%);
      transform: scale(1.1);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
      border-color: #3b82f6;
    }

    /* Timeline */
    .timeline-section {
      margin: clamp(4rem, 6vw, 6rem) 0;
      position: relative;
      z-index: 20;
    }

    .timeline {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 100%;
      background: linear-gradient(transparent, #3b82f6, #8b5cf6, #10b981, transparent);
    }

    .timeline-item {
      display: flex;
      align-items: center;
      margin-bottom: 3.5rem;
      position: relative;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease;
    }

    .timeline-item.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .timeline-item:nth-child(odd) {
      flex-direction: row-reverse;
    }

    .timeline-year {
      flex: 0 0 120px;
      text-align: center;
      font-weight: 700;
      font-size: 1.4rem;
      color: #3b82f6;
      position: relative;
      padding: 0.5rem;
    }

    .timeline-year::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 25px;
      height: 25px;
      background: #0f172a;
      border: 3px solid #3b82f6;
      border-radius: 50%;
      z-index: 2;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }

    .timeline-year::after {
      content: attr(data-icon);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.2rem;
      z-index: 3;
    }

    .timeline-content {
      flex: 1;
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 20px;
      padding: 2rem;
      margin: 0 2.5rem;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .timeline-content:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 
        0 25px 50px rgba(59, 130, 246, 0.3),
        0 0 40px rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .timeline-event {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.8rem;
      color: #f8fafc;
    }

    .timeline-description {
      font-size: 1.1rem;
      color: #94a3b8;
      line-height: 1.6;
    }

    /* Honors & Awards */
    .honors-section {
      margin: clamp(4rem, 6vw, 6rem) 0;
      position: relative;
      z-index: 20;
    }

    .honors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2.5rem;
    }

    .honor-card {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 25px;
      padding: 2.5rem;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
    }

    .honor-card:hover {
      transform: translateY(-15px) scale(1.03);
      box-shadow: 
        0 35px 70px rgba(0, 0, 0, 0.4),
        0 0 60px rgba(59, 130, 246, 0.3);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .honor-icon {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .honor-card:hover .honor-icon {
      transform: scale(1.2) rotate(10deg);
    }

    .honor-title {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 0.8rem;
      color: #f8fafc;
    }

    .honor-org {
      font-size: 1.1rem;
      color: #3b82f6;
      margin-bottom: 1.2rem;
      font-weight: 600;
    }

    .honor-description {
      font-size: 1rem;
      color: #94a3b8;
      line-height: 1.7;
    }

    /* Contact Section */
    .contact-section {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 35px;
      padding: 4rem;
      margin: clamp(4rem, 6vw, 6rem) 0;
      text-align: center;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 20;
      overflow: hidden;
    }

    .contact-title {
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #f8fafc;
    }

    .contact-text {
      font-size: 1.3rem;
      color: #94a3b8;
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.7;
    }

    .contact-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .contact-button {
      padding: 1.2rem 2.5rem;
      border-radius: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1.1rem;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .contact-primary {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
      border: 2px solid rgba(59, 130, 246, 0.5);
    }

    .contact-secondary {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.15) 0%,
        rgba(37, 99, 235, 0.15) 100%);
      color: #3b82f6;
      border: 2px solid rgba(59, 130, 246, 0.4);
    }

    .contact-button:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 
        0 25px 50px rgba(59, 130, 246, 0.5),
        0 0 60px rgba(59, 130, 246, 0.3);
    }

    .contact-primary:hover {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
    }

    .contact-secondary:hover {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.3) 0%,
        rgba(37, 99, 235, 0.3) 100%);
    }

    /* Waterfall Flow Indicator */
    .waterfall-flow-indicator {
      position: fixed;
      top: 70px;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
      z-index: 999;
      transition: width 0.3s ease;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }

    /* Theme Toggle (Optional) */
    .theme-toggle {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 100;
    }

    .theme-button {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.9) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    }

    .theme-button:hover {
      transform: rotate(180deg) scale(1.1);
      color: #3b82f6;
      border-color: #3b82f6;
      box-shadow: 
        0 25px 50px rgba(59, 130, 246, 0.3),
        0 0 40px rgba(59, 130, 246, 0.2);
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .stats-section {
        grid-template-columns: repeat(2, 1fr);
      }

      .skills-grid {
        grid-template-columns: 1fr;
        max-width: 600px;
        margin: 0 auto;
      }

      .waterfall-container {
        width: 100%;
        opacity: 0.4;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 2rem 1.5rem;
      }

      .page-title {
        font-size: 3.5rem;
      }

      .stats-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .stat-card {
        padding: 2rem 1.5rem;
      }

      .timeline::before {
        left: 30px;
      }

      .timeline-item {
        flex-direction: row !important;
      }

      .timeline-year {
        flex: 0 0 100px;
      }

      .timeline-content {
        margin-left: 70px;
        margin-right: 0;
      }

      .honors-grid {
        grid-template-columns: 1fr;
      }

      .contact-section {
        padding: 2.5rem 1.5rem;
      }

      .contact-buttons {
        flex-direction: column;
        align-items: center;
      }

      .contact-button {
        width: 100%;
        max-width: 300px;
        justify-content: center;
      }

      .nav-back, .theme-toggle {
        position: absolute;
      }

      .nav-back {
        top: 1.5rem;
        left: 1.5rem;
      }

      .theme-toggle {
        top: 1.5rem;
        right: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 2.8rem;
      }

      .page-subtitle {
        font-size: 1.2rem;
      }

      .stat-number {
        font-size: 2.5rem;
      }

      .education-card {
        padding: 2rem 1.5rem;
      }

      .honor-card {
        padding: 2rem 1.5rem;
      }
    }
  `;

  // Timeline visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll('.timeline-item');
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          item.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="about-container" ref={aboutRef}>
        {/* MIND-BLOWING WATERFALL */}
        <div className="waterfall-container">
          <canvas 
            ref={waterfallRef} 
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block'
            }} 
          />
        </div>
        
        <div className="noise-overlay" />
        
        {/* Waterfall Flow Indicator */}
        <div className="waterfall-flow-indicator" style={{ width: `${waterfallFlow * 100}%` }} />

        {/* Navigation */}
        <div className="nav-back">
          <Link to="/" className="back-button">
            ← Back to Home
          </Link>
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle">
          <button className="theme-button" onClick={() => setIsDark(!isDark)}>
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="page-title">About Me</h1>
            <p className="page-subtitle">
              Driven by passion, powered by innovation, and dedicated to creating impactful digital solutions
            </p>
          </motion.div>

          {/* Stats Section */}
          <div className="stats-section" ref={statsRef}>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{animatedStats.projects}+</div>
              <div className="stat-label">Projects</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{animatedStats.skills}</div>
              <div className="stat-label">Skills</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{animatedStats.experience}+</div>
              <div className="stat-label">Years Experience</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{animatedStats.cgpa}</div>
              <div className="stat-label">CGPA</div>
            </motion.div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Left Column - About & Education */}
            <div>
              <motion.div 
                className="about-text"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p>
                  I'm a <span className="highlight">3rd year undergraduate at SLIIT</span> and a proud{" "}
                  <span className="highlight">Royal College Old Boy Union member</span>, driven by a strong passion for
                  web development and creating impactful digital solutions.
                </p>
                <br />
                <p>
                  Currently, I'm building my skills in both frontend and backend technologies while exploring real-world
                  projects that sharpen my problem-solving and technical abilities. I excel at using{" "}
                  <span className="highlight">AI tools effectively</span> and have mastered the art of prompt engineering
                  to build projects efficiently in less time.
                </p>
                <br />
                <p>
                  Beyond academics, I'm deeply interested in <span className="highlight">entrepreneurship</span> and aim
                  to launch my own startup in the near future. I see technology as a powerful way to solve problems and
                  add value to people's lives.
                </p>
              </motion.div>

              {/* Education Card */}
              <motion.div 
                className="education-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="education-icon">🎓</div>
                <h3 className="education-title">Educational Journey</h3>
                <p className="education-subtitle">
                  SLIIT • BSc (Hons) Information Technology • Year 3 • CGPA: 3.37
                </p>
                <p className="about-text">
                  Specializing in Software Engineering with a focus on full-stack development, scalable architectures,
                  and innovative problem-solving approaches.
                </p>
              </motion.div>
            </div>

            {/* Right Column - Skills */}
            <div className="skills-section" ref={skillsRef}>
              <h2 className="section-title">Technical Arsenal</h2>
              <div className="skills-grid">
                {skills.map((category, index) => (
                  <motion.div
                    key={index}
                    className="skill-category"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => setActiveHover(index)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <div className="category-header">
                      <span className="category-icon">{category.icon}</span>
                      <h3 className="category-title">{category.category}</h3>
                    </div>
                    <div className="skill-list">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.span
                          key={skillIndex}
                          className="skill-item"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.1 + skillIndex * 0.05 }}
                          whileHover={{ scale: 1.15 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-section" ref={timelineRef}>
            <h2 className="section-title">My Journey</h2>
            <div className="timeline">
              {timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-year" data-icon={item.icon} data-year={item.year}>
                    {item.year}
                  </div>
                  <motion.div 
                    className="timeline-content"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="timeline-event">{item.event}</h3>
                    <p className="timeline-description">{item.description}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Honors & Awards */}
          <div className="honors-section">
            <h2 className="section-title">Honors & Awards</h2>
            <div className="honors-grid">
              {honors.map((honor, index) => (
                <motion.div
                  key={index}
                  className="honor-card"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div 
                    className="honor-icon"
                    style={{ color: honor.color }}
                  >
                    {honor.icon}
                  </div>
                  <h3 className="honor-title">{honor.title}</h3>
                  <p className="honor-org">{honor.organization}</p>
                  <p className="honor-description">{honor.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <motion.div 
            className="contact-section"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="contact-title">Let's Connect!</h2>
            <p className="contact-text">
              I'm always open to connect with like-minded individuals, mentors, and professionals who share a passion for
              technology, innovation, and building the future together.
            </p>
            <div className="contact-buttons">
              <motion.a 
                href={MAILTO}
                className="contact-button contact-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✉️ Send Email
              </motion.a>
              <motion.a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-button contact-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💼 LinkedIn
              </motion.a>
              <motion.a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-button contact-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💻 GitHub
              </motion.a>
              <motion.a
                href={YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-button contact-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎬 YouTube
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default About;