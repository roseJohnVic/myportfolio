import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { getHero } from "../api/axios";

export default function UserHero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mainImgRef = useRef(null);
  const imgControls = useAnimation();
  const textControls = useAnimation();
  const stuckRef = useRef(false);
  const rafRef = useRef(null);
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
  useEffect(() => {
    async function fetchHero() {
      try {
        const data = await getHero();
        if (data) setHero(data);
        else setError("Hero section not found.");
      } catch (err) {
        setError("Failed to load hero section.");
      } finally {
        setLoading(false);
      }
    }
    fetchHero();
  }, []);

  useEffect(() => {
    function checkSticky() {
      const el = mainImgRef.current;
      if (!el) return;

      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;

      const topFromStyle = parseFloat(getComputedStyle(el).top) || 0;

      const threshold = headerHeight + topFromStyle + 1;

      const rect = el.getBoundingClientRect();
      const isStuckNow = rect.top <= threshold;

      if (isStuckNow && !stuckRef.current) {
        stuckRef.current = true;

        imgControls.start({
          width: "100%",
          borderRadius: "0px",
          transition: { duration: 1.1, ease: "easeOut" },
        });
        textControls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, delay: 0.2, ease: "easeOut" },
        });
      } else if (!isStuckNow && stuckRef.current) {

        stuckRef.current = false;
        imgControls.start({
          width: "80%",
          borderRadius: "500px",
          transition: { duration: 0.45, ease: "easeInOut" },
        });
        textControls.start({
          opacity: 0,
          y: 80,
          transition: { duration: 0.3, ease: "easeInOut" },
        });
      }
    }

    function onScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(checkSticky);
    }

    checkSticky();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imgControls, textControls]);


  useEffect(() => {
    const el = mainImgRef.current;
    if (!el) return;

    let node = el.parentElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      if (/(hidden|auto|scroll)/.test(style.overflowY) || style.transform !== "none") {
        console.warn(
          "[UserHero] ancestor may block sticky behaviour:",
          node,
          "overflowY:",
          style.overflowY,
          "transform:",
          style.transform
        );
        break;
      }
      node = node.parentElement;
    }
  }, []);

  if (loading) return <p>Loading hero section...</p>;
  if (error) return <p>{error}</p>;
  if (!hero) return null;

  return (
    <motion.section initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeIn" }} className="hero-sec" >
      <div className="hero-row" >
        <motion.div className="top" initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeInVariant}>
          <h1>
            {hero.heading} <span>Roselin</span>
          </h1>
          <strong>{hero.subheading}</strong>
          <p>{hero.description}</p>
        </motion.div>

        <motion.div
          ref={mainImgRef}
          className="main-img"
          initial={{ width: "80%", borderRadius: "500px" }}
          animate={imgControls}
          style={{
            height: "100vh",
            margin: "0 auto",
            position: "sticky",
            top: 0,
            bottom:0,
            overflow: "hidden",
          }}
        >
          <img
            src={hero.backgroundImageUrl}
            alt="Background"
            style={{
              borderRadius: "inherit",
              width: "100%",
              height: "inherit",
              objectFit: "cover",
              display: "block",
            }}
          />

          <motion.div
            className="top top-inner"
            initial={{ opacity: 0, y: 80 }}
            animate={textControls}
            style={{
              position: "absolute",
              top: "50%",
              left: "43%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h1>
              {hero.heading} <span>Roselin</span>
            </h1>
            <strong>{hero.subheading}</strong>
            <p>{hero.description}</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
