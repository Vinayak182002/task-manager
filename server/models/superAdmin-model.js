const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');

// Super Admin Schema
const superAdminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
      },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Enforce strong passwords
    },
    role: {
      type: String,
      enum: ['super-admin'],
      default: 'super-admin',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    profilePhoto: {
      type: String, // Path to the uploaded profile photo file
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
      match: [/^\+?\d{10,15}$/, 'Please fill a valid phone number'],
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    companyLeavingDate: {
      type: Date,
      default: null, // This will store the date when the super admin leaves the company
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now, // This will store the last update time
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Password Hashing Middleware
superAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password Comparison Method
superAdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create JSON Web Token (JWT)
superAdminSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id, email: this.email };
  const secretKey = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key'; // Store in environment variables for security
  const options = { expiresIn: '1h' }; // Token expires in 1 hour
  return jwt.sign(payload, secretKey, options);
};

// Multer Configuration for File Uploads (For Profile Photos)
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/profiles')); // Upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max file size
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
    }
  },
});

// Export Multer Upload Middleware
module.exports.upload = upload;

// Super Admin Model
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports.SuperAdmin = SuperAdmin;
