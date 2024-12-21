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
    phoneNumber: {
      type: String,
      default: '',
      match: [/^\+?\d{10,15}$/, 'Please fill a valid phone number'],
    },
    profilePhoto: {
      type: String, // Store the photo URL or path
      default: '', // Default to an empty string if no photo is uploaded
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
  const options = { expiresIn: '3h' }; // Token expires in 3 hour
  return jwt.sign(payload, secretKey, options);
};

// Super Admin Model
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports.SuperAdmin = SuperAdmin;
