import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MAILTO } from "../config/links";

function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-menu-button') && !e.target.closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/about", label: "About", icon: "👨‍💻" },
    { path: "/projects", label: "Projects", icon: "🚀" },
    { path: "/skills", label: "Skills", icon: "⚡" },
    { path: "/certifications", label: "Certifications", icon: "📜" },
  ];

  const styles = `
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 0.6rem 2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      height: 60px;
      display: flex;
      align-items: center;
      ${isScrolled ? `
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      ` : `
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92));
      `}
    }

    .nav-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      font-family: 'Space Grotesk', sans-serif;
    }

    .logo-icon {
      font-size: 1.4rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: gradientFlow 8s ease infinite;
    }

    .logo-text {
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% 200%;
      animation: gradientFlow 8s ease infinite;
    }

    .logo-subtitle {
      font-size: 0.7rem;
      color: #94a3b8;
      font-weight: 500;
      letter-spacing: 1px;
    }

    /* Desktop Navigation */
    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-item {
      position: relative;
      text-decoration: none;
      color: #cbd5e1;
      font-weight: 500;
      font-size: 0.85rem;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .nav-item:hover {
      color: #ffffff;
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .nav-item.active {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.15);
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 1px;
    }

    .nav-icon {
      font-size: 0.9rem;
    }

    .nav-label {
      position: relative;
      z-index: 1;
    }

    /* Mobile Menu Button */
    .mobile-menu-button {
      display: none;
      background: none;
      border: none;
      color: #cbd5e1;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.4rem;
      border-radius: 6px;
      transition: all 0.3s ease;
      z-index: 1001;
    }

    .mobile-menu-button:hover {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }

    /* Mobile Menu */
    .mobile-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      padding: 0.8rem;
      z-index: 999;
    }

    .mobile-menu.open {
      display: block;
      animation: slideDown 0.3s ease;
    }

    .mobile-nav-items {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .mobile-nav-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem;
      text-decoration: none;
      color: #cbd5e1;
      border-radius: 6px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .mobile-nav-item:hover,
    .mobile-nav-item.active {
      color: #ffffff;
      background: rgba(59, 130, 246, 0.2);
      transform: translateX(4px);
    }

    .mobile-nav-item.active {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.15);
    }

    /* Contact Button */
    .contact-button {
      padding: 0.5rem 1.2rem;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      text-decoration: none;
    }

    .contact-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
      background: linear-gradient(135deg, #2563eb, #7c3aed);
    }

    /* Animations */
    @keyframes gradientFlow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .navbar {
        padding: 0.6rem 1rem;
        height: 55px;
      }

      .nav-links,
      .contact-button {
        display: none;
      }

      .mobile-menu-button {
        display: block;
      }

      .logo-text {
        font-size: 1.1rem;
      }

      .logo-subtitle {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .navbar {
        padding: 0.5rem 0.8rem;
        height: 52px;
      }

      .logo-text {
        font-size: 1rem;
      }

      .mobile-menu {
        padding: 0.6rem;
      }

      .mobile-nav-item {
        padding: 0.7rem;
        font-size: 0.85rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="logo-icon">⚡</div>
            <div>
              <div className="logo-text">Imesh Adheesha</div>
              <div className="logo-subtitle">Software Engineer</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${activeTab === item.path ? "active" : ""}`}
                onClick={() => setActiveTab(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
            <a 
              href={MAILTO}
              className="contact-button"
              onClick={() => window.open(MAILTO)}
            >
              📧 Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-nav-items">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${activeTab === item.path ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
            <a 
              href={MAILTO}
              className="mobile-nav-item"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.open(MAILTO);
              }}
            >
              <span className="nav-icon">📧</span>
              <span className="nav-label">Contact</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;