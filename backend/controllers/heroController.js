import Hero from "../models/heroModel.js";
import { deleteImageFile } from "../utils/deleteImg.js";
import fs from "fs";
import path from "path";

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

const formatHeroResponse = (hero) => ({
  id: hero._id,
  heading: hero.heading,
  subheading: hero.subheading,
  description: hero.description,
  backgroundImageUrl: buildUrl(toRelativePath(hero.backgroundImage)),
  rightImageUrl: buildUrl(toRelativePath(hero.rightImage)),
});

export const saveHero = async (req, res, next) => {
  try {
    const { heading, subheading, description } = req.body;

    const bgImage = req.files?.backgroundImage?.[0];
    const rightImg = req.files?.rightImage?.[0];

    let hero = await Hero.findOne();

    if (!hero) {
      hero = new Hero({});
    }

    if (heading) hero.heading = heading;
    if (subheading) hero.subheading = subheading;
    if (description) hero.description = description;

    if (bgImage) {
      if (hero.backgroundImage) {
        const relativeOld = toRelativePath(hero.backgroundImage);
        if (fs.existsSync(relativeOld)) fs.unlinkSync(relativeOld);
      }
      hero.backgroundImage = path
        .relative(process.cwd(), bgImage.path)
        .replace(/\\/g, "/");
    }

    if (rightImg) {
      if (hero.rightImage) {
        const relativeOld = toRelativePath(hero.rightImage);
        if (fs.existsSync(relativeOld)) fs.unlinkSync(relativeOld);
      }
      hero.rightImage = path
        .relative(process.cwd(), rightImg.path)
        .replace(/\\/g, "/");
    }

    await hero.save();
    res.json(formatHeroResponse(hero));
  } catch (error) {
    next(error);
  }
};

export const getHero = async (req, res, next) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) {
      return res.status(404).json({ message: "Hero section not found" });
    }
    res.json(formatHeroResponse(hero));
  } catch (error) {
    next(error);
  }
};

export const deleteHeroImage = async (req, res, next) => {
  try {
    const { field } = req.params;
    if (!["backgroundImage", "rightImage"].includes(field)) {
      return res.status(400).json({ message: "Invalid image field" });
    }

    const hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: "Hero section not found" });

    if (!hero[field]) {
      return res.status(404).json({ message: "No image to delete." });
    }

    deleteImageFile(toRelativePath(hero[field]));

    hero[field] = "";
    await hero.save();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    next(error);
  }
};