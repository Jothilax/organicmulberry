// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure upload folder exists
// const uploadDir = path.join("uploads", "products");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const safeName = file.originalname.replace(/\s+/g, "_");
//     cb(null, `${Date.now()}-${safeName}${ext}`);
//   },
// });

// // Allow only image files
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only image files are allowed"), false);
// };

// // Export multiple file upload handler
// export const uploadMultiple = multer({
//   storage,
//   fileFilter,
// }).array("images", 5); // "images" → form-data key in Postman


// middleware/productupload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads", "products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const safeName = name.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${safeName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const multerConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

// Export the multer middleware with error handling wrapper
const uploadMultipleRaw = multerConfig.array("images", 5); // key name in Postman = "images"

// Wrapper middleware to handle multer errors
export const uploadMultiple = (req, res, next) => {
  uploadMultipleRaw(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ 
          message: "File too large. Maximum size is 10MB per file." 
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({ 
          message: "Too many files. Maximum 5 images allowed." 
        });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ 
          message: "Unexpected file field. Use 'images' as the field name." 
        });
      }
      return res.status(400).json({ 
        message: "File upload error", 
        error: err.message 
      });
    }
    
    if (err) {
      // Handle file filter errors
      if (err.message === "Only image files are allowed") {
        return res.status(400).json({ 
          message: "Invalid file type. Only image files are allowed." 
        });
      }
      return res.status(400).json({ 
        message: "Upload error", 
        error: err.message 
      });
    }
    
    next();
  });
};

// Error handling middleware for other upload errors (if needed)
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ 
        message: "File too large. Maximum size is 10MB per file." 
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ 
        message: "Too many files. Maximum 5 images allowed." 
      });
    }
    return res.status(400).json({ 
      message: "File upload error", 
      error: err.message 
    });
  }
  next(err);
};
