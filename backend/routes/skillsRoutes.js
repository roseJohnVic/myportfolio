import express from "express";
import upload from "../middleware/uploadMiddleware.js"; 
import {
  saveSkills,
  getSkills,
  updateSkills,
  deleteSkill,
  deleteAllSkills,
} from "../controllers/skillsController.js";

const router = express.Router();

router.post("/upload-skills", 
    upload.any(), saveSkills); 
router.get("/", getSkills);                              
router.put("/:skillId", upload.single("icon"), updateSkills);    
router.delete("/", deleteAllSkills);
router.delete("/:skillId", deleteSkill);                       

export default router;
