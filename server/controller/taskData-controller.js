const jwt = require("jsonwebtoken");
const { SuperAdmin } = require("../models/superAdmin-model");
const { Admin } = require("../models/admin-model");
const { Employee } = require("../models/employee-model");
const { Task } = require("../models/task-model");

// Controller to create a new task
const createTask = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Decode the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "your_jwt_secret_key"
    );

    // Search for the user in SuperAdmin or Admin collection
    let user = await SuperAdmin.findById(decoded.id);
    let createdByRole = "SuperAdmin";

    if (!user) {
      user = await Admin.findById(decoded.id);
      createdByRole = "Admin";
    }

    // If no user is found in either collection
    if (!user) {
      return res
        .status(401)
        .json({
          message: "Forbidden: Only Super Admin or Admin can create tasks.",
        });
    }

    const { title, description, priority, deadline, currentDepartment } =
      req.body;

    // Validation: Only SuperAdmin and Admin can create tasks
    if (!["SuperAdmin", "Admin"].includes(createdByRole)) {
      return res
        .status(401)
        .json({ message: "You are not authorized to create tasks." });
    }

    // Prepare the task data
    const taskData = {
      title,
      description,
      priority: priority || "Medium", // Default to Medium if not provided
      deadline,
      createdBy: user._id,
      createdByRole,
      currentDepartment,
      status: "Pending",
    };

    // Create the task
    const newTask = new Task(taskData);
    await newTask.save();

    return res.status(200).json({
      message: "Task created successfully.",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Controller to assign a task
const assignTask = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Decode the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "your_jwt_secret_key"
    );

    // Search for the user in SuperAdmin or Admin collection
    let user = await SuperAdmin.findById(decoded.id);
    let userRole = "SuperAdmin";

    if (!user) {
      user = await Admin.findById(decoded.id);
      userRole = "Admin";
    }

    // If no user is found in either collection
    if (!user) {
      return res
        .status(401)
        .json({
          message: "Forbidden: Only Super Admin or Admin can assign tasks.",
        });
    }

    const { taskId } = req.params; // Task ID from URL params
    const { assignedToName } = req.body; // Only name of the user being assigned

    // Fetch the task to be assigned
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ message: "Task not found." });
    }

    // SuperAdmin assigning the task
    if (task.createdByRole === "SuperAdmin" && userRole === "SuperAdmin") {
      // Look for Admin by name
      const admin = await Admin.findOne({ fullName: assignedToName });
      if (!admin) {
        return res
          .status(400)
          .json({ message: "Admin not found with the provided name." });
      }

      // Update task fields for initial assignment
      task.initiallyAssignedTo = admin._id; // Admin's ID
      task.assignedBy = user._id;
      task.assignedByRole = "SuperAdmin";
      task.assignedToRole = "Admin";

      await task.save();

      return res.status(200).json({
        message: "Task successfully assigned to Admin.",
        task,
      });
    }

    // Admin assigning the task
    if (task.createdByRole === "Admin" && userRole === "Admin") {
      // Look for Employee by name
      const employee = await Employee.findOne({
        fullName: assignedToName,
        department: task.currentDepartment,
      });
      if (!employee) {
        return res
          .status(400)
          .json({
            message:
              "Employee not found in the current department with the provided name.",
          });
      }

      // Update task fields for assignment
      task.assignedBy = user._id;
      task.assignedByRole = "Admin";
      task.assignedTo = employee._id; // Employee's ID
      task.assignedToRole = "Employee";

      await task.save();

      return res.status(200).json({
        message: "Task successfully assigned to Employee.",
        task,
      });
    }

    // If none of the above conditions match
    return res
      .status(401)
      .json({ message: "You are not authorized to assign this task." });
  } catch (error) {
    console.error("Error assigning task:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getTasksByCreator = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Decode the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "your_jwt_secret_key"
    );

    // Search for the user in SuperAdmin or Admin collection
    let user = await SuperAdmin.findById(decoded.id);
    let createdByRole = "SuperAdmin";

    if (!user) {
      user = await Admin.findById(decoded.id);
      createdByRole = "Admin";
    }

    // If no user is found in either collection
    if (!user) {
      return res
        .status(401)
        .json({
          message: "Forbidden: Only Super Admin or Admin can view tasks.",
        });
    }

    // Fetch tasks created by the logged-in user
    const tasks = await Task.find({ createdBy: user._id, createdByRole })
      .sort({ createdAt: -1 }) // Sort tasks by creation date (most recent first)

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found." });
    }

    return res.status(200).json({
      message: "Tasks fetched successfully.",
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Export the controllers
module.exports = {
  createTask,
  assignTask,
  getTasksByCreator,
};
