import { Routes, Route, Link } from "react-router-dom";        
import { ToastContainer } from "react-toastify"; 
import { Home } from "./frontPage/Home";
import { DashBoard } from "./adminPage/Dashboard";
import Header from "./frontComponents/Header";
import { animate, motion } from 'framer-motion';
import UserAbout from "./frontComponents/About";
import UserSkills from "./frontComponents/Skills";
import UserProjects from "./frontComponents/Project";
import UserContact from "./frontComponents/Contact";
import ScrollToTop from "./frontComponents/ScrollToTop";
import CursorEffect from "./components/CursorEffect";

function App() {
  return (
    <>
      <CursorEffect type="specs" />

      <Header
        logo="Roselin"
        links={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/skills", label: "Skills" },
          { href: "/projects", label: "Projects" },
          { href: "/contact", label: "Contact" },
        ]}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminrosejohn" element={<DashBoard />} />
        <Route path="/about" element={<UserAbout />} />
        <Route path="/skills" element={<UserSkills />} />
        <Route path="/projects" element={<UserProjects />} />
        <Route path="/contact" element={<UserContact />} />
      </Routes>

      <ScrollToTop />
      <ToastContainer />
    </>
  );
}

export default App;