import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import api from "../services/api";

function splitBullets(text) {
  if (!text) return [];
  return text
    .replaceAll("\\n", "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await api.get("/projects");
        if (!mounted) return;
        setProjects(res.data || []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load projects");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...projects].sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
  }, [projects]);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    
    .projects-page {
      padding-top: 90px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
      color: #f8fafc;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
    }

    /* Header - FIXED visibility */
    .page-header {
      margin-bottom: 3rem;
      text-align: center;
      padding: 0 1rem;
    }

    .page-title {
      margin: 0 0 1rem 0;
      font-size: 2.5rem;
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
      opacity: 0.9;
    }

    .projects-counter {
      font-size: 1rem;
      color: #3b82f6;
      font-weight: 600;
      margin-top: 0.5rem;
      display: inline-block;
      background: rgba(59, 130, 246, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 50px;
    }

    /* Loading & Error States */
    .loading-container {
      text-align: center;
      padding: 4rem 1rem;
      color: #94a3b8;
      font-size: 1.1rem;
    }

    .error-container {
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: #fda4af;
      margin: 2rem auto;
      max-width: 600px;
    }

    /* Projects Grid - FIXED layout */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 2rem;
      margin-top: 1rem;
    }

    @media (min-width: 1200px) {
      .projects-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Project Card - Professional Design */
    .project-card {
      background: linear-gradient(145deg, 
        rgba(15, 23, 42, 0.9) 0%,
        rgba(30, 41, 59, 0.8) 100%);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .project-card:hover {
      transform: translateY(-5px);
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(59, 130, 246, 0.15);
    }

    /* Card Top Accent */
    .card-accent {
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .card-content {
      padding: 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Project Header - Clean layout */
    .project-header {
      margin-bottom: 1.5rem;
    }

    .project-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 1rem 0;
      font-family: 'Space Grotesk', sans-serif;
      line-height: 1.3;
    }

    /* Meta Tags - Professional look */
    .project-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .meta-tag {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      border: 1px solid;
      transition: all 0.2s ease;
    }

    .meta-tag.category {
      background: rgba(59, 130, 246, 0.12);
      border-color: rgba(59, 130, 246, 0.25);
      color: #93c5fd;
    }

    .meta-tag.status {
      background: rgba(16, 185, 129, 0.12);
      border-color: rgba(16, 185, 129, 0.25);
      color: #6ee7b7;
    }

    .meta-tag.period {
      background: rgba(139, 92, 246, 0.12);
      border-color: rgba(139, 92, 246, 0.25);
      color: #c4b5fd;
    }

    /* Project Description */
    .project-description {
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
      opacity: 0.9;
    }

    /* Tech Stack - Clean box */
    .tech-stack {
      margin: 1.5rem 0;
      padding: 1.25rem;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 12px;
      border-left: 3px solid #3b82f6;
    }

    .tech-stack-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tech-stack-content {
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.6;
      font-family: 'Inter', monospace;
    }

    /* Highlights Section */
    .project-highlights {
      margin: 1.5rem 0;
    }

    .highlights-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .bullets-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .bullet-icon {
      color: #3b82f6;
      flex-shrink: 0;
      margin-top: 0.2rem;
      font-weight: bold;
    }

    /* Show More/Less Button */
    .show-more {
      margin-top: 12px;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.25);
      color: #93c5fd;
      padding: 8px 12px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
      width: 100%;
    }
    
    .show-more:hover {
      background: rgba(59, 130, 246, 0.18);
      transform: translateY(-1px);
    }

    /* Action Buttons - FIXED visibility and spacing */
    .project-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.9rem 1.75rem;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 120px;
      border: none;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
    }

    .action-button.github {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
    }

    .action-button.github:hover {
      transform: translateY(-2px);
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
    }

    .action-button.demo {
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .action-button.demo:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      color: #ffffff;
      transform: translateY(-2px);
    }

    /* No Projects State */
    .no-projects {
      text-align: center;
      padding: 4rem 1rem;
      color: #94a3b8;
      font-size: 1.1rem;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .projects-grid {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .projects-page {
        padding: 2rem 1.5rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .page-subtitle {
        font-size: 1rem;
      }

      .projects-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .card-content {
        padding: 1.75rem;
      }

      .project-actions {
        flex-direction: column;
        gap: 0.75rem;
      }

      .action-button {
        width: 100%;
        justify-content: center;
      }
      
      .show-more {
        padding: 10px 14px;
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .projects-page {
        padding: 1.5rem 1rem;
      }

      .page-title {
        font-size: 1.75rem;
      }

      .card-content {
        padding: 1.5rem;
      }

      .project-title {
        font-size: 1.3rem;
      }

      .project-meta {
        gap: 0.5rem;
      }

      .meta-tag {
        font-size: 0.75rem;
        padding: 0.4rem 0.8rem;
      }
    }
  `;

  const getStatusTag = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('completed')) return 'status';
    if (statusLower.includes('ongoing')) return 'status';
    if (statusLower.includes('planned') || statusLower.includes('building')) return 'status';
    return 'status';
  };

  return (
    <>
      <style>{styles}</style>

      <div className="projects-page">
        {/* Header - FIXED: Now clearly visible */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">Projects Portfolio</h1>
          <p className="page-subtitle">
            Enterprise-grade solutions showcasing technical expertise and modern development practices
          </p>
          {!loading && !err && (
            <div className="projects-counter">
              {sorted.length} Featured Projects
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading portfolio projects...
          </motion.div>
        )}

        {/* Error State */}
        {err && (
          <motion.div 
            className="error-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {err}
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !err && (
          <>
            {sorted.length === 0 ? (
              <div className="no-projects">
                No projects available
              </div>
            ) : (
              <div className="projects-grid">
                {sorted.map((project, index) => {
                  const bullets = splitBullets(project.highlights);
                  const isExpanded = expanded[project.id || index];
                  const showBullets = isExpanded ? bullets : bullets.slice(0, 4);

                  return (
                    <motion.div
                      key={project.id || `${project.title}-${index}`}
                      className="project-card"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="card-accent"></div>
                      <div className="card-content">
                        {/* Project Header */}
                        <div className="project-header">
                          <h3 className="project-title">{project.title}</h3>
                          
                          <div className="project-meta">
                            {project.category && (
                              <span className="meta-tag category">{project.category}</span>
                            )}
                            {project.status && (
                              <span className={`meta-tag ${getStatusTag(project.status)}`}>
                                {project.status}
                              </span>
                            )}
                            {project.period && (
                              <span className="meta-tag period">{project.period}</span>
                            )}
                          </div>
                        </div>

                        {/* Project Description */}
                        <p className="project-description">{project.description}</p>

                        {/* Tech Stack */}
                        {project.techStack && (
                          <div className="tech-stack">
                            <div className="tech-stack-label">Technology Stack</div>
                            <div className="tech-stack-content">{project.techStack}</div>
                          </div>
                        )}

                        {/* Key Highlights with Show More/Less */}
                        {bullets.length > 0 && (
                          <div className="project-highlights">
                            <div className="highlights-label">Key Highlights</div>
                            <ul className="bullets-list">
                              {showBullets.map((bullet, i) => (
                                <li key={i} className="bullet-item">
                                  <span className="bullet-icon">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                            
                            {bullets.length > 4 && (
                              <button
                                className="show-more"
                                onClick={() =>
                                  setExpanded((prev) => ({ 
                                    ...prev, 
                                    [project.id || index]: !prev[project.id || index] 
                                  }))
                                }
                              >
                                {isExpanded 
                                  ? "Show less" 
                                  : `Show ${bullets.length - 4} more`
                                }
                              </button>
                            )}
                          </div>
                        )}

                        {/* Action Buttons - FIXED: Now fully visible with proper spacing */}
                        <div className="project-actions">
                          {project.githubLink && (
                            <motion.a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-button github"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>GitHub</span>
                            </motion.a>
                          )}
                          {project.liveLink && (
                            <motion.a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-button demo"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Live Demo</span>
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Projects;