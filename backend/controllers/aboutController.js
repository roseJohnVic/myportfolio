import About from "../models/aboutModel.js";
import { deleteImageFile } from "../utils/deleteImg.js";

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
      parsedServices.forEach((service, index) => {
        if (req.files && req.files[index]) {
          service.icon = `${process.env.BASE_URL}/uploads/images/${req.files[index].filename}`;
        }
      });

      about = new About({
        heading,
        description,
        services: parsedServices,
        stats: parsedStats,
      });
      await about.save();
      return res.status(201).json(about);
    } else {

      about.services.forEach((oldService) => {
        const stillExists = parsedServices.some(
          (s) => s._id && s._id.toString() === oldService._id.toString()
        );
        if (!stillExists && oldService.icon) {
          deleteImageFile(oldService.icon);
        }
      });

      const updatedServices = parsedServices.map((service, index) => {
        const oldService = about.services.find(
          s => s._id && s._id.toString() === service._id
        );

        const uploadedFile = req.files?.find(f => f.fieldname === `icons_${index}`);

        if (uploadedFile) {
          if (oldService?.icon) deleteImageFile(oldService.icon);
          return {
            ...service,
            icon: `${process.env.BASE_URL}/uploads/images/${uploadedFile.filename}`,
          };
        }

        return {
          ...service,
          icon: oldService?.icon || service.icon || "",
        };
      });

      about.heading = heading || about.heading;
      about.description = description || about.description;
      about.services = updatedServices;
      about.stats = parsedStats;

      await about.save();
      return res.status(200).json(about);
    }
  } catch (error) {
    next(error);
  }
};

export const getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About section not found" });

    res.status(200).json(about);
  } catch (error) {
    next(error);
  }
};


export const deleteAboutStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About not found" });

    about.stats = about.stats.filter(stat => stat._id.toString() !== id);
    await about.save();

    res.status(200).json({ message: "Stat removed" });
  } catch (err) {
    next(err);
  }
};



export const deleteAboutService = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Deleting service ID:", id);

    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }


    const serviceExists = about.services.some(
      (service) => service._id.toString() === id
    );
    if (!serviceExists) {
      return res.status(404).json({ message: "Service not found" });
    }


    about.services = about.services.filter(
      (service) => service._id.toString() !== id
    );

    await about.save();

    res.json({
      message: "Service deleted successfully",
      services: about.services,
    });
  } catch (error) {
    next(error);
  }
};

