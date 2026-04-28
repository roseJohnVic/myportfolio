import React, { useEffect, useState } from "react";
import { getFooter, updateFooter } from "../api/axios";
import { toast } from "react-toastify";

const FooterForm = () => {
  const [formData, setFormData] = useState({ copyright: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getFooter();
        if (data) {
          setFormData({ copyright: data.copyright || "" });
        }
      } catch {
        toast.error("Failed to load footer section.");
      }
    })();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.copyright.trim()) {
      return toast.error("Copyright text is required!");
    }

    setLoading(true);
    try {
      const updated = await updateFooter(formData);
      toast.success("Footer updated!");
      setFormData({ copyright: updated.copyright || "" });
    } catch (err) {
      toast.error(
        `Failed to save footer. ${err.response?.data?.message || err.message}`
      );
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="copyright"
        placeholder="© Text"
        value={formData?.copyright || ""}
        onChange={handleChange}
      />
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default FooterForm;
