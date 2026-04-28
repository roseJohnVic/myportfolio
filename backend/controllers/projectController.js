import Project from "../models/projectModel.js";
import { deleteImageFile } from "../utils/deleteImg.js";

// Helper: Build full URL from relative path
const buildUrl = (relativePath) => {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  return `${process.env.BASE_URL}/${relativePath}`;
};

// Helper: Strip any host prefix to get relative path
const toRelativePath = (urlOrPath) => {
  if (!urlOrPath) return "";
  return urlOrPath.replace(/^https?:\/\/[^/]+\//, "");
};

// Format project doc for response
const formatProjectResponse = (projectDoc) => {
  if (!projectDoc) return { heading: "", projects: [] };
  const obj = projectDoc.toObject ? projectDoc.toObject() : projectDoc;
  return {
    ...obj,
    projects: obj.projects?.map((p) => ({
      ...p,
      image: buildUrl(toRelativePath(p.image)),
    })) || [],
  };
};

export const saveProjects = async (req, res, next) => {
  try {
    const { heading, title } = req.body;

    let projectDoc = await Project.findOne({});
    if (!projectDoc) {
      projectDoc = new Project({ heading: heading || "", projects: [] });
    } else if (heading) {
      projectDoc.heading = heading;
    }

    if (!projectDoc.projects) projectDoc.projects = [];

    const file = req.files?.image?.[0] || req.files?.images?.[0] || null;

    if (title && file) {
      projectDoc.projects.push({
        title,
        // Save ONLY relative path
        image: `uploads/images/${file.filename}`,
      });
    } else if (title || file) {
      return res.status(400).json({
        message: "Both title and image are required to add a project.",
      });
    }

    await projectDoc.save();
    res.json(formatProjectResponse(projectDoc));
  } catch (err) {
    console.error("Error saving project:", err);
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;

    const projectDoc = await Project.findOne();
    if (!projectDoc) return res.status(404).json({ message: "No project found" });

    const project = projectDoc.projects.id(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (title) project.title = title;

    if (req.file) {
      if (project.image) await deleteImageFile(toRelativePath(project.image));
      project.image = `uploads/images/${req.file.filename}`;
    }

    await projectDoc.save();
    res.json(formatProjectResponse(projectDoc));
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const projectDoc = await Project.findOne({});
    res.json(formatProjectResponse(projectDoc));
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const projectDoc = await Project.findOne({});
    if (!projectDoc) return res.status(404).json({ message: "Project not found" });

    const projIndex = projectDoc.projects.findIndex(
      (p) => p._id.toString() === projectId
    );
    if (projIndex === -1) return res.status(404).json({ message: "Project not found" });

    const oldImage = projectDoc.projects[projIndex].image;
    if (oldImage) await deleteImageFile(toRelativePath(oldImage));

    projectDoc.projects.splice(projIndex, 1);
    await projectDoc.save();
    res.json(formatProjectResponse(projectDoc));
  } catch (err) {
    next(err);
  }
};

export const deleteAllProjects = async (req, res, next) => {
  try {
    const projectDoc = await Project.findOne({});
    if (!projectDoc) return res.json({ message: "No projects to delete" });

    for (const p of projectDoc.projects) {
      if (p.image) deleteImageFile(toRelativePath(p.image));
    }

    projectDoc.projects = [];
    await projectDoc.save();
    res.json({ projects: [] });
  } catch (err) {
    next(err);
  }
};