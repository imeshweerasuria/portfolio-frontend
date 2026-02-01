import { Link } from "react-router-dom";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { motion } from "motion/react";
import { MAILTO, LINKEDIN, GITHUB } from "../config/links";

// Move Hero3D lazy import outside the component to prevent remounting
const Hero3D = lazy(() => import("../components/Hero3D"));

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageFit, setImageFit] = useState('contain');

  const [waterfallFlow, setWaterfallFlow] = useState(0);
  
  // Waterfall animation control
  const canvasRef = useRef(null);
  
  // Mouse tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
      
      // Update waterfall flow based on scroll
      const scrollPercent = Math.min(currentScroll / 300, 1);
      setWaterfallFlow(scrollPercent);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Canvas for MIND-BLOWING WATERFALL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    // Waterfall particles with enhanced physics
    const particles = [];
    const maxParticles = 150;
    const rippleCenters = [];
    
    class WaterParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.speedY = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.color = `hsla(${200 + Math.random() * 60}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.08 + 0.03;
        this.life = 1;
        this.decay = Math.random() * 0.002 + 0.001;
        this.trail = [];
        this.maxTrail = 5;
      }
      
      update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrail) this.trail.shift();
        
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.5;
        this.wobble += this.wobbleSpeed;
        this.life -= this.decay;
        
        // Splash effect at bottom
        if (this.y > canvas.height - 50) {
          rippleCenters.push({x: this.x, y: canvas.height, life: 1});
          this.y = Math.random() * -100;
          this.x = Math.random() * canvas.width;
        }
        
        // Respawn at top if dead
        if (this.y < -50) {
          this.y = Math.random() * -100;
          this.x = Math.random() * canvas.width;
          this.life = 1;
        }
      }
      
      draw() {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const alpha = (i / this.trail.length) * this.life * 0.5;
          ctx.beginPath();
          ctx.arc(point.x, point.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(200, 100%, 70%, ${alpha})`;
          ctx.fill();
        }
        
        // Main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(200, 100%, 90%, ${this.life * 0.8})`);
        gradient.addColorStop(1, `hsla(200, 100%, 60%, ${this.life * 0.3})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
    
    // Ripple effect at bottom
    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 50;
        this.life = 1;
        this.speed = 2;
      }
      
      update() {
        this.radius += this.speed;
        this.life -= 0.02;
      }
      
      draw() {
        if (this.life <= 0) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(200, 100%, 70%, ${this.life * 0.3})`;
        ctx.lineWidth = 2;
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
      
      // Draw waterfall base with depth
      const waterfallGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      waterfallGradient.addColorStop(0, 'hsla(210, 100%, 60%, 0.15)');
      waterfallGradient.addColorStop(0.5, 'hsla(210, 100%, 60%, 0.08)');
      waterfallGradient.addColorStop(1, 'hsla(210, 100%, 60%, 0.02)');
      ctx.fillStyle = waterfallGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw main waterfall stream
      ctx.beginPath();
      const waveOffset = Math.sin(Date.now() * 0.001) * 10;
      ctx.moveTo(canvas.width * 0.3 + waveOffset, 0);
      ctx.bezierCurveTo(
        canvas.width * 0.35, canvas.height * 0.3,
        canvas.width * 0.45, canvas.height * 0.6,
        canvas.width * 0.4, canvas.height
      );
      ctx.strokeStyle = 'hsla(210, 100%, 70%, 0.4)';
      ctx.lineWidth = 15;
      ctx.stroke();
      
      // Draw secondary streams
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const offset = (Math.sin(Date.now() * 0.001 + i) * 15);
        const streamWidth = 5 + Math.sin(Date.now() * 0.002 + i) * 2;
        ctx.moveTo(canvas.width * (0.4 + i * 0.1) + offset, 0);
        ctx.lineTo(canvas.width * (0.35 + i * 0.15) + offset * 0.5, canvas.height);
        ctx.strokeStyle = `hsla(210, 100%, 70%, ${0.2 + waterfallFlow * 0.3})`;
        ctx.lineWidth = streamWidth;
        ctx.stroke();
      }
      
      // Create new ripples from particles hitting bottom
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
      
      // Draw mist/glow effect at bottom
      const mistGradient = ctx.createRadialGradient(
        canvas.width * 0.4, canvas.height,
        0,
        canvas.width * 0.4, canvas.height,
        200
      );
      mistGradient.addColorStop(0, 'hsla(210, 100%, 70%, 0.1)');
      mistGradient.addColorStop(1, 'hsla(210, 100%, 70%, 0)');
      ctx.fillStyle = mistGradient;
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
      
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

  const techStack = ["Spring Boot", "React.js", "PostgreSQL", "Node.js", "Java", "TypeScript"];
  
  const summaryLines = [
    "Software engineering undergraduate with strong Full Stack Development focus.",
    "Experienced in building REST APIs using Spring Boot, PostgreSQL,",
    "and integrating them with React-based frontends."
  ];
  
  const summaryPoints = [
    "Interested in Fullstack systems, clean architecture, and scalable design",
    "Current CGPA: 3.37 at SLIIT, specializing in Software Engineering",
    "Building practical solutions with modern tech stack"
  ];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
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
    
    .home-container {
      min-height: 100vh;
      width: 100vw;
      position: relative;
      overflow-x: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a0a0f 0%, #0f172a 30%, #1e1b4b 100%);
      color: #f8fafc;
      padding-top: 60px;
    }
    
    /* MIND-BLOWING WATERFALL */
    .waterfall-container {
      position: fixed;
      top: 0;
      right: 0;
      width: 40%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.8;
      filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5));
    }
    
    .noise-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.01;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      z-index: 1;
    }
    
    .scroll-progress {
      position: fixed;
      top: 60px;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
      z-index: 999;
      transition: width 0.3s ease;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
    
    .main-content {
      position: relative;
      z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem);
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: clamp(2rem, 4vw, 4rem);
      align-items: start;
      min-height: calc(100vh - 60px);
    }
    
    .left-column {
      position: relative;
      z-index: 20;
    }
    
    .right-column {
      position: relative;
      z-index: 20;
      display: flex;
      flex-direction: column;
      gap: clamp(2rem, 3vw, 3rem);
      margin-top: 1rem;
    }
    
    /* Name Section - Professional */
    .name-section {
      position: relative;
      margin-bottom: clamp(1.5rem, 3vw, 2rem);
      padding: 2rem;
      background: linear-gradient(to bottom, 
        rgba(59, 130, 246, 0.1) 0%,
        rgba(139, 92, 246, 0.05) 50%,
        transparent 100%);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transform-style: preserve-3d;
    }
    
    .name-subtitle {
      font-size: clamp(0.875rem, 1.2vw, 1rem);
      font-weight: 500;
      color: #94a3b8;
      margin-bottom: 0.5rem;
      font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
      letter-spacing: 2px;
      text-transform: uppercase;
      position: relative;
      z-index: 2;
    }
    
    .name-main {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
      margin-bottom: 0.5rem;
      line-height: 1.1;
    }
    
    .name-role {
      font-size: clamp(1rem, 1.5vw, 1.2rem);
      color: #94a3b8;
      font-weight: 400;
      font-family: 'Inter', sans-serif;
    }
    
    /* Technical Summary - Cleaner */
    .technical-summary {
      font-size: clamp(1rem, 1.2vw, 1.1rem);
      line-height: 1.7;
      color: #cbd5e1;
      margin-bottom: clamp(2rem, 3vw, 2.5rem);
      padding: 2rem;
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.7) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    
    .summary-line {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 400;
      position: relative;
      overflow: hidden;
    }
    
    .summary-points {
      margin-top: clamp(1rem, 1.5vw, 1.2rem);
      display: flex;
      flex-direction: column;
      gap: clamp(0.6rem, 1vw, 0.8rem);
    }
    
    .summary-point {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      color: #e2e8f0;
      font-size: clamp(0.9rem, 1vw, 0.95rem);
      padding: 0.8rem 1.2rem;
      background: rgba(59, 130, 246, 0.05);
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .summary-point:hover {
      background: rgba(59, 130, 246, 0.15);
      transform: translateX(10px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
    }
    
    .point-icon {
      color: #3b82f6;
      flex-shrink: 0;
      margin-top: 0.2rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.2rem;
    }
    
    /* Action Buttons - Professional */
    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: clamp(0.8rem, 1.5vw, 1rem);
      margin: clamp(2rem, 3vw, 2.5rem) 0 clamp(1.5rem, 2.5vw, 2rem) 0;
    }
    
    .action-button {
      padding: clamp(0.9rem, 1.2vw, 1rem) clamp(1.8rem, 2.5vw, 2.2rem);
      border-radius: 12px;
      font-weight: 600;
      font-size: clamp(0.9rem, 1.1vw, 1rem);
      text-decoration: none;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      min-width: 160px;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }
    
    .action-primary {
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.9) 0%,
        rgba(37, 99, 235, 0.9) 100%);
      color: white;
      border: 2px solid rgba(59, 130, 246, 0.5);
      box-shadow: 
        0 8px 20px rgba(59, 130, 246, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    .action-secondary {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.15) 0%,
        rgba(37, 99, 235, 0.15) 100%);
      color: #3b82f6;
      border: 2px solid rgba(59, 130, 246, 0.3);
    }
    
    .action-button:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 12px 30px rgba(59, 130, 246, 0.4);
    }
    
    .action-primary:hover {
      background: linear-gradient(135deg, 
        rgba(37, 99, 235, 0.95) 0%,
        rgba(29, 78, 216, 0.95) 100%);
    }
    
    .action-secondary:hover {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.25) 0%,
        rgba(37, 99, 235, 0.25) 100%);
    }
    
    /* Education Section */
    .education-section {
      margin: clamp(1.5rem, 2vw, 2rem) 0;
      position: relative;
    }
    
    .education-title {
      font-size: clamp(0.85rem, 1vw, 0.9rem);
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: clamp(0.8rem, 1vw, 1rem);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .education-badges {
      display: flex;
      flex-wrap: wrap;
      gap: clamp(0.8rem, 1.2vw, 1rem);
    }
    
    .education-badge {
      padding: clamp(0.7rem, 1vw, 0.8rem) clamp(1rem, 1.5vw, 1.2rem);
      border-radius: 12px;
      font-weight: 600;
      font-size: clamp(0.8rem, 0.9vw, 0.85rem);
      transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      backdrop-filter: blur(10px);
    }
    
    .badge-royal {
      background: linear-gradient(135deg, 
        rgba(185, 28, 28, 0.2) 0%,
        rgba(185, 28, 28, 0.3) 100%);
      color: #fca5a5;
      border: 1px solid rgba(185, 28, 28, 0.4);
    }
    
    .badge-sliit {
      background: linear-gradient(135deg, 
        rgba(124, 58, 237, 0.2) 0%,
        rgba(124, 58, 237, 0.3) 100%);
      color: #c4b5fd;
      border: 1px solid rgba(124, 58, 237, 0.4);
    }
    
    .education-badge:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    
    /* Tech Stack */
    .tech-stack {
      margin: clamp(1.5rem, 2vw, 2rem) 0;
    }
    
    .tech-stack-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .tech-item {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      padding: 1.2rem 0.5rem;
      border-radius: 12px;
      font-size: clamp(0.85rem, 1vw, 0.9rem);
      color: #cbd5e1;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-family: 'Space Grotesk', sans-serif;
      transition: all 0.3s ease;
      cursor: pointer;
      backdrop-filter: blur(10px);
    }
    
    .tech-item:hover {
      transform: translateY(-5px);
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.25) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      box-shadow: 
        0 15px 30px rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
    }
    
    /* 3D Accent - right column */
    .hero3d-wrap {
      width: 100%;
      max-width: 450px;
      height: 220px;
      border-radius: 20px;
      overflow: hidden;
      margin: 0 auto;
      position: relative;
      border: 2px solid rgba(59, 130, 246, 0.25);
      background: radial-gradient(circle at 30% 30%,
        rgba(59, 130, 246, 0.18),
        rgba(15, 23, 42, 0.92) 70%);
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 40px rgba(59, 130, 246, 0.15);
    }
    
    .hero3d-wrap canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
    
    .hero3d-skeleton {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        rgba(255,255,255,0.04),
        rgba(255,255,255,0.08),
        rgba(255,255,255,0.04));
      animation: shimmer 1.4s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-20%); }
      100% { transform: translateX(20%); }
    }
    
    .hero3d-caption {
      position: absolute;
      bottom: 10px;
      left: 12px;
      font-size: 0.78rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: rgba(226, 232, 240, 0.75);
      background: rgba(15, 23, 42, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.10);
      padding: 6px 10px;
      border-radius: 999px;
      backdrop-filter: blur(12px);
    }
    
    /* SINGLE Profile Image Container */
    .profile-main-container {
      position: relative;
      width: 100%;
      max-width: 450px;
      height: clamp(350px, 45vh, 450px);
      border-radius: 20px;
      overflow: hidden;
      margin: 0 auto;
      border: 2px solid rgba(59, 130, 246, 0.4);
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      box-shadow: 
        0 30px 60px rgba(0, 0, 0, 0.3),
        0 0 40px rgba(59, 130, 246, 0.2);
      backdrop-filter: blur(20px);
    }
    
    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: all 0.3s ease;
    }
    
    .profile-image.cover-fit {
      object-fit: cover;
      object-position: center 30%;
    }
    
    .image-fit-toggle {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 3;
      background: linear-gradient(135deg,
        rgba(15, 23, 42, 0.9) 0%,
        rgba(30, 41, 59, 0.9) 100%);
      border: 1px solid rgba(59, 130, 246, 0.5);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 0.8rem;
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .image-fit-toggle:hover {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.3) 0%,
        rgba(37, 99, 235, 0.3) 100%);
      border-color: #3b82f6;
      transform: scale(1.05);
    }
    
    .profile-image-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
      background: linear-gradient(transparent, rgba(15, 23, 42, 0.95));
      padding: 12px;
      backdrop-filter: blur(20px);
      z-index: 2;
      font-family: 'Inter', sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    /* Social Links */
    .social-links {
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      z-index: 100;
    }
    
    .social-link {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.9) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
    }
    
    .social-link:hover {
      transform: translateY(-5px) scale(1.1);
      color: #3b82f6;
      border-color: #3b82f6;
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.15) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      box-shadow: 
        0 20px 40px rgba(59, 130, 246, 0.25);
    }
    
    .social-tooltip {
      position: absolute;
      left: 70px;
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.95) 0%,
        rgba(15, 23, 42, 0.98) 100%);
      color: #e2e8f0;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.3s ease;
      pointer-events: none;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    
    .social-link:hover .social-tooltip {
      opacity: 1;
      transform: translateX(0);
    }
    
    /* Responsive */
    @media (max-width: 1100px) {
      .main-content {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      
      .right-column {
        order: -1;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .waterfall-container {
        width: 100%;
        opacity: 0.4;
      }
      
      .tech-stack-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .main-content {
        padding: 2rem 1.5rem;
      }
      
      .name-main {
        font-size: 2.5rem;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-button {
        width: 100%;
        justify-content: center;
      }
      
      .tech-stack-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .social-links {
        flex-direction: row;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        gap: 1.5rem;
      }
      
      .social-link {
        width: 45px;
        height: 45px;
      }
    }
    
    @media (max-width: 480px) {
      .home-container {
        padding-top: 60px;
      }
      
      .main-content {
        padding: 1.5rem 1rem;
      }
      
      .name-main {
        font-size: 2rem;
      }
      
      .technical-summary {
        font-size: 1rem;
        padding: 1.5rem;
      }
      
      .profile-main-container {
        height: 280px;
      }
      
      .hero3d-wrap {
        height: 180px;
      }
      
      .education-badges {
        flex-direction: column;
      }
      
      .tech-stack-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="home-container">
        {/* MIND-BLOWING WATERFALL ON RIGHT SIDE */}
        <div className="waterfall-container">
          <canvas 
            ref={canvasRef} 
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block'
            }} 
          />
        </div>
        
        {/* Noise Overlay */}
        <div className="noise-overlay" />
        
        {/* Progress Bar */}
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
        
        {/* Main Content */}
        <div className="main-content">
          {/* Left Column - Text Content */}
          <div className="left-column">
            {/* Professional Name Section */}
            <motion.div 
              className="name-section"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                type: "spring",
                stiffness: 50,
                damping: 15 
              }}
            >
              <div className="name-subtitle">Software Engineering Undergraduate</div>
              <div className="name-main">Imesh Adheesha</div>
              <div className="name-role">FullStack-Focused Developer</div>
            </motion.div>
            
            {/* Technical Summary */}
            <motion.div 
              className="technical-summary"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {summaryLines.map((line, index) => (
                <motion.span
                  key={index}
                  className="summary-line"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + index * 0.2,
                    ease: "easeOut"
                  }}
                >
                  {line}
                </motion.span>
              ))}
              
              <div className="summary-points">
                {summaryPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    className="summary-point"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 1.1 + index * 0.15,
                      ease: "easeOut"
                    }}
                  >
                    <span className="point-icon">→</span>
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Action Buttons */}
            <div className="action-buttons">
              <motion.a
                href="/projects"
                className="action-button action-primary"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, type: "spring" }}
                whileHover={{ scale: 1.03 }}
              >
                <span>View Projects</span>
                <span>→</span>
              </motion.a>
              <motion.a
                href="/skills"
                className="action-button action-secondary"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, type: "spring" }}
                whileHover={{ scale: 1.03 }}
              >
                <span>Technical Skills</span>
                <span>⚡</span>
              </motion.a>
              <motion.a
                href={MAILTO}
                className="action-button action-secondary"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, type: "spring" }}
                whileHover={{ scale: 1.03 }}
              >
                <span>Contact Me</span>
                <span>📧</span>
              </motion.a>
            </div>
            
            {/* Education Section */}
            <div className="education-section">
              <div className="education-title">Academic Background</div>
              <div className="education-badges">
                <motion.div
                  className="education-badge badge-royal"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Royal College Colombo Alumni
                </motion.div>
                <motion.div
                  className="education-badge badge-sliit"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  SLIIT • BSc (Hons) IT • Year 3
                </motion.div>
              </div>
            </div>
            
            {/* Tech Stack */}
            <div className="tech-stack">
              <div className="education-title">Current Tech Stack</div>
              <div className="tech-stack-grid">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    className="tech-item"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 2 + index * 0.1,
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - 3D Component and Profile Image */}
          <div className="right-column">
            {/* 3D Accent (lazy loaded) */}
            <div className="hero3d-wrap" aria-hidden="true">
              <Suspense fallback={<div className="hero3d-skeleton" />}>
                <Hero3D />
              </Suspense>
              <div className="hero3d-caption">Interactive 3D Accent</div>
            </div>

            {/* Main Profile Image with Floating Effect */}
            <motion.div 
              className="profile-main-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.2,
                type: "spring",
                stiffness: 50,
                damping: 15 
              }}
              whileHover={{ scale: 1.01 }}
            >
              <img 
                src="/images/profile-main.jpeg" 
                alt="Imesh Adheesha - Professional Portrait" 
                className={`profile-image ${imageFit === 'cover' ? 'cover-fit' : ''}`}
              />
              <button 
                className="image-fit-toggle"
                onClick={() => setImageFit(imageFit === 'contain' ? 'cover' : 'contain')}
                title={imageFit === 'contain' ? 'Fill container' : 'Show full image'}
              >
                {imageFit === 'contain' ? '🔄 Fill' : '📐 Fit'}
              </button>
              <div className="profile-image-label">Professional Portrait</div>
            </motion.div>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="social-links">
          <motion.a 
            href={GITHUB}
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.3 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <div className="social-tooltip">GitHub</div>
          </motion.a>
          <motion.a 
            href={LINKEDIN}
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <div className="social-tooltip">LinkedIn</div>
          </motion.a>
          <motion.a 
            href={MAILTO}
            className="social-link"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
            </svg>
            <div className="social-tooltip">Email</div>
          </motion.a>
        </div>
      </div>
    </>
  );
}

export default Home;