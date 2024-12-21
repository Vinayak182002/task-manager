const express = require("express");
const router2 = express.Router();
const getDataControllers = require("../controller/getData-controller");
const updateDataControllers = require("../controller/updateData-controller");

router2.route("/get-sa-data").get(getDataControllers.getSuperAdminData);
router2.route("/get-admin-data").get(getDataControllers.getAdminData);
router2.route("/get-employee-data").get(getDataControllers.getEmployeeData);
router2.route("/update-sa-data").put(updateDataControllers.updateSAInformation);
router2.route("/update-admin-data").put(updateDataControllers.updateAdminInformation);
router2.route("/update-employee-data").put(updateDataControllers.updateEmployeeInformation);

module.exports = router2;
