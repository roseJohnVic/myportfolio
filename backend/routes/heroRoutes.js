import express from "express";
import upload from "../middleware/uploadMiddleware.js"
import {
  getHero,
  deleteHeroImage,
  saveHero
} from "../controllers/heroController.js";

const router = express.Router();

router.post(
  "/upload-hero",
  upload.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 },
  ]),
  saveHero
);
router.get("/", getHero)
router.delete("/image/:field", deleteHeroImage);


export default router;
