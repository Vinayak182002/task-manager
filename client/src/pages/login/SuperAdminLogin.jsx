import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./SuperAdminLogin.module.css"; // You can reuse the existing styles
import BannerImage from "../../assets/superAdminLogin.svg"; // You can use a similar banner image
import { SERVERHOST } from "../../constants/constant";
import useAuth from "../../constants/useAuth";

const SuperAdminLogin = () => {
 useAuth();
 const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/superadmin-login`,
        {
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
        localStorage.setItem("tokenSuperAdmin", response.data.token);
        toast.success("Login successful!");
        navigate("/home");
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
      console.log("Login Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <img
          src={BannerImage}
          alt="Super Admin Login"
          className={styles.bannerImage}
        />
        <h1 className={styles.welcomeTitle}>Welcome Back to Task Manager</h1>
        <p className={styles.welcomeText}>
          Login to continue managing the task flow.
        </p>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Super Admin Login</h2>
          <form onSubmit={handleSubmit}>
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
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
