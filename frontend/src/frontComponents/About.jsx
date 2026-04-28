import React, { useState, useEffect, useRef } from "react";
import { getAbout } from "../api/axios";
import { motion } from "framer-motion";

/* ============================================================
   ORIGINAL VERSION (kept commented)
   ============================================================
import React, { useState, useEffect } from "react";
import { getAbout } from "../api/axios";
import { motion } from 'framer-motion';

export default function UserAbout() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAbout() {
      try {
        const data = await getAbout();
        if (data) setAbout(data);
        else setError("About section not found.");
      } catch (err) {
        setError("Failed to load about section.");
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) return <p>Loading about section...</p>;
  if (error) return <p>{error}</p>;
  if (!about) return null;

  const fadeInVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.section className="abt-sec"  initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      style={{ width: '100%', textAlign: 'center' }}>
      <div className="container">
        <div className="abt-row">
          <motion.div className="abt-lft" initial="hidden" whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} variants={fadeInVariant}>
            {about.services?.map((service, i) => (
              <div key={i} className="exp">
                {service.icon && (<img src={service.icon} alt={service.title} className="icons" />)}
                <b>{service.title}</b>
              </div>
            ))}
          </motion.div>
          <motion.div className="abt-ryt" initial="hidden" whileInView="visible"
            viewport={{ once: false, amount: 0.3 }} variants={fadeInVariant}>
            <h2>{about.heading} <span>me</span></h2>
            <p>{about.description}</p>
            <div className="stats">
              {about.stats && about.stats.length > 0 ? (
                about.stats.map((stat, idx) => (
                  <div key={idx} className="sta-item">
                    <p>{stat.value}<span>{stat.suffix}</span></p>
                    <p className="tit">{stat.label}</p>
                  </div>
                ))
              ) : (<p>No stats available</p>)}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
============================================================ */

/* ===== UPGRADED VERSION — same data, +3D tilt, +animated counter ===== */

// Small reusable counter that counts to a target when scrolled into view
function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const num = parseInt(target, 10);
    if (isNaN(num)) {
      setCount(target);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            let cur = 0;
            const step = Math.max(1, Math.floor(num / 40));
            const t = setInterval(() => {
              cur += step;
              if (cur >= num) {
                cur = num;
                clearInterval(t);
              }
              setCount(cur);
            }, 35);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

// 3D tilt wrapper for service cards
function TiltCard({ children, className }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -10;
    const ry = ((x - rect.width / 2) / rect.width) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

export default function UserAbout() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAbout() {
      try {
        const data = await getAbout();
        if (data) setAbout(data);
        else setError("About section not found.");
      } catch (err) {
        setError("Failed to load about section.");
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  if (loading) return <p>Loading about section...</p>;
  if (error) return <p>{error}</p>;
  if (!about) return null;

  const fadeInVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="abt-sec"
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      style={{ width: "100%", textAlign: "center" }}
    >
      <div className="container">
        <div className="abt-row">
          <motion.div
            className="abt-lft"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInVariant}
          >
            {about.services?.map((service, i) => (
              <TiltCard key={i} className="exp">
                {service.icon && (
                  <img src={service.icon} alt={service.title} className="icons" />
                )}
                <b>{service.title}</b>
              </TiltCard>
            ))}
          </motion.div>

          <motion.div
            className="abt-ryt"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInVariant}
          >
            <h2>
              {about.heading} <span>me</span>
            </h2>
            <p>{about.description}</p>

            <div className="stats">
              {about.stats && about.stats.length > 0 ? (
                about.stats.map((stat, idx) => (
                  <div key={idx} className="sta-item">
                    <p>
                      <CountUp target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="tit">{stat.label}</p>
                  </div>
                ))
              ) : (
                <p>No stats available</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
