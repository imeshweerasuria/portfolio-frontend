import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { fetchCertifications } from "../services/api";

export default function Certifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [waterfallFlow, setWaterfallFlow] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const waterfallRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetchCertifications();
        if (!ok) return;
        setItems(res.data || []);
      } catch (e) {
        if (!ok) return;
        setErr(e?.message || "Failed to load certifications");
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, []);

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
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    const maxParticles = 100;
    const rippleCenters = [];
    
    class WaterParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.color = `hsla(${200 + Math.random() * 60}, 100%, 70%, ${Math.random() * 0.4 + 0.2})`;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.06 + 0.03;
        this.life = 1;
        this.decay = Math.random() * 0.002 + 0.001;
      }
      
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
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

    .certifications-container {
      min-height: 100vh;
      width: 100vw;
      position: relative;
      overflow-x: hidden;
      font-family: 'Space Grotesk', sans-serif;
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

    /* Main Content */
    .main-content {
      position: relative;
      z-index: 10;
      max-width: 1400px;
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

    /* Stats Bar */
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: clamp(4rem, 6vw, 6rem);
      position: relative;
      z-index: 20;
    }

    .stat-item {
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

    .stat-item:hover {
      transform: translateY(-15px) scale(1.05);
      box-shadow: 
        0 30px 60px rgba(59, 130, 246, 0.4),
        0 0 50px rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.4);
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

    /* Certifications Grid */
    .certifications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2.5rem;
      position: relative;
      z-index: 20;
    }

    @media (max-width: 1200px) {
      .certifications-grid {
        grid-template-columns: 1fr;
        max-width: 700px;
        margin: 0 auto;
      }
    }

    .cert-card {
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.85) 0%,
        rgba(15, 23, 42, 0.95) 100%);
      border-radius: 30px;
      padding: 3rem;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
    }

    .cert-card:hover {
      transform: translateY(-20px) scale(1.03);
      box-shadow: 
        0 40px 80px rgba(0, 0, 0, 0.4),
        0 0 80px rgba(59, 130, 246, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .cert-card::before {
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

    .cert-card:hover::before {
      left: 100%;
    }

    .cert-content {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }

    .cert-icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.25) 0%,
        rgba(37, 99, 235, 0.25) 100%);
      border: 2px solid rgba(59, 130, 246, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      flex-shrink: 0;
      transition: all 0.4s ease;
    }

    .cert-card:hover .cert-icon {
      transform: rotate(15deg) scale(1.1);
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.35) 0%,
        rgba(37, 99, 235, 0.35) 100%);
      box-shadow: 0 15px 40px rgba(59, 130, 246, 0.3);
    }

    .cert-details {
      flex: 1;
    }

    .cert-title {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #f8fafc;
      line-height: 1.2;
    }

    .cert-issuer {
      font-size: 1.2rem;
      color: #3b82f6;
      font-weight: 600;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cert-issuer::before {
      content: '🏢';
      font-size: 1rem;
    }

    .cert-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .meta-tag {
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.2) 0%,
        rgba(37, 99, 235, 0.2) 100%);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #93c5fd;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .meta-tag:hover {
      transform: translateY(-3px);
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.3) 0%,
        rgba(37, 99, 235, 0.3) 100%);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
    }

    .meta-tag.gray {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
    }

    .cert-description {
      font-size: 1.1rem;
      color: #94a3b8;
      line-height: 1.7;
      margin-bottom: 2.5rem;
    }

    .cert-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .action-button {
      padding: 1rem 2rem;
      border-radius: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1rem;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
      border: 2px solid rgba(59, 130, 246, 0.4);
    }

    .action-primary {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
    }

    .action-secondary {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.15) 0%,
        rgba(37, 99, 235, 0.15) 100%);
      color: #3b82f6;
    }

    .action-button:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 
        0 25px 50px rgba(59, 130, 246, 0.5),
        0 0 60px rgba(59, 130, 246, 0.3);
    }

    .action-primary:hover {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
    }

    .action-secondary:hover {
      background: linear-gradient(135deg,
        rgba(59, 130, 246, 0.3) 0%,
        rgba(37, 99, 235, 0.3) 100%);
    }

    .action-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent);
      transition: left 0.6s ease;
    }

    .action-button:hover::before {
      left: 100%;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, 
        rgba(30, 41, 59, 0.8) 0%,
        rgba(15, 23, 42, 0.9) 100%);
      border-radius: 30px;
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 2rem;
      opacity: 0.7;
    }

    .empty-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #f8fafc;
    }

    .empty-text {
      font-size: 1.2rem;
      color: #94a3b8;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Loading State */
    .loading-container {
      text-align: center;
      padding: 4rem;
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

    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        padding: 3rem 1.5rem;
      }

      .page-title {
        font-size: 3rem;
      }

      .page-subtitle {
        font-size: 1.3rem;
      }

      .stats-bar {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .stat-item {
        padding: 2rem 1.5rem;
      }

      .cert-card {
        padding: 2rem;
      }

      .cert-content {
        flex-direction: column;
        gap: 1.5rem;
      }

      .cert-icon {
        width: 70px;
        height: 70px;
        font-size: 2rem;
      }

      .cert-title {
        font-size: 1.5rem;
      }

      .cert-issuer {
        font-size: 1.1rem;
      }

      .waterfall-container {
        width: 100%;
        opacity: 0.4;
      }
    }

    @media (max-width: 480px) {
      .page-title {
        font-size: 2.5rem;
      }

      .cert-card {
        padding: 1.5rem;
      }

      .cert-meta {
        flex-direction: column;
        gap: 0.8rem;
      }

      .meta-tag {
        width: 100%;
        justify-content: center;
      }

      .cert-actions {
        flex-direction: column;
      }

      .action-button {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="certifications-container">
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

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="page-title">Professional Credentials</h1>
            <p className="page-subtitle">
              Official certifications and learning milestones that validate my expertise and dedication to continuous growth in software engineering.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{items.length}</div>
              <div className="stat-label">Total Certifications</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{new Set(items.map(item => item.issuer)).size}</div>
              <div className="stat-label">Different Issuers</div>
            </motion.div>
            <motion.div 
              className="stat-item"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{items.filter(item => item.credentialUrl).length}</div>
              <div className="stat-label">Verified Credentials</div>
            </motion.div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p className="loading-text">Loading professional credentials...</p>
            </div>
          )}

          {/* Error State */}
          {err && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">Unable to Load Credentials</h3>
              <p className="error-text">{err}</p>
            </div>
          )}

          {/* Certifications Grid */}
          {!loading && !err && (
            <div className="certifications-grid" ref={gridRef}>
              {items.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📜</div>
                  <h3 className="empty-title">No Certifications Yet</h3>
                  <p className="empty-text">
                    Professional certifications and credentials will be displayed here as they are added.
                  </p>
                </div>
              ) : (
                items.map((cert, index) => (
                  <motion.div
                    key={`${cert.title}-${index}`}
                    className="cert-card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="cert-content">
                      {/* Icon */}
                      <div className="cert-icon">
                        📜
                      </div>

                      {/* Details */}
                      <div className="cert-details">
                        <h3 className="cert-title">{cert.title}</h3>
                        <p className="cert-issuer">{cert.issuer}</p>

                        {/* Meta Tags */}
                        <div className="cert-meta">
                          {cert.issueDate && (
                            <span className="meta-tag">
                              📅 Issued {cert.issueDate}
                            </span>
                          )}
                          {cert.credentialId && (
                            <span className="meta-tag gray">
                              🆔 ID: {cert.credentialId}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {cert.description && (
                          <p className="cert-description">{cert.description}</p>
                        )}

                        {/* Actions */}
                        <div className="cert-actions">
                          {cert.credentialUrl && (
                            <motion.a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-button action-primary"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              🔗 View Verified Credential
                            </motion.a>
                          )}
                          {!cert.credentialUrl && (
                            <span className="action-button action-secondary">
                              📄 Credential Details
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}