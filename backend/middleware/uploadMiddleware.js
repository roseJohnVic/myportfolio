import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs/promises"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("dirname",__dirname);
const backendDir = path.join(__dirname, "..");
console.log("backenddir",backendDir);
const uploadDir = path.join( backendDir,"uploads", "images");
console.log("upload dir",uploadDir);
async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    console.log(" Upload directory is ready at:", uploadDir);
  } catch (err) {
    console.error(" Failed to create upload directory:", err);
  }
}
ensureUploadDir();

const allowedFileTypes = [
  "image/jpeg",     
  "image/png",     
  "image/webp",   
  "image/svg+xml"  ,
  "video/mp4"
];



const fileFilter = (req, file, cb) => {
  if (!allowedFileTypes.includes(file.mimetype)) {
    const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
    error.message = "Invalid file type. Only JPEG, JPG, and PNG are allowed.";
    return cb(error, false);
  }
  cb(null, true);
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});


const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

export default upload;
