const { SuperAdmin } = require("../models/superAdmin-model");
const { Admin } = require("../models/admin-model");
const { Employee } = require("../models/employee-model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const home = async (req, res) => {
  try {
    res.status(200).send("Hi router from contro");
  } catch (error) {
    console.log(error);
  }
};

const superAdminRegister = async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  try {
    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const superAdmin = new SuperAdmin({
      fullName,
      userName,
      email,
      password,
      role: "super-admin", // Default role
    });

    // Save the new SuperAdmin to the database
    await superAdmin.save();

    // Generate JWT token
    const token = superAdmin.generateAuthToken();

    // Respond with the JWT token and success message
    return res.status(200).json({
      message: "Super Admin registered successfully",
      token, // Return the generated token
      userId: superAdmin._id.toString(),
    });
  } catch (error) {
    // console.error("Error registering super admin:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const isPasswordValid = await superAdmin.comparePassword(password);
    if (isPasswordValid) {
      res.status(200).json({
        message: "Login Successful",
        token: await superAdmin.generateAuthToken(),
        userId: superAdmin._id.toString(),
      });
    } else {
      res.status(400).json({ message: "Invalid email or password " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in login!" });
  }
};

// Controller for changing the Super Admin's password
const changeSuperAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Verify Super Admin Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'your_jwt_secret_key');
    const superAdmin = await SuperAdmin.findById(decoded.id);
    if (!superAdmin) {
      return res.status(403).json({ message: 'Forbidden: Only Super Admin can perform this action' });
    }

    // Check if the old password matches
    const isOldPasswordValid = await superAdmin.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Update the password
    superAdmin.password = newPassword;
    await superAdmin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      message: 'Error changing password',
      error: error.message,
    });
  }
};


// Controller to register a new department admin
const registerDepartmentAdmin = async (req, res) => {
  const { fullName, email, department } = req.body;

  try {
    // Verify Super Admin Authorization
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
    const superAdmin = await SuperAdmin.findById(decoded.id);
    if (!superAdmin) {
      return res
        .status(403)
        .json({
          message: "Forbidden: Only Super Admin can perform this action",
        });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    // Generate a random password
    const generateRandomPassword = () => {
      return Math.random().toString(36).slice(-8); // Generates an 8-character random password
    };
    const plainPassword = generateRandomPassword();

    // Create new admin
    const newAdmin = new Admin({
      fullName,
      email,
      password: plainPassword,
      department,
      userName:
        fullName.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-5), // Generate userName based on fullName
    });

    await newAdmin.save();

    const tokenAdmin = newAdmin.generateAuthToken(); // Generate JWT token for new admin
    res.status(200).json({
      success: true,
      message: "Admin registered successfully. Credentials sent to email.",
      data: { fullName, email, department, plainPassword },
      tokenAdmin,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({
      success: false,
      message: "Error registering admin",
      error: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const isPasswordValid = await admin.comparePassword(password);
    if (isPasswordValid) {
      res.status(200).json({
        message: "Login Successful",
        token: await admin.generateAuthToken(),
        userId: admin._id.toString(),
      });
    } else {
      res.status(400).json({ message: "Invalid email or password " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in login!" });
  }
};

// Controller for changing the Admin's password
const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Verify Admin Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'your_jwt_secret_key');
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: 'Forbidden: Only Admin can perform this action' });
    }

    // Check if the old password matches
    const isOldPasswordValid = await admin.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Update the password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      message: 'Error changing password',
      error: error.message,
    });
  }
};


// Controller to register a new employee for a department
const registerEmployee = async (req, res) => {
  const { fullName, email, department } = req.body;

  try {
    // Verify Admin Authorization
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
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res
        .status(403)
        .json({ message: "Forbidden: Only Admin can perform this action" });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    // Generate a random password for the employee
    const generateRandomPassword = () => {
      return Math.random().toString(36).slice(-8); // Generates an 8-character random password
    };
    const plainPassword = generateRandomPassword();

    // Create new employee
    const newEmployee = new Employee({
      fullName,
      email,
      password: plainPassword, // Save plain password temporarily to hash it later
      department,
      userName:
        fullName.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-5), // Generate userName based on fullName
    });

    await newEmployee.save();

    const tokenEmployee = newEmployee.generateAuthToken(); // Generate JWT token for new employee
    res.status(200).json({
      success: true,
      message: "Employee registered successfully. Credentials sent to email.",
      data: { fullName, email, department, plainPassword },
      tokenEmployee,
    });
  } catch (error) {
    console.error("Error registering employee:", error);
    res.status(500).json({
      success: false,
      message: "Error registering employee",
      error: error.message,
    });
  }
};

// Controller for employee login
const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with the hashed password stored in the database
    const isPasswordValid = await employee.comparePassword(password);
    if (isPasswordValid) {
      res.status(200).json({
        employee,
        message: "Login Successful",
        token: await employee.generateAuthToken(),
        userId: employee._id.toString(),
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in login!" });
  }
};

// Controller for changing the Employee's password
const changeEmployeePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Verify Employee Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'your_jwt_secret_key');
    const employee = await Employee.findById(decoded.id);
    if (!employee) {
      return res.status(403).json({ message: 'Forbidden: Only Employee can perform this action' });
    }

    // Check if the old password matches
    const isOldPasswordValid = await employee.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Update the password
    employee.password = newPassword;
    await employee.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      message: 'Error changing password',
      error: error.message,
    });
  }
};



module.exports = {
  home,
  superAdminRegister,
  superAdminLogin,
  changeSuperAdminPassword,
  registerDepartmentAdmin,
  adminLogin,
  changeAdminPassword,
  registerEmployee,
  employeeLogin,
  changeEmployeePassword,
};
