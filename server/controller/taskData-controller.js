const jwt = require("jsonwebtoken");
const { SuperAdmin } = require("../models/superAdmin-model");
const { Admin } = require("../models/admin-model");
const { Employee } = require("../models/employee-model");
const { Task } = require("../models/task-model");
const {Project} = require("../models/project-model");

// Create Project Controller
const createProject = async (req, res) => {
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
    let projectCreatedByRole = "SuperAdmin";

    if (!user) {
      user = await Admin.findById(decoded.id);
      projectCreatedByRole = "Admin";
    }

    // If no user is found in either collection
    if (!user) {
      return res.status(401).json({
        message: "Forbidden: Only Super Admin or Admin can create tasks.",
      });
    }

    const { name, description} = req.body;

    // Create new project
    const newProject = new Project({
      name,
      description,
      createdBy: user._id,
      createdByRole: projectCreatedByRole,
    });

    // Save project to database
    await newProject.save();

    res
      .status(200)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getProjects = async (req, res) => {
  try {
    // Fetch tasks created by the logged-in user
    const projects = await Project.find().sort({
      createdAt: -1,
    }); // Sort tasks by creation date (most recent first)

    if (!projects || projects.length === 0) {
      return res.status(400).json({ message: "No projects found." });
    }

    return res.status(200).json({
      message: "Projects fetched successfully.",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

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
      return res.status(401).json({
        message: "Forbidden: Only Super Admin or Admin can create tasks.",
      });
    }

    const { title, description, priority, projectId, departmentDeadlines, currentDepartment } =
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
      projectId,
      priority: priority || "Medium", // Default to Medium if not provided
      departmentDeadlines,
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "your_jwt_secret_key"
    );

    // Determine user role and retrieve user information
    let user = await SuperAdmin.findById(decoded.id);
    let userRole = user ? "SuperAdmin" : "Admin";

    if (!user) {
      user = await Admin.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { taskId } = req.params;
    const { assignedToIds } = req.body;

    if (!Array.isArray(assignedToIds) || assignedToIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No admin or employee IDs provided for assignment." });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (userRole === "SuperAdmin") {
      const admin = await Admin.findById(assignedToIds[0]);
      if (!admin) {
        return res.status(400).json({ message: "Admin not found." });
      }

      task.initiallyAssignedTo = admin._id;
      task.initiallyAssignedBy = user._id;
      task.initiallyAssignedByRole = "SuperAdmin";
      task.initiallyAssignedToRole = "Admin";
      task.updateLogs.push({
        updatedBy: user._id,
        updatedByRole: "SuperAdmin",
        updateDescription: `Assigned task to Admin: ${admin.fullName}`,
      });

      await task.save();
      return res
        .status(200)
        .json({ message: "Task assigned successfully to Admin.", task });
    } else if (userRole === "Admin") {
      const employees = await Employee.find({
        _id: { $in: assignedToIds },
        department: task.currentDepartment,
      });

      if (employees.length === 0) {
        return res
          .status(400)
          .json({ message: "No valid employees found for assignment." });
      }

      const newAssignments = employees.map((employee) => ({
        employeeId: employee._id,
        department: task.currentDepartment,
      }));

      task.assignedTo.push(...newAssignments);
      task.assignedBy = user._id;
      task.assignedByRole = "Admin";
      task.assignedToRole = "Employee";
      task.updateLogs.push({
        updatedBy: user._id,
        updatedByRole: "Admin",
        updateDescription: `Assigned task to Employees: ${employees
          .map((emp) => emp.fullName)
          .join(", ")}`,
      });

      await task.save();
      return res
        .status(200)
        .json({ message: "Task assigned successfully to Employees.", task });
    }

    return res.status(403).json({ message: "Unauthorized to assign tasks." });
  } catch (error) {
    console.error("Error assigning task:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
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
      return res.status(401).json({
        message: "Forbidden: Only Super Admin or Admin can view tasks.",
      });
    }

    // Fetch tasks created by the logged-in user
    const tasks = await Task.find({ createdBy: user._id, createdByRole }).sort({
      createdAt: -1,
    }); // Sort tasks by creation date (most recent first)

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ message: "No tasks found." });
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

const getTasksAssignedToAdmin = async (req, res) => {
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

    user = await Admin.findById(decoded.id);

    // If no user is found in either collection
    if (!user) {
      return res.status(401).json({
        message: "Forbidden: Only Admin can view tasks.",
      });
    }

    // Fetch tasks created by the logged-in user
    const tasks = await Task.find({ initiallyAssignedTo: user._id }).sort({
      createdAt: -1,
    }); // Sort tasks by creation date (most recent first)

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ message: "No tasks found." });
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

const getAssignedEmployeesForTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the task by its ID and populate the assignedTo field to get employee details
    const task = await Task.findById(taskId).populate({
      path: "assignedTo.employeeId",
      select: "fullName email", // Select the fields you need for employees
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Extract the assigned employees
    const assignedEmployees = task.assignedTo.map(
      (assignment) => assignment.employeeId
    );

    return res.status(200).json({ employees: assignedEmployees });
  } catch (error) {
    console.error("Error fetching assigned employees:", error.message);
    return res
      .status(500)
      .json({ message: "Error fetching assigned employees." });
  }
};

const getTasksByEmployee = async (req, res) => {
  const { employeeId } = req.params; // Get the employeeId from the request parameters

  try {
    // Find tasks where employeeId is in the assignedTo array
    const tasks = await Task.find({
      "assignedTo.employeeId": employeeId, // Match the employeeId in the assignedTo array
    });
    // .populate([
    //   { path: "assignedTo.employeeId", select: "name email" }, // Populate employee details (e.g., name, email)
    //   { path: "assignedBy", select: "name email" }, // Populate assignedBy details (e.g., name, email)
    //   { path: "projectId", select: "title" }, // Populate the project details (e.g., project title)
    // ]);

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }

    // Send the tasks in the response
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

const getTasksByProject = async (req, res) => {
  const { projectId } = req.params; // Get the employeeId from the request parameters

  try {
    // Find tasks where employeeId is in the assignedTo array
    const tasks = await Task.find({
      "projectId": projectId, // Match the employeeId in the assignedTo array
    });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this project" });
    }

    // Send the tasks in the response
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// Export the controllers
module.exports = {
  createProject,
  createTask,
  assignTask,
  getTasksByCreator,
  getTasksAssignedToAdmin,
  getAssignedEmployeesForTask,
  getProjects,
  getTasksByEmployee,
  getTasksByProject
};
