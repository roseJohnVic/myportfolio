import Project from "../models/projectModel.js";
import {deleteImageFile} from "../utils/deleteImg.js"


export const saveProjects = async (req, res) => {
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
        image: `${process.env.BASE_URL}/uploads/images/${file.filename}`, 
      });
    } else if (title || file) {
      return res.status(400).json({
        message: "Both title and image are required to add a project.",
      });
    }

    await projectDoc.save();
    res.json(projectDoc);
  } catch (err) {
    console.error("Error saving project:", err);
    res.status(500).json({ message: err.message });
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
      if (project.image) await deleteImageFile(project.image);
      project.image = `${process.env.BASE_URL}/uploads/images/${req.file.filename}`;
    }

    await projectDoc.save();
    res.json(projectDoc);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res ,next) => {
  try {
    const projectDoc = await Project.findOne({});
    res.json(projectDoc || { heading: "", projects: [] });
  } catch (error) {
   next(error)
  }
};


export const deleteProject = async (req, res,next) => {
  try {
    const { projectId } = req.params;
    const projectDoc = await Project.findOne({});
    if (!projectDoc) return res.status(404).json({ message: "Project not found" });

    const projIndex = projectDoc.projects.findIndex((p) => p._id.toString() === projectId);
    if (projIndex === -1) return res.status(404).json({ message: "Project not found" });

    const oldImage = projectDoc.projects[projIndex].image?.replace(`${process.env.BASE_URL}/uploads/images/`, "");
    await deleteImageFile(oldImage);

    projectDoc.projects.splice(projIndex, 1); //andha index la irrukura array value va 1 remove pannum
    await projectDoc.save();
    res.json(projectDoc);
  } catch (err) {
   next(error);
  }
};


export const deleteAllProjects = async (req, res,next) => {
  try {
    const projectDoc = await Project.findOne({});
    if (!projectDoc) return res.json({ message: "No projects to delete" });

    for (const p of projectDoc.projects) {
       deleteImageFile(p.image?.replace(`${process.env.BASE_URL}/uploads/images/`, ""));
    }

    projectDoc.projects = [];
    await projectDoc.save();
    res.json({ projects: [] });
  } catch (err) {
     next(err);
  }
};
