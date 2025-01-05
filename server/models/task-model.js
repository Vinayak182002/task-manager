const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

// Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "In-Progress", "Completed", "Rejected"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Reference to the Project model
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByRole",
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ["SuperAdmin", "Admin"],
      required: true,
    },
    initiallyAssignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "initiallyAssignedByRole",
    },
    initiallyAssignedByRole: { type: String, enum: ["SuperAdmin"] },
    initiallyAssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    initiallyAssignedToRole: { type: String, enum: ["Admin"] },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedByRole",
    },
    assignedByRole: { type: String, enum: ["Admin"] },
    assignedTo: [
      {
        employeeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          required: true,
        },
        department: {
          type: String,
          enum: [
            "application",
            "design",
            "production",
            "store",
            "quality",
            "purchase",
            "maintenance",
            "services",
          ],
          required: true,
        },
      },
    ],
    assignedToRole: { type: String, enum: ["Employee"] },
    currentDepartment: {
      type: String,
      enum: [
        "application",
        "design",
        "production",
        "store",
        "quality",
        "purchase",
        "maintenance",
        "services",
      ],
      required: true,
    },
    nextDepartment: {
      type: String,
      enum: [
        "application",
        "design",
        "production",
        "store",
        "quality",
        "purchase",
        "maintenance",
        "services",
      ],
      default: null,
    },
    submissionFiles: [
      {
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "submissionFiles.uploadedByRole",
          required: true,
        },
        uploadedByRole: {
          type: String,
          enum: ["SuperAdmin", "Employee", "Admin"],
          required: true,
        },
        fileName: { type: String, required: true },
        filePath: { type: String, required: true },
        department: {
          type: String,
          enum: [
            "application",
            "design",
            "production",
            "store",
            "quality",
            "purchase",
            "maintenance",
            "services",
          ],
          required: true,
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    approvals: [
      {
        department: {
          type: String,
          enum: [
            "application",
            "design",
            "production",
            "store",
            "quality",
            "purchase",
            "maintenance",
            "services",
          ],
          required: true,
        },
        approvedByAdmin: { type: Boolean, default: false },
        approvedAt: { type: Date, default: null },
      },
    ],
    rejections: [
      {
        department: {
          type: String,
          enum: [
            "application",
            "design",
            "production",
            "store",
            "quality",
            "purchase",
            "maintenance",
            "services",
          ],
          required: true,
        },
        rejectedByAdmin: { type: Boolean, default: false },
        rejectionReason: { type: String, default: "" },
        rejectedAt: { type: Date, default: null },
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "comments.userType",
          required: true,
        },
        userType: {
          type: String,
          enum: ["SuperAdmin", "Admin", "Employee"],
          required: true,
        },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    departmentDeadlines: [
      {
        department: {
          type: String,
          enum: [
            "application",
            "design",
            "production",
            "store",
            "quality",
            "purchase",
            "maintenance",
            "services",
          ],
          required: true,
        },
        deadline: { type: Date, required: true },
      },
    ],
    completedAt: { type: Date, default: null },
    updateLogs: [
      {
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "updateLogs.updatedByRole",
          required: true,
        },
        updatedByRole: {
          type: String,
          enum: ["SuperAdmin", "Admin", "Employee"],
          required: true,
        },
        updateDescription: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/tasks")); // Upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only images (jpeg, jpg, png) and documents (pdf, docx) are allowed"
        )
      );
    }
  },
});

// Export Multer Upload Middleware
module.exports.upload = upload;

// Task Model
const Task = mongoose.model("Task", taskSchema);

module.exports.Task = Task;
