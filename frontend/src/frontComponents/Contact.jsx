import React, { useState } from "react";
import { saveUsers } from "../api/axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";

export default function UserContact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!nameRegex.test(formData.name)) {
      toast.error("Name should contain only letters");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Email must be a valid @gmail.com address");
      return false;
    }
    if (!formData.address || !formData.message) {
      toast.error("Address and message are required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await saveUsers(formData);
      toast.success("Message saved successfully!");
      setFormData({ name: "", phone: "", email: "", address: "", message: "" });
    } catch {
      toast.error("Error saving contact");
    }
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="cnt-sec"
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeIn" }}
      style={{ width: "100%", textAlign: "center" }}
    >
      <motion.div
        className="cont-form"
        initial="hidden"
        animate={{ opacity: 1 }}
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={fadeInVariant}
      >
        <div className="container">
          <h5>Contact</h5>
          <form onSubmit={handleSubmit}>
            <div className="dbl">
              <input
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                name="phone"
                placeholder="Your phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="dbl">
              <input
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                name="address"
                placeholder="Your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
            />
            <button type="submit" className="port-btn">
              Send
            </button>
          </form>
        </div>
      </motion.div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="dark"
      />
    </motion.section>
  );
}
