import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header({ logo, links }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  const currentPageClass = `page-${
    location.pathname === "/" ? "home" : location.pathname.substring(1)
  }`;

  // ===== SCROLL SPY LOGIC =====
  useEffect(() => {
    // Only run scroll-spy on the home page
    if (location.pathname !== "/") return;

    // Map nav link hrefs to section IDs
    // links come as [{ href: "/#home", label: "Home" }, ...] or similar
    // We extract the section ID from the href
    const getSectionId = (href) => {
      if (!href) return null;
      // Handle hrefs like "/#home", "#home", "/home"
      const match = href.match(/#([\w-]+)/);
      return match ? match[1] : null;
    };

    const sectionIds = links
      .map((l) => getSectionId(l.href))
      .filter(Boolean);

    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200; // offset for navbar height

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, links]);

  // Smooth scroll click handler
  const handleNavClick = (e, href) => {
    const match = href?.match(/#([\w-]+)/);
    if (match) {
      e.preventDefault();
      const el = document.getElementById(match[1]);
      if (el) {
        const navHeight = 100;
        window.scrollTo({
          top: el.offsetTop - navHeight,
          behavior: "smooth",
        });
        setActiveSection(match[1]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      className={currentPageClass}
    >
      <header>
        <div className="hd-row">
          <Link to="/" className="logo">
            {logo}
          </Link>

          <div className="hd-ryt">
            <nav className="navBar">
              {links.map((link, i) => {
                const sectionId = link.href?.match(/#([\w-]+)/)?.[1];
                const isActive =
                  location.pathname === "/" && sectionId === activeSection;

                return (
                  <a
                    key={i}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={isActive ? "active_" : ""}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <a
              href="/resume.pdf"
              target="_blank"
              className="vw-btn port-btn"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>
        </div>
      </header>
    </motion.div>
  );
}