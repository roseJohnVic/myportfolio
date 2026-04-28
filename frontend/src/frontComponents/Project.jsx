import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { getProject } from "../api/axios";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ============================================================
   ORIGINAL VERSION (kept commented)
   ============================================================
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { getProject } from "../api/axios";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function UserProjects() {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProject();
        if (data) setProjectData(data);
        else setError("Projects not found.");
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;
  if (!projectData) return null;

  const settings = {
    dots: true, infinite: true, speed: 500, slidesToShow: 3, slidesToScroll: 1,
    arrows: true, centerMode: true, centerPadding: "40px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "20px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "10px" } },
    ],
  };

  const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const zoomIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } } };

  return (
    <section className="project-sec">
      <div className="container">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeInUp}>
          {projectData.heading}
        </motion.h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.4 }} variants={zoomIn}>
          <Slider {...settings} className="proj-slider">
            {projectData.projects?.map((proj, idx) => (
              <div className="project-item" key={idx}>
                <img src={proj.image} alt={proj.title} />
                <strong>{proj.title}</strong>
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </section>
  );
}
============================================================ */

/* ===== UPGRADED VERSION — same data + slider, +3D tilt on cards ===== */

function TiltProjectItem({ proj }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -8;
    const ry = ((x - rect.width / 2) / rect.width) * 8;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  };
  return (
    <div className="project-item" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <img src={proj.image} alt={proj.title} />
      <strong>{proj.title}</strong>
    </div>
  );
}

export default function UserProjects() {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProject();
        if (data) setProjectData(data);
        else setError("Projects not found.");
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;
  if (!projectData) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "20px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "10px" } },
    ],
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const zoomIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="project-sec">
      <div className="container">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeInUp}
        >
          {projectData.heading}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          variants={zoomIn}
        >
          <Slider {...settings} className="proj-slider">
            {projectData.projects?.map((proj, idx) => (
              <TiltProjectItem proj={proj} key={idx} />
            ))}
          </Slider>
        </motion.div>
      </div>
    </section>
  );
}
