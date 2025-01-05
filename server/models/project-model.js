const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
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
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
module.exports.Project = Project;
