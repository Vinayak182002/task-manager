const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Department Admin Schema
const adminSchema = new mongoose.Schema(
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
      enum: ['admin'],
      default: 'admin',
    },
    department: {
      type: String,
      enum: ['application', 'design', 'production', 'store', 'quality', 'purchase','maintenance','services'],
      required: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    profilePhoto: {
      type: String, // Store the photo URL or path
      default: '', // Default to an empty string if no photo is uploaded
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
      default: null, // This will store the date when the admin leaves the company
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
adminSchema.pre('save', async function (next) {
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
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create JSON Web Token (JWT)
adminSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id, email: this.email, role: this.role, department: this.department };
  const secretKey = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key'; // Store in environment variables for security
  const options = { expiresIn: '1h' }; // Token expires in 1 hour
  return jwt.sign(payload, secretKey, options);
};

// Department Admin Model
const Admin = mongoose.model('Admin', adminSchema);

module.exports.Admin = Admin;
