const { SuperAdmin } = require("../models/superAdmin-model");
const { Admin } = require("../models/admin-model");
const { Employee } = require("../models/employee-model");
const jwt = require("jsonwebtoken");

// Controller to get Super Admin data
const getSuperAdminData = async (req, res) => {
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
    const superAdmin = await SuperAdmin.findById(decoded.id).select(
      "-password"
    );
    if (!superAdmin)
      return res.status(404).json({ message: "Super Admin not found" });

    res.status(200).json({ success: true, data: superAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Controller to get Admin data
const getAdminData = async (req, res) => {
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
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Controller to get Employee data
const getEmployeeData = async (req, res) => {
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
    const employee = await Employee.findById(decoded.id).select("-password");
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Controller to get all users by role
const getAllUsersByRole = async (req, res) => {
  const { role } = req.params; // super-admin, admin, employee

  try {
    let users;
    switch (role) {
      case "super-admin":
        users = await SuperAdmin.find().select("-password");
        break;
      case "admin":
        users = await Admin.find().select("-password");
        break;
      case "employee":
        users = await Employee.find().select("-password");
        break;
      default:
        return res.status(400).json({ message: "Invalid role specified" });
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getSuperAdminData,
  getAdminData,
  getEmployeeData,
  getAllUsersByRole,
};
