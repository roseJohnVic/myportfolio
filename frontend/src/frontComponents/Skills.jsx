import React, { useState, useEffect, useRef } from "react";
import { getSkills } from "../api/axios";
import { motion } from "framer-motion";

// 3D tilt wrapper
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

export default function UserSkills() {
  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getSkills();
        if (data) setSkillData(data);
        else setError("Skills not found.");
      } catch (err) {
        setError("Failed to load skills.");
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) return <p>Loading skills...</p>;
  if (error) return <p>{error}</p>;
  if (!skillData) return null;

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="skill-sec"
      id="skills"
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
    >
      <div className="container">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeInUp}
        >
          {skillData.heading || "Skills"}
        </motion.h2>

        {skillData.description && (
          <motion.p
            className="skill-desc"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
          >
            {skillData.description}
          </motion.p>
        )}

        <motion.div
          className="skill-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
        >
          {skillData.skillsCnt?.map((skill, i) => (
            <TiltCard key={skill._id || i} className="skill-item">
              {skill.icon && <img src={skill.icon} alt={skill.title} />}
              <strong>{skill.title}</strong>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}