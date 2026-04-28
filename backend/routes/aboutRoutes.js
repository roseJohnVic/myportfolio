import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  saveAbout,
  getAbout,
  deleteAboutStat,
  deleteAboutService
} from "../controllers/aboutController.js";

const router = express.Router();

router.post("/save-about", upload.any(), saveAbout);

router.get("/", getAbout);

router.delete("/stat/:id", deleteAboutStat);

router.delete("/services/:id", deleteAboutService);

export default router;
