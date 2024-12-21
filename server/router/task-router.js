const express = require("express");
const router1 = express.Router();
const zodSchema = require("../validators/task-validator");
const validate = require("../middlewares/auth-middleware");
const taskControllers = require("../controller/taskData-controller");
router1.route("/create-task").post(validate(zodSchema.createTaskSchema),taskControllers.createTask);
router1.route("/assign-task/:taskId").post(validate(zodSchema.assignTaskSchema),taskControllers.assignTask);
router1.route("/get-tasks-by-creator").get(taskControllers.getTasksByCreator);

module.exports = router1;