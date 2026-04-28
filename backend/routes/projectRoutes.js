import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  deleteAllProjects,
  deleteProject,
  getProject,
  saveProjects,
  updateProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/upload-projects",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 10 }]),
  saveProjects
);

router.get("/", getProject);

router.put("/:projectId", upload.single("image"), updateProject);

router.delete("/", deleteAllProjects);

router.delete("/:projectId", deleteProject);

export default router;
