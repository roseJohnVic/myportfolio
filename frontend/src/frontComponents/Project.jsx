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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, centerPadding: "20px" },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, centerPadding: "10px" },
      },
    ],
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const zoomIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
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
