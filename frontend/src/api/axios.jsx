import axios from "axios";
import { BASE_URL } from "../config";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;

/* --- HERO SECTION-- */

export const getHero = async () => {
  try {
    const { data } = await api.get("/api/hero");
    return data;
  } catch (error) {
    console.error("Error fetching hero:", error);
    return null;
  }
};
export const saveHero = async (formData) => {
  try {
    const { data } = await api.post("/api/hero/upload-hero", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error uploading hero:", error);
    throw error;
  }
};


export const deleteHeroImage = async (field) => {
  try {
    const { data } = await api.delete(`/api/hero/image/${field}`);
    return data;
  } catch (error) {
    console.error("Error deleting hero image:", error);
    throw error;
  }
};

/* ---- ABOUT SECTION  */
export const getAbout = async () => {
  try {
    const { data } = await api.get("/api/about");
    return data;
  } catch (error) {
    console.error("Error fetching about section:", error);
    return null;
  }
};

export const saveAbout = async (formData) => {
  try {
    const { data } = await api.post("/api/about/save-about", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error saving about section:", error);
    throw error;
  }
};

export const deleteAboutStat = async (id) => {
  try {
    const { data } = await api.delete(`/api/about/stat/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting about stat:", error);
    throw error;
  }
};

export const deleteAboutService = async (id) => {
  try {
    const { data } = await api.delete(`/api/about/services/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting about service:", error);
    throw error;
  }
};


// --- Skill section ---

export const saveSkills = async (formData) => {
  try {
    const { data } = await api.post("/api/skills/upload-skills", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error uploading skills:", error);
    throw error;
  }
};


export const getSkills = async () => {
  try {
    const { data } = await api.get("/api/skills");
    return data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return null;
  }
};

export const updateSkill = async (id, formData) => {
  try {
    const { data } = await api.put(`/api/skills/${id || ""}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error updating skills:", error);
    throw error;
  }
};

export const deleteSkill = async (id) => {
  try {
    const { data } = await api.delete(`/api/skills/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};


export const deleteAllSkills = async () => {
  try {
    const { data } = await api.delete(`/api/skills`);
    return data;
  } catch (error) {
    console.error("Error deleting all skills:", error);
    throw error;
  }
};

// ---project section ---


export const saveProjects = async (formData) => {
  try {
    const { data } = await api.post("/api/projects/upload-projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error uploading project section:", error);
    throw error;
  }
};


export const getProject = async () => {
  try {
    const { data } = await api.get("/api/projects");
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
};

export const updateProject = async (id, formData) => {
  try {
    const { data } = await api.put(`/api/projects/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const { data } = await api.delete(`/api/projects/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};


export const deleteAllProjects = async () => {
  try {
    const { data } = await api.delete(`/api/projects`);
    return data;
  } catch (error) {
    console.error("Error deleting all projects:", error);
    throw error;
  }
};


export const saveUsers = async (formData) => {
  try {
    const { data } = await api.post("/api/contact/save-contact", formData);
    return data;
  } catch (error) {
    console.error("Saving contact error:", error.response?.data || error.message);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const { data } = await api.get("/api/contact");
    return data;
  } catch (error) {
    console.log("get contact error : ", error);
    throw error;
  }
}

export const deleteAllUsers = async () => {
  try {
    const { data } = await api.delete("/api/contact");
    return data;
  } catch (error) {
    console.error("Error deleting all contacts:", error);
    throw error;
  }
};


export const deleteUserById = async (id) => {
  try {
    const { data } = await api.delete(`/api/contact/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

// --- footer ----

export const getFooter = async () => {
  try {
    const { data } = await api.get("/api/footer");
    return data;
  } catch (error) {
    console.log("get contact error : ", error);
    throw error;
  }
}

export const updateFooter = async (formData) => {
  try {
    const { data } = await api.put("/api/footer", formData, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    console.error("Error updating footer:", error);
    throw error;
  }
};

