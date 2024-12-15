import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import styles from "./SuperAdmin.module.css";
import BannerImage from "../../assets/superAdminRegistration.svg";
import { SERVERHOST } from "../../constants/constant";

const SuperAdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    console.log(SERVERHOST);
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/task-manager-app/auth/superadmin-register`,
        {
          fullName: formData.fullName,
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.statusText === "OK") {
        setFormData({
          fullName: "",
          userName: "",
          email: "",
          password: "",
        });
        localStorage.setItem("tokenSuperAdmin", response.data.token);
        toast.success("Admin Registered Successfully!");
        navigate("/super-admin-login");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message || "Invalid Credentials!");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized! Check your credentials.");
        } else {
          toast.error("Something went wrong! Please try again.");
        }
      } else {
        toast.error("Network error! Please check your connection.");
      }
      console.log("Registration Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <img
          src={BannerImage}
          alt="Super Admin Banner"
          className={styles.bannerImage}
        />
        <h1 className={styles.welcomeTitle}>Welcome to Task Manager</h1>
        <p className={styles.welcomeText}>
          Register to gain access to the ultimate management system.
        </p>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Super Admin Registration</h2>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Username */}
            <div className={styles.formGroup}>
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className={styles.togglePasswordBtn}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.registerBtn}>
                Register
              </button>
            </div>
          </form>

          {/* Link to Login Page */}
          <div className={styles.loginLinkContainer}>
            <p>
              Already have an account?{" "}
              <Link to="/super-admin-login" className={styles.loginLink}>
                Login!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegister;
