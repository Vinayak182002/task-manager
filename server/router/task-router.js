const express = require("express");
const router1 = express.Router();
const zodSchema = require("../validators/task-validator");
const validate = require("../middlewares/auth-middleware");
const taskControllers = require("../controller/taskData-controller");
router1.route("/create-task").post(validate(zodSchema.createTaskSchema),taskControllers.createTask);
router1.route("/create-project").post(validate(zodSchema.createProjectSchema),taskControllers.createProject);
router1.route("/get-projects").get(taskControllers.getProjects);
router1.route("/assign-task/:taskId").post(validate(zodSchema.assignTaskSchema),taskControllers.assignTask);
router1.route("/get-tasks-by-creator").get(taskControllers.getTasksByCreator);
router1.route("/get-tasks-assigned-to-admin").get(taskControllers.getTasksAssignedToAdmin);
router1.route("/get-assigned-employees/:taskId").get(taskControllers.getAssignedEmployeesForTask);
router1.route("/get-tasks-assigned-to-employee/:employeeId").get(taskControllers.getTasksByEmployee);
router1.route("/get-tasks-by-project/:projectId").get(taskControllers.getTasksByProject);
router1.route("/submit-task-by-employee/:taskId").post(taskControllers.submitTaskByEmployee);
router1.route("/validate-submission-by-employee/:taskId/:employeeId").patch(taskControllers.validateSubmissionByEmployee);
router1.route("/delete-submission-by-employee/:taskId/:employeeId").delete(taskControllers.deleteSubmissionByEmployee);
module.exports = router1;