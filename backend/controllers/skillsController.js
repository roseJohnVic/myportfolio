import Skills from "../models/skillsModel.js";
import { deleteImageFile } from "../utils/deleteImg.js";

export const saveSkills = async (req, res, next) => {
  try {
    const { heading, description, skillsCnt } = req.body;

    if (!heading || !description) {
      return res.status(400).json({ message: "heading and description are required" });
    }

    let paresdSkillsCnt = [];

    try {
      paresdSkillsCnt = JSON.parse(skillsCnt || "[]");
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON for skills", error });
    }

    let skillsDoc = await Skills.findOne({});

    if (!skillsDoc) {
      paresdSkillsCnt.forEach((skill, index) => {
        if (req.files && req.files[index]) {
          skill.icon = `${process.env.BASE_URL}/uploads/images/${req.files[index].filename}`;
        }
      });

      skillsDoc = new Skills({
        heading,
        description,
        skillsCnt: paresdSkillsCnt,
      });
      await skillsDoc.save();
      return res.status(201).json(skillsDoc);
    } else {

      skillsDoc.skillsCnt.forEach((oldService) => {
        const stillExists = paresdSkillsCnt.some(
          (s) => s._id && s._id.toString() === oldService._id.toString()
        );
        if (!stillExists && oldService.icon) {
          deleteImageFile(oldService.icon);
        }
      });

      const updatedSkills = paresdSkillsCnt.map((skill, index) => {
        const oldService = skillsDoc.skillsCnt.find(
          s => s._id && s._id.toString() === skill._id
        );

        const uploadedFile = req.files?.find(f => f.fieldname === `icons_${index}`);

        if (uploadedFile) {
          if (oldService?.icon) deleteImageFile(oldService.icon);
          return {
            ...skill,
            icon: `${process.env.BASE_URL}/uploads/images/${uploadedFile.filename}`,
          };
        }

        return {
          ...skill,
          icon: oldService?.icon || skill.icon || "",
        };
      });

      skillsDoc.heading = heading || skillsDoc.heading;
      skillsDoc.description = description || skillsDoc.description;
      skillsDoc.skillsCnt = updatedSkills;


      await skillsDoc.save();
      return res.status(200).json(skillsDoc);
    }
  } catch (err) {
    next(err);
  }
};

export const updateSkills = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const { title, range } = req.body;

    const skillsDoc = await Skills.findOne();
    if (!skillsDoc)
      return res.status(404).json({ message: "No skills section found" });

    const skill = skillsDoc.skillsCnt.id(skillId);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (title) skill.title = title;
    if (range) skill.range = range;

    if (req.file) {
      if (skill.icon) await deleteImageFile(skill.icon);
      skill.icon = `uploads/images/${req.file.filename}`; 
    }

    await skillsDoc.save();
    res.json(skillsDoc);
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const skillsDoc = await Skills.findOne();
    if (!skillsDoc) return res.status(404).json({ message: "Skill section not found" });

    res.status(200).json(skillsDoc);
  } catch (error) {
    next(error);
  }
};



export const deleteSkill = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const skillsDoc = await Skills.findOne({});
    if (!skillsDoc)
      return res.status(404).json({ message: "Skills section not found" });

    const skillIndex = skillsDoc.skillsCnt.findIndex(
      (s) => s._id.toString() === skillId
    );
    if (skillIndex === -1)
      return res.status(404).json({ message: "Skill not found" });

    const oldIcon = skillsDoc.skillsCnt[skillIndex].icon;
    if (oldIcon) await deleteImageFile(oldIcon);

    skillsDoc.skillsCnt.splice(skillIndex, 1);
    await skillsDoc.save();
    res.json(skillsDoc);
  } catch (error) {
    next(error);
  }
};

export const deleteAllSkills = async (req, res, next) => {
  try {
    const skillsDoc = await Skills.findOne({});
    if (!skillsDoc) return res.json({ message: "No skills section to delete" });

    for (const s of skillsDoc.skillsCnt) {
      if (s.icon)  deleteImageFile(s.icon);
    }

    skillsDoc.skillsCnt = [];
    await skillsDoc.save();
    res.json({ skillsCnt: [] });
  } catch (err) {
    next(err);
  }
};
