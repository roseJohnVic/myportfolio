import React, { useState, useEffect, useRef } from "react";
import { getHero, saveHero, deleteHeroImage } from "../api/axios"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDeleteConfirmToast from "../utils/DeleteConfirmToast";

export default function AdminHero() {
  const [hero, setHero] = useState(null);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { confirmAction } = useDeleteConfirmToast();

  const bgInputRef = useRef(null);
  const rightInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getHero();
        if (data) {
          setHero(data);
          setHeading(data.heading || "");
          setSubheading(data.subheading || "");
          setDescription(data.description || "");
        }
      } catch {
        toast.error("Failed to load hero section.");
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("subheading", subheading);
      formData.append("description", description);
      if (backgroundImage) formData.append("backgroundImage", backgroundImage);
      if (rightImage) formData.append("rightImage", rightImage);

      const data = await saveHero(formData); 

      setHero(data);
      toast.success("Hero section saved!");

      setBackgroundImage(null);
      setRightImage(null);
      if (bgInputRef.current) bgInputRef.current.value = "";
      if (rightInputRef.current) rightInputRef.current.value = "";
    } catch (err) {
      toast.error(
        `Failed to save hero section. ${err.response?.data?.message || err.message}`
      );
    }
    setLoading(false);
  };

  const handleDeleteSection = () => {
    confirmAction("Are you sure you want to delete the entire hero section?", async () => {
      setLoading(true);
      try {
        await deleteHeroSection();
        setHero(null);
        setHeading("");
        setSubheading("");
        setDescription("");
        setBackgroundImage(null);
        setRightImage(null);

        if (bgInputRef.current) bgInputRef.current.value = "";
        if (rightInputRef.current) rightInputRef.current.value = "";

        toast.success("Hero section deleted.");
      } catch {
        toast.error("Failed to delete hero section.");
      }
      setLoading(false);
    });
  };


  const handleDeleteImage = (field) => {
    confirmAction(
      `Are you sure you want to delete the ${field === "backgroundImage" ? "background" : "right"} image?`,
      async () => {
        setLoading(true);
        try {
          await deleteHeroImage(field);
          toast.success(
            field === "backgroundImage" ? "Background image deleted." : "Right image deleted."
          );
          setHero((prevHero) =>
            prevHero ? { ...prevHero, [field]: "", [`${field}Url`]: "" } : prevHero
          );
          if (field === "backgroundImage") {
            setBackgroundImage(null);
            if (bgInputRef.current) bgInputRef.current.value = "";
          }
          if (field === "rightImage") {
            setRightImage(null);
            if (rightInputRef.current) rightInputRef.current.value = "";
          }
        } catch {
          toast.error("Failed to delete image.");
        }
        setLoading(false);
      }
    );
  };

  return (
    <div
     className="admin-hero"
    >
      <h2>Admin Hero Section</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Heading:<br />
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
            disabled={loading}
            
          />
        </label>

        <label>
          Subheading:<br />
          <input
            type="text"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            required
            disabled={loading}
        
          />
        </label>

        <label>
          Description:<br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={loading}
            rows={4}
           
          />
        </label>


        <label>
          Background Image:<br />
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setBackgroundImage(e.target.files[0])}
            disabled={loading}
          />
          <div style={{ marginTop: 10 }}>
            {backgroundImage ? (
              <img
                src={URL.createObjectURL(backgroundImage)}
                alt="Background Preview"
        
               
              />
            ) : (
              hero?.backgroundImageUrl && (
                <>
                  <img
                    src={hero.backgroundImageUrl}
                    alt="Current Background"
           
  
                  />
                  <button
                    type="button"
                  
                    disabled={loading}
                    onClick={() => handleDeleteImage("backgroundImage")}
                  >
                    Delete Background Image
                  </button>
                </>
              )
            )}
          </div>
        </label>

      
        <label >
          Right Image:<br />
          <input
            ref={rightInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setRightImage(e.target.files[0])}
            disabled={loading}
          />
          <div >
            {rightImage ? (
              <img
                src={URL.createObjectURL(rightImage)}
                alt="Right Preview"
              
              />
            ) : (
              hero?.rightImageUrl && (
                <>
                  <img
                    src={hero.rightImageUrl}
                    alt="Current Right"
                  
                  />
                  <button
                    type="button"
                    
                    disabled={loading}
                    onClick={() => handleDeleteImage("rightImage")}
                  >
                    Delete Right Image
                  </button>
                </>
              )
            )}
          </div>
        </label>

        <div >
          <button type="submit" disabled={loading} >
            {loading ? "Saving..." : "Save Hero"}
          </button>

          {hero && (
            <button
              type="button"
              onClick={handleDeleteSection}
              disabled={loading}
             
            >
              {loading ? "Processing..." : "Delete Hero"}
            </button>
          )}
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
