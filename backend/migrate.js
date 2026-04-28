/**
 * MIGRATION SCRIPT — Run ONCE to clean up old URLs in MongoDB
 *
 * Strips "http://localhost:5000/" or any other host prefix from
 * stored image paths so the controllers can build them dynamically.
 *
 * HOW TO RUN:
 *   1. Save this file as: backend/migrate.js
 *   2. Make sure backend/.env has MONGO_URL set
 *   3. In terminal: cd backend && node migrate.js
 *   4. Once done, you can delete this file
 */

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Strip any http(s)://host/ prefix
const toRelativePath = (urlOrPath) => {
  if (!urlOrPath) return urlOrPath;
  return urlOrPath.replace(/^https?:\/\/[^/]+\//, "");
};

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✓ Connected to MongoDB\n");

    const db = mongoose.connection.db;

    // ─── HERO ───
    const heroes = db.collection("heroes");
    const heroDoc = await heroes.findOne();
    if (heroDoc) {
      const update = {};
      if (heroDoc.backgroundImage) {
        update.backgroundImage = toRelativePath(heroDoc.backgroundImage);
      }
      if (heroDoc.rightImage) {
        update.rightImage = toRelativePath(heroDoc.rightImage);
      }
      if (Object.keys(update).length) {
        await heroes.updateOne({ _id: heroDoc._id }, { $set: update });
        console.log("✓ Hero updated:", update);
      } else {
        console.log("- Hero: nothing to update");
      }
    }

    // ─── ABOUT ───
    const abouts = db.collection("abouts");
    const aboutDoc = await abouts.findOne();
    if (aboutDoc && aboutDoc.services?.length) {
      const fixedServices = aboutDoc.services.map((s) => ({
        ...s,
        icon: toRelativePath(s.icon),
      }));
      await abouts.updateOne(
        { _id: aboutDoc._id },
        { $set: { services: fixedServices } }
      );
      console.log(`✓ About: fixed ${fixedServices.length} service icons`);
    }

    // ─── SKILLS ───
    const skills = db.collection("skills");
    const skillsDoc = await skills.findOne();
    if (skillsDoc && skillsDoc.skillsCnt?.length) {
      const fixedSkills = skillsDoc.skillsCnt.map((s) => ({
        ...s,
        icon: toRelativePath(s.icon),
      }));
      await skills.updateOne(
        { _id: skillsDoc._id },
        { $set: { skillsCnt: fixedSkills } }
      );
      console.log(`✓ Skills: fixed ${fixedSkills.length} skill icons`);
    }

    // ─── PROJECTS ───
    const projects = db.collection("projects");
    const projectDoc = await projects.findOne();
    if (projectDoc && projectDoc.projects?.length) {
      const fixedProjects = projectDoc.projects.map((p) => ({
        ...p,
        image: toRelativePath(p.image),
      }));
      await projects.updateOne(
        { _id: projectDoc._id },
        { $set: { projects: fixedProjects } }
      );
      console.log(`✓ Projects: fixed ${fixedProjects.length} project images`);
    }

    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();