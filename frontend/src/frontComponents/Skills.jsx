import React, { useState, useEffect } from "react";
import { getSkills } from "../api/axios";
import { motion } from "framer-motion";

export default function UserSkills() {
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getSkills();
        if (data) {
          setSkillsData(data);
        } else {
          setError("Skills not found.");
        }
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
  if (!skillsData) return null;

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

const cardVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: -2,
    transition: {
      delay: i * 0.1,
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  }),
};

  return (
      <motion.section className="skills-sec"   initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      style={{
        width: "100%",
        textAlign: "center",
      }}>
        <div className="container">

          <motion.div
            className="skill-hd"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={fadeInVariants}
          >
            <h1>{skillsData.heading}</h1>
            <p>{skillsData.description}</p>
          </motion.div>


          <div className="skills-all">
            {skillsData.skillsCnt?.map((skill, i) => (
              <motion.div
                key={i}
                className="skill-item"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.5, once: false }}
                variants={cardVariants}
              >
                {skill.icon && (
                  <span className="skill-img">
                    <img src={skill.icon} alt={skill.title} />
                    <p className="range-skill">{skill.range}</p>
                  </span>
                )}
                <b>{skill.title}</b>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
  );
}
