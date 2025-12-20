// // import multer from "multer";
// // import path from "path";
// // import sharp from "sharp";
// // import fs from "fs";

// // // ---------------- Existing Product Image Upload ----------------

// // // Ensure upload directory exists
// // const productUploadDir = path.join("uploads", "products");
// // if (!fs.existsSync(productUploadDir)) {
// //   fs.mkdirSync(productUploadDir, { recursive: true });
// // }

// // // Multer config: store in memory for products
// // const productStorage = multer.memoryStorage();

// // const productFileFilter = (req, file, cb) => {
// //   if (file.mimetype.startsWith("image/")) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only image files are allowed"), false);
// //   }
// // };

// // export const uploadMultiple = multer({ storage: productStorage, fileFilter: productFileFilter });

// // // Compress images middleware for products
// // export const compressImages = async (req, res, next) => {
// //   try {
// //     if (!req.files || req.files.length === 0) return next();

// //     const compressedImages = [];

// //     for (const file of req.files) {
// //       const safeName = file.originalname.replace(/\s+/g, "_");
// //       const filename = `image-${Date.now()}-${safeName}`;
// //       const outputPath = path.join(productUploadDir, filename);

// //       await sharp(file.buffer)
// //         .resize(800)
// //         .jpeg({ quality: 70 })
// //         .toFile(outputPath);

// //       compressedImages.push(filename);
// //     }

// //     req.compressedImages = compressedImages;
// //     next();
// //   } catch (err) {
// //     console.error("Image compression error:", err);
// //     res.status(500).json({ error: "Image processing failed" });
// //   }
// // };

// // // ---------------- New Company Certification Upload ----------------

// // const companyUploadDir = path.join("uploads", "certifications");
// // if (!fs.existsSync(companyUploadDir)) {
// //   fs.mkdirSync(companyUploadDir, { recursive: true });
// // }

// // const companyStorage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, companyUploadDir);
// //   },
// //   filename: (req, file, cb) => {
// //     const ext = path.extname(file.originalname);
// //     const safeName = file.originalname.replace(/\s+/g, "_");
// //     cb(null, `${Date.now()}-${safeName}${ext}`);
// //   },
// // });

// // const companyFileFilter = (req, file, cb) => {
// //   const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
// //   const ext = path.extname(file.originalname).toLowerCase();
// //   if (!allowed.includes(ext)) {
// //     return cb(new Error("Only PDF/JPG/PNG files allowed!"), false);
// //   }
// //   cb(null, true);
// // };

// // // Exported Multer middleware for company certification
// // export const uploadCompanyCertification = multer({
// //   storage: companyStorage,
// //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// //   fileFilter: companyFileFilter,
// // });


// import multer from "multer";
// import path from "path";
// import sharp from "sharp";
// import fs from "fs

// const productUploadDir = path.join("uploads", "products");
// if (!fs.existsSync(productUploadDir)) {
//   fs.mkdirSync(productUploadDir, { recursive: true });
// }

// // ✅ Store files in memory first
// const productStorage = multer.memoryStorage();

// // ✅ Allow only images
// const productFileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only image files are allowed"), false);
// };

// // ✅ Multer upload (key name must be "images")
// export const uploadMultiple = multer({
//   storage: productStorage,
//   fileFilter: productFileFilter,
// }).array("images", 5); // 👈 field name must match frontend

// // ✅ Compression middleware
// export const compressImages = async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) return next();

//     const compressedFiles = [];

//     for (const file of req.files) {
//       const safeName = file.originalname.replace(/\s+/g, "_");
//       const filename = `product-${Date.now()}-${safeName}`;
//       const outputPath = path.join(productUploadDir, filename);

//       await sharp(file.buffer)
//         .resize(800) // adjust resolution
//         .jpeg({ quality: 70 })
//         .toFile(outputPath);

//       compressedFiles.push({
//         filename,
//         path: outputPath,
//       });
//     }

//     // ✅ Attach compressed images to request
//     req.savedImages = compressedFiles;
//     next();
//   } catch (err) {
//     console.error("Image compression error:", err);
//     res.status(500).json({ message: "Image processing failed" });
//   }
// };



import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";

// ============================================================
// 🟢 PRODUCT IMAGE UPLOAD + COMPRESSION
// ============================================================

// Ensure upload directory exists
const productUploadDir = path.join("uploads", "products");
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

// Store files in memory first (for compression)
const productStorage = multer.memoryStorage();

// Allow only images
const productFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

// Multer setup for multiple product images
export const uploadMultiple = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
}).array("images", 5); // field name from frontend

// Compress images before saving to disk
export const compressImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    const compressedFiles = [];

    for (const file of req.files) {
      const safeName = file.originalname.replace(/\s+/g, "_");
      const filename = `product-${Date.now()}-${safeName}`;
      const outputPath = path.join(productUploadDir, filename);

      // Resize and compress
      await sharp(file.buffer)
        .resize(800) // adjust image width
        .jpeg({ quality: 70 }) // reduce size
        .toFile(outputPath);

      compressedFiles.push({
        filename,
        path: outputPath,
      });
    }

    // Attach processed images to req
    req.savedImages = compressedFiles;
    next();
  } catch (err) {
    console.error("Image compression error:", err);
    res.status(500).json({ message: "Image processing failed" });
  }
};

// ============================================================
// 🟣 COMPANY CERTIFICATION UPLOAD
// ============================================================

// Ensure directory exists
const companyUploadDir = path.join("uploads", "certifications");
if (!fs.existsSync(companyUploadDir)) {
  fs.mkdirSync(companyUploadDir, { recursive: true });
}

// Disk storage (no compression for PDFs/JPGs)
// const companyStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, companyUploadDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const safeName = file.originalname.replace(/\s+/g, "_");
//     cb(null, `${Date.now()}-${safeName}${ext}`);
//   },
// });

const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, companyUploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`); // ✅ clean and safe
  },
});


// Allow only PDF, JPG, PNG
const companyFileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext))
    return cb(new Error("Only PDF/JPG/PNG files are allowed!"), false);
  cb(null, true);
};

// Multer setup for company certification
export const uploadCompanyCertification = multer({
  storage: companyStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: companyFileFilter,
});
