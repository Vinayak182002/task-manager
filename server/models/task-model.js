const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In-Progress', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'createdByRole', // Dynamic reference for SuperAdmin or Admin
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ['SuperAdmin', 'Admin'],
      required: true,
    },
    initiallyAssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // The first admin assigned by the super-admin
      default: null,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'assignedByRole',
    },
    assignedByRole: {
      type: String,
      enum: ['SuperAdmin', 'Admin'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'assignedToRole', // Dynamic reference for Admin or Employee
    },
    assignedToRole: {
      type: String,
      enum: ['Admin', 'Employee'],
    },
    currentDepartment: {
      type: String,
      enum: ['application', 'design', 'production', 'store', 'quality', 'purchase'],
      required: true,
    },
    nextDepartment: {
      type: String,
      enum: ['application', 'design', 'production', 'store', 'quality', 'purchase'],
      default: null,
    },
    submissionFiles: [
      {
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'submissionFiles.uploadedByRole', // Dynamic reference for Employee or Admin
          required: true,
        },
        uploadedByRole: {
          type: String,
          enum: ['Employee', 'Admin'],
          required: true,
        },
        fileName: { type: String, required: true },
        filePath: { type: String, required: true },
        department: {
          type: String,
          enum: ['application', 'design', 'production', 'store', 'quality', 'purchase'],
          required: true,
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    approvals: [
      {
        department: {
          type: String,
          enum: ['application', 'design', 'production', 'store', 'quality', 'purchase'],
          required: true,
        },
        approvedByAdmin: {
          type: Boolean,
          default: false,
        },
        approvedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    rejections: [
        {
            department: {
              type: String,
              enum: ['application', 'design', 'production', 'store', 'quality', 'purchase'],
              required: true,
            },
            rejectedByAdmin: {
              type: Boolean,
              default: false,
            },
            rejectionReason:{
                type: String,
                default: '',
            },
            rejectedAt: {
              type: Date,
              default: null,
            },
          },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'comments.userType',
          required: true,
        },
        userType: {
          type: String,
          enum: ['SuperAdmin', 'Admin', 'Employee'],
          required: true,
        },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    deadline: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/tasks')); // Upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) and documents (pdf, docx) are allowed'));
    }
  },
});

// Export Multer Upload Middleware
module.exports.upload = upload;

// Task Model
const Task = mongoose.model('Task', taskSchema);

module.exports.Task = Task;
