import fs from "fs";
import path from "path";

export const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;

  try {
    const relativePath = imageUrl.replace(`${process.env.BASE_URL}/`, "");
    const fullPath = path.join(path.resolve(), relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Error deleting file:", fullPath, err);
        } else {
          console.log(" Deleted file:", fullPath);
        }
      });
    } else {
      console.warn("File not found:", fullPath);
    }
  } catch (err) {
    console.error("deleteImageFile error:", err);
  }
};
