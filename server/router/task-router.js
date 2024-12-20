const express = require("express");
const router1 = express.Router();
const zodSchema = require("../validators/task-validator");
const validate = require("../middlewares/auth-middleware");
const taskControllers = require("../controller/taskData-controller");
router1.route("/create-task").get(validate(zodSchema.createTaskSchema),taskControllers.createTask);
router1.route("/assign-task/:taskId").get(validate(zodSchema.assignTaskSchema),taskControllers.assignTask);

module.exports = router1;