const express = require("express");
const router = express.Router();
const zodSchema = require("../validators/auth-validator");
const validate = require("../middlewares/auth-middleware");
const controllers = require("../controller/auth-controller");
router.route("/home").get(controllers.home);
router.route("/superadmin-register").get(validate(zodSchema.superAdminRegisterSchema),controllers.superAdminRegister);
router.route("/superadmin-login").get(validate(zodSchema.superAdminLoginSchema),controllers.superAdminLogin);
module.exports = router;
