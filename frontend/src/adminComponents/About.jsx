import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  getAbout,
  saveAbout,
  deleteAboutService,
  deleteAboutStat,
} from "../api/axios";

export default function AdminAbout() {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [stats, setStats] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAbout();
        if (data) {
          setHeading(data.heading || "");
          setDescription(data.description || "");
          setStats(data.stats || []);
          setServices(data.services || []);
        }
      } catch {
        toast.error("Failed to load About section.");
      }
    })();
  }, []);

  const handleStatChange = (index, field, value) => {
    setStats((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const addStat = () =>
    setStats([...stats, { value: "", suffix: "", label: "" }]);

  const removeStat = async (id, index) => {
    if (id) {
      try {
        await deleteAboutStat(id);
        toast.success("Stat removed successfully");
      } catch {
        toast.error("Failed to remove stat");
        return;
      }
    }
    setStats((prev) => prev.filter((_, i) => i !== index));
  };


  const handleServiceChange = (index, field, value) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleServiceIconChange = (index, file) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, icon: file } : s))
    );
  };

  const addService = () =>
    setServices([...services, { title: "", icon: "" }]);

  const removeService = async (id, index) => {
    if (id) {
      try {
        await deleteAboutService(id);
        toast.success("Service removed successfully");
      } catch {
        toast.error("Failed to remove service");
        return;
      }
    }
    setServices((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("description", description);

      formData.append(
        "stats",
        JSON.stringify(stats.map(({ _id, ...rest }) => rest))
      );

      const servicesMeta = services.map((s) => ({
        _id: s._id,
        title: s.title,
        icon: s.icon instanceof File ? "" : s.icon,
      }));
      formData.append("services", JSON.stringify(servicesMeta));

      services.forEach((s, i) => {
        if (s.icon instanceof File) {
          formData.append(`icons_${i}`, s.icon);
        }
      });

      let res;
      if (stats.length === 0 && services.length === 0) {
        res = await uploadAboutSection(formData);
      } else {

        res = await saveAbout(formData);
      }

      setHeading(res.heading || "About me");
      setDescription(res.description || "I'm a dev");
      setStats(res.stats || []);
      setServices(res.services || []);

      toast.success("About section saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save About section.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="Abt-admin">
      <h2 >About Section (Admin)</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <div>
          <label>Heading</label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>


        {stats.map((s, i) => (
          <div key={s._id || i} >
            <input
              type="number"
              placeholder="Value"
              value={s.value}
              onChange={(e) => handleStatChange(i, "value", e.target.value)}
            />
            <input
              type="text"
              placeholder="Suffix"
              value={s.suffix}
              onChange={(e) => handleStatChange(i, "suffix", e.target.value)}
            />
            <input
              type="text"
              placeholder="Label"
              value={s.label}
              onChange={(e) => handleStatChange(i, "label", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeStat(s._id, i)}
              className="text-red-400"
            >
     
            </button>
          </div>
        ))}


        <button
          type="button"
          onClick={addStat}
        >
           Add Stat
        </button>
        <h4 >Services</h4>
        {services.map((s, i) => (
          <div key={s._id || i} >
            <input
              type="text"
              placeholder="Title"
              value={s.title}
              onChange={(e) =>
                handleServiceChange(i, "title", e.target.value)
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleServiceIconChange(i, e.target.files[0])}
            />

            {s.icon && !(s.icon instanceof File) && (
              <>
                <img src={s.icon} alt="" className="h-10" />
              </>
            )}
            {s.icon instanceof File && (
              <img src={URL.createObjectURL(s.icon)} alt="" className="h-10" />
            )}

            <button
              type="button"
              onClick={() => removeService(s._id, i)}
            >
              Delete
            </button>


          </div>
        ))}
        <button
          type="button"
          onClick={addService}
        >
          Add Service
        </button>


        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save About Section"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
