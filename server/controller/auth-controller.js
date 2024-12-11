const { SuperAdmin } = require("../models/superAdmin-model");

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
      userId: superAdmin._id.toString()
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

module.exports = { home, superAdminRegister, superAdminLogin };
