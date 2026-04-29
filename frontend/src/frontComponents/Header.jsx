import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ logo, links }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuContentRef = useRef(null);
  const hamburgerRef = useRef(null);

  const currentPageClass = `page-${
    location.pathname === "/" ? "home" : location.pathname.substring(1)
  }`;

  // Code symbols for floating bubbles
  const codeSymbols = [
    "</>", "{}", "()", "[]", "=>",
    "&&", "||", "==", "!=", "++",
    "<div>", "</div>", "fn()", "let", "const",
     "</>", "{}", "()", "=>",
    "||", "++", "[]", "fn()", "&&"
  ];

  useEffect(() => {
    if (location.pathname !== "/") return;
    const getSectionId = (h) => h?.match(/#([\w-]+)/)?.[1];
    const sectionIds = links.map((l) => getSectionId(l.href)).filter(Boolean);
    if (!sectionIds.length) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      }
      setActiveSection(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, links]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (hamburgerRef.current?.contains(e.target)) return;
      if (menuContentRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEsc = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [menuOpen]);

  const handleNavClick = (e, href) => {
    const match = href?.match(/#([\w-]+)/);
    if (match) {
      e.preventDefault();
      const el = document.getElementById(match[1]);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
        setActiveSection(match[1]);
      }
      setMenuOpen(false);
    }
  };

  // Circle expands from top-right corner
  const circleVariants = {
    hidden: { clipPath: "circle(0% at calc(100% - 40px) 40px)" },
    visible: {
      clipPath: "circle(150% at calc(100% - 40px) 40px)",
      transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] },
    },
    exit: {
      clipPath: "circle(0% at calc(100% - 40px) 40px)",
      transition: { duration: 0.6, ease: [0.77, 0, 0.175, 1], delay: 0.15 },
    },
  };

  const menuListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.4, staggerChildren: 0.08 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const menuItemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      className={currentPageClass}
    >
      <header>
        <div className="container">
          <div className="hd-row">
            <Link to="/" className="logo">{logo}</Link>
            <div className="hd-ryt">
              <nav className="navBar">
                {links.map((link, i) => {
                  const sectionId = link.href?.match(/#([\w-]+)/)?.[1];
                  const isActive = location.pathname === "/" && sectionId === activeSection;
                  return (
                    <a key={i} href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={isActive ? "active_" : ""}>
                      {link.label}
                      {isActive && (
                        <motion.span layoutId="navIndicator" className="nav-underline"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                      )}
                    </a>
                  );
                })}
              </nav>
              <a href="/resume.pdf" target="_blank" className="vw-btn port-btn" rel="noopener noreferrer">
                View Resume
              </a>
              <button
                ref={hamburgerRef}
                className={`hamburger ${menuOpen ? "is-open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== CIRCULAR REVEAL MENU ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="circle-menu-bg"
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* ===== FLOATING CODE BUBBLES ===== */}
            <div className="code-bubbles" aria-hidden="true">
              {codeSymbols.map((symbol, i) => (
                <span
                  key={i}
                  className="code-bubble"
                  style={{
                    left: `${Math.random() * 95}%`,
                    top: `${Math.random() * 95}%`,
                    animationDelay: `${Math.random() * 8}s`,
                    animationDuration: `${12 + Math.random() * 12}s`,
                    fontSize: `${10 + Math.random() * 14}px`,
                    opacity: 0.15 + Math.random() * 0.35,
                  }}
                >
                  {symbol}
                </span>
              ))}
            </div>

            <motion.div
              ref={menuContentRef}
              className="circle-menu-content"
              variants={menuListVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close button */}
              <motion.button
                className="menu-close-btn"
                onClick={() => setMenuOpen(false)}
                variants={menuItemVariants}
                aria-label="Close menu"
              >
                ✕
              </motion.button>

              <motion.div className="circle-logo" variants={menuItemVariants}>
                {logo}
              </motion.div>

              <ul className="circle-menu-list">
                {links.map((link, i) => {
                  const sectionId = link.href?.match(/#([\w-]+)/)?.[1];
                  const isActive = location.pathname === "/" && sectionId === activeSection;
                  return (
                    <motion.li key={i} variants={menuItemVariants} className={isActive ? "active_" : ""}>
                      <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                        <span className="num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="label">{link.label}</span>
                        <span className="arrow">→</span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.a
                href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                className="circle-resume" variants={menuItemVariants}
                onClick={() => setMenuOpen(false)}
              >
                View Resume <span className="arrow">↗</span>
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}