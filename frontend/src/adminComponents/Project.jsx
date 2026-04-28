import React, { useState, useEffect, useRef } from "react";
import {
  saveProjects,
  getProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
} from "../api/axios";

import { toast, ToastContainer } from "react-toastify";
import useDeleteConfirmToast from "../utils/DeleteConfirmToast";

export default function AdminProjects() {
  const [heading, setHeading] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const titleRef = useRef();
  const fileRef = useRef();
  const { confirmAction } = useDeleteConfirmToast();


  useEffect(() => {
    (async () => {
      try {
        const data = await getProject();
        if (data) {
          setHeading(data.heading || "");
          setProjects(data.projects || []);
        }
      } catch {
        toast.error("Failed to load Projects section.");
      }
    })();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading) return toast.error("Heading is required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("heading", heading);

      const title = titleRef.current.value;
      const file = fileRef.current.files[0];

      if (title) formData.append("title", title);
      if (file) formData.append("image", file);

      let data;
      if (editId) {
        data = await updateProject(editId, formData);
        toast.success("Project updated!");
      } else {
        data = await saveProjects(formData);
        toast.success("Project added!");
      }

      setHeading(data.heading || "");
      setProjects(data.projects || []);
      resetForm();
    } catch (err) {
      toast.error(
        `Failed to save project. ${err.response?.data?.message || err.message}`
      );
    }
    setLoading(false);
  };


  const handleEdit = (project) => {
    setEditId(project._id);
    titleRef.current.value = project.title;
  };


  const handleDelete = (id) => {
    confirmAction("Are you sure you want to delete this project?", async () => {
      setLoading(true);
      try {
        const data = await deleteProject(id);
        setProjects(data.projects || []);
        toast.success("Project deleted.");
      } catch {
        toast.error("Failed to delete project.");
      }
      setLoading(false);
    });
  };


  const handleDeleteAll = () => {
    confirmAction("Are you sure you want to delete ALL projects?", async () => {
      setLoading(true);
      try {
        await deleteAllProjects();
        setProjects([]);
        toast.success("All projects deleted.");
      } catch {
        toast.error("Failed to delete all projects.");
      }
      setLoading(false);
    });
  };


  const resetForm = () => {
    setEditId(null);
    if (titleRef.current) titleRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div
className="proj-admin"
    >
      <h2>Admin Projects Section</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Section Heading:
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
            disabled={loading}

          />
        </label>

        <label>
          Project Title:
          <input
            ref={titleRef}
            type="text"
            placeholder="Enter project title"
            disabled={loading}

          />
        </label>

        <label>
          Project Image:
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            disabled={loading}

          />
        </label>

        <div >
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Project" : "Add Project"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}

            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>


      <div >
        <h3>Projects List</h3>
        {projects.length === 0 ? (
          <p>No projects added yet.</p>
        ) : (
          <ul >
            {projects.map((p) => (
              <li
                key={p._id}

              >
                <img
                  src={p.image}
                  alt={p.title}

                />
                <span style={{ marginLeft: 15, flex: 1 }}>{p.title}</span>
                <button
                  onClick={() => handleEdit(p)}
                  disabled={loading}
                className="edt-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={loading}
className="del-btn"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {projects.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={loading}

          >
            Delete All Projects
          </button>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
