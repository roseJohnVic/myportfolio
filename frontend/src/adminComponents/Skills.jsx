import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  saveSkills,
  getSkills,
  updateSkill,
  deleteAllSkills,
  deleteSkill,
} from "../api/axios";

export default function AdminSkills() {
  const [form, setForm] = useState({
    heading: "",
    description: "",
    skillsCnt: [],
  });
  const [loading, setLoading] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null); // ✅ declare editingSkillId

  useEffect(() => {
    (async () => {
      try {
        const data = await getSkills();
        if (data) {
          setForm({
            heading: data.heading || "",
            description: data.description || "",
            skillsCnt: data.skillsCnt || [],
          });
        }
      } catch {
        toast.error("Failed to load Skills section.");
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillChange = (index, field, value) => {
    const updated = [...form.skillsCnt];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, skillsCnt: updated }));
  };

  const handleFileChange = (index, file) => {
    const updated = [...form.skillsCnt];
    updated[index].file = file; // store file temporarily
    setForm((prev) => ({ ...prev, skillsCnt: updated }));
  };

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skillsCnt: [...prev.skillsCnt, { title: "", range: "", icon: "" }],
    }));
  };

  const removeSkill = async (id, index) => {
    try {
      if (id) await deleteSkill(id);
      const updated = [...form.skillsCnt];
      updated.splice(index, 1);
      setForm((prev) => ({ ...prev, skillsCnt: updated }));
      toast.success("Skill removed");
    } catch {
      toast.error("Failed to delete skill");
    }
  };

  const handleSave = async () => {
    if (!form.heading) return toast.error("Heading is required");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("heading", form.heading);
      formData.append("description", form.description);

      // Send skills JSON (without files)
      const skillsToSend = form.skillsCnt.map((s) => ({
        _id: s._id || undefined,
        title: s.title,
        range: s.range,
        icon: s.icon || "",
      }));
      formData.append("skillsCnt", JSON.stringify(skillsToSend));

      // Attach files
      form.skillsCnt.forEach((s, idx) => {
        if (s.file) {
          formData.append(`icons_${idx}`, s.file);
        }
      });

      const data = await saveSkills(formData); // always save all skills at once

      toast.success("Skills saved successfully!");

      setForm({
        heading: data.heading || "",
        description: data.description || "",
        skillsCnt: data.skillsCnt || [],
      });
      setEditingSkillId(null);
    } catch (err) {
      toast.error(
        `Failed to save skill. ${err.response?.data?.message || err.message}`
      );
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllSkills();
      setForm((prev) => ({ ...prev, skillsCnt: [] }));
      toast.success("All skills deleted");
    } catch {
      toast.error("Failed to delete all skills");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Skills</h2>

      <input
        type="text"
        name="heading"
        placeholder="Heading"
        value={form.heading}
        onChange={handleInputChange}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleInputChange}
        className="border p-2 mb-4 w-full"
      />

      <h3 className="font-semibold">Skills List</h3>
      {form.skillsCnt.map((skill, index) => (
        <div key={skill._id || index} className="border p-3 rounded mb-3">
          <input
            type="text"
            placeholder="Skill Title"
            value={skill.title || ""}
            onChange={(e) =>
              handleSkillChange(index, "title", e.target.value)
            }
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Range (e.g. 90%)"
            value={skill.range || ""}
            onChange={(e) =>
              handleSkillChange(index, "range", e.target.value)
            }
            className="border p-2 mr-2"
          />
          <input
            type="file"
            onChange={(e) => handleFileChange(index, e.target.files[0])}
            className="border p-2"
          />
          {skill.icon && (
            <img
              src={skill.icon}
              alt="icon"
              className="w-12 h-12 inline-block ml-2"
            />
          )}
          <button
            onClick={() => removeSkill(skill._id, index)}
            className="ml-3 text-red-500"
          >
            ❌
          </button>
        </div>
      ))}

      <button
        onClick={addSkill}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Add Skill
      </button>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Save Skills
        </button>
        <button
          onClick={handleDeleteAll}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete All
        </button>
      </div>
    </div>
  );
}
