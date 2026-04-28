import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header({ logo, links }) {
  const location = useLocation();

  // Create a class name based on the current route
  // For example, for "/about" it'll be "page-about", for "/" it'll be "page-home"
  // You can customize this logic to suit your needs
  const currentPageClass = `page-${location.pathname === "/" ? "home" : location.pathname.substring(1)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      className={currentPageClass} // Add dynamic class here
    >
      <header>
        <div className="hd-row">
          <Link to="/" className="logo">
            {logo}
          </Link>

          <div className="hd-ryt">
            <nav className="navBar">
              {links.map((link, i) => (
                <NavLink
                  key={i}
                  to={link.href}
                  className={({ isActive }) => (isActive ? "active_" : "")}
                >
                  {link.label}
                </NavLink>
              ))}
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
