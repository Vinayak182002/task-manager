const { SuperAdmin } = require("../models/superAdmin-model");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/profilePhotos");
    cb(null, uploadPath); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
}).single("profilePhoto"); // Accept a single file with the field name 'profilePhoto'

// Update Super Admin Information Controller
const updateSAInformation = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "your_jwt_secret_key");
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }

  try {
    const superAdminId = decoded.id;

    // Use multer to handle file uploads
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "Error uploading file", error: err.message });
      }

      const { fullName, userName, email, phoneNumber, address, description } = req.body;

      // Fetch existing SuperAdmin record
      const existingSuperAdmin = await SuperAdmin.findById(superAdminId);
      if (!existingSuperAdmin) {
        return res.status(400).json({ message: "Super Admin not found" });
      }

      // Construct updated data
      const updatedData = {
        fullName: fullName || existingSuperAdmin.fullName,
        userName: userName || existingSuperAdmin.userName,
        email: email || existingSuperAdmin.email,
        phoneNumber: phoneNumber || existingSuperAdmin.phoneNumber,
        address: address ? JSON.parse(address) : existingSuperAdmin.address,
        description: description || existingSuperAdmin.description,
        profilePhoto: req.file ? `/uploads/profilePhotos/${req.file.filename}` : existingSuperAdmin.profilePhoto,
        updatedAt: Date.now(),
      };

      // Delete old profile photo if a new one is uploaded
      if (req.file && existingSuperAdmin.profilePhoto) {
        const oldPhotoPath = path.join(__dirname, `../${existingSuperAdmin.profilePhoto}`);
        fs.unlink(oldPhotoPath, (err) => {
          if (err) {
            console.error(`Failed to delete old profile photo: ${err.message}`);
          }
        });
      }

      // Update the super admin's information in the database
      const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(superAdminId, updatedData, { new: true });

      return res.status(200).json({
        message: "Profile updated successfully",
        superAdmin: updatedSuperAdmin,
      });
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

module.exports = { updateSAInformation };
