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
        if (data) {
          setAbout(data);
        } else {
          setError("About section not found.");
        }
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
      <motion.section className="abt-sec"  initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      style={{
        width: '100%',
        textAlign: 'center',
      }}>
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
                <div key={i} className="exp">
                  {service.icon && (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="icons"
                    />
                  )}
                  <b>{service.title}</b>
                </div>
              ))}
            </motion.div>
            <motion.div
              className="abt-ryt"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInVariant}
            >
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
