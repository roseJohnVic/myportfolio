import React from "react";
import Hero from "../frontComponents/Hero";
import UserAbout from "../frontComponents/About";
import UserSkills from "../frontComponents/Skills";
import UserProjects from "../frontComponents/Project";
import UserContact from "../frontComponents/Contact";
import Footer from "../frontComponents/Footer";
import ParticlesBg from "../frontComponents/ParticlesBg";
import ScrollTop from "../frontComponents/ScrollTop";
import "../style/frontendStyle/style.css";

export const Home = () => {
  return (
    <div className="maincontent">
      {/* Animated particle background — sits behind everything */}
      <ParticlesBg />

      <Hero />
      <UserAbout />
      <UserSkills />
      <UserProjects />
      <UserContact />
      <Footer />

      {/* Floating scroll-to-top button */}
      <ScrollTop />
    </div>
  );
};
