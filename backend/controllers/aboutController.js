import About from "../models/aboutModel.js";
import { deleteImageFile } from "../utils/deleteImg.js";

// Helper: Build full URL from relative path
const buildUrl = (relativePath) => {
  if (!relativePath) return "";
  // If it's already a full URL (legacy data), return as-is
  if (relativePath.startsWith("http")) return relativePath;
  return `${process.env.BASE_URL}/${relativePath}`;
};

// Helper: Strip BASE_URL prefix to get relative path (handles legacy data)
const toRelativePath = (urlOrPath) => {
  if (!urlOrPath) return "";
  // Strip any http://localhost:xxxx or https://xxx.onrender.com prefix
  return urlOrPath.replace(/^https?:\/\/[^/]+\//, "");
};

// Format about doc for response — converts relative paths to full URLs
const formatAboutResponse = (about) => {
  const obj = about.toObject ? about.toObject() : about;
  return {
    ...obj,
    services: obj.services?.map((s) => ({
      ...s,
      icon: buildUrl(toRelativePath(s.icon)),
    })) || [],
  };
};

export const saveAbout = async (req, res, next) => {
  try {
    const { heading, description, services, stats } = req.body;

    if (!heading || !description) {
      return res.status(400).json({ message: "heading and description are required" });
    }

    let parsedServices = [];
    let parsedStats = [];

    try {
      parsedServices = JSON.parse(services || "[]");
      parsedStats = JSON.parse(stats || "[]");
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON for services/stats", error });
    }

    let about = await About.findOne();

    if (!about) {
      // First-time creation
      parsedServices.forEach((service, index) => {
        if (req.files && req.files[index]) {
          // Save ONLY relative path
          service.icon = `uploads/images/${req.files[index].filename}`;
        }
      });

      about = new About({
        heading,
        description,
        services: parsedServices,
        stats: parsedStats,
      });
      await about.save();
      return res.status(201).json(formatAboutResponse(about));
    } else {
      // Update existing — handle deletions of removed services
      about.services.forEach((oldService) => {
        const stillExists = parsedServices.some(
          (s) => s._id && s._id.toString() === oldService._id.toString()
        );
        if (!stillExists && oldService.icon) {
          // Convert any legacy full-URL to relative path before deleting file
          deleteImageFile(toRelativePath(oldService.icon));
        }
      });

      const updatedServices = parsedServices.map((service, index) => {
        const oldService = about.services.find(
          (s) => s._id && s._id.toString() === service._id
        );

        const uploadedFile = req.files?.find((f) => f.fieldname === `icons_${index}`);

        if (uploadedFile) {
          if (oldService?.icon) deleteImageFile(toRelativePath(oldService.icon));
          return {
            ...service,
            // Save ONLY relative path
            icon: `uploads/images/${uploadedFile.filename}`,
          };
        }

        // No new file — keep existing icon (normalized to relative path)
        return {
          ...service,
          icon: toRelativePath(oldService?.icon || service.icon || ""),
        };
      });

      about.heading = heading || about.heading;
      about.description = description || about.description;
      about.services = updatedServices;
      about.stats = parsedStats;

      await about.save();
      return res.status(200).json(formatAboutResponse(about));
    }
  } catch (error) {
    next(error);
  }
};

export const getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About section not found" });

    res.status(200).json(formatAboutResponse(about));
  } catch (error) {
    next(error);
  }
};

export const deleteAboutStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About not found" });

    about.stats = about.stats.filter((stat) => stat._id.toString() !== id);
    await about.save();

    res.status(200).json({ message: "Stat removed" });
  } catch (err) {
    next(err);
  }
};

export const deleteAboutService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    const service = about.services.find((s) => s._id.toString() === id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Delete the icon file if it exists
    if (service.icon) {
      deleteImageFile(toRelativePath(service.icon));
    }

    about.services = about.services.filter((s) => s._id.toString() !== id);
    await about.save();

    res.json({
      message: "Service deleted successfully",
      services: about.services,
    });
  } catch (error) {
    next(error);
  }
};