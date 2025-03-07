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

const getEmployeesForAdmin = async (req, res) => {
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

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Forbidden: Only Admin can view employees." });
    }

    // Fetch employees belonging to the same department as the logged-in admin
    const employees = await Employee.find({ department: admin.department });

    if (!employees || employees.length === 0) {
      return res.status(400).json({ message: "No employees found in your department." });
    }

    return res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
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

const getEmployeesById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);

    if (!employee) {
      return res.status(400).json({ message: "No employee found!" });
    }

    return res.status(200).json({ employee });
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getSuperAdminData,
  getAdminData,
  getEmployeeData,
  getAllUsersByRole,
  getEmployeesForAdmin,
  getEmployeesById,
};
