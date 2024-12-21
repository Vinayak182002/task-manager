import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EmployeeDashboard.module.css";
import ProfilePhoto from "../../../assets/profile-photo.jpg";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";
import { toast } from "react-toastify";

import DahboardPage from "./DashboardPage";
import Profile from "./Profile";
import useAuthEmployee from "../../../constants/useAuthEmployee";

const EmployeeDashboard = ({ department }) => {
  useAuthEmployee();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dropdownRef = useRef(null);

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        setProfileData(data); // Set profile data to state
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: "🏠" },
    { label: "Tasks", icon: "📋" },
    { label: "Reports", icon: "📊" },
    { label: "Profile", icon: "👤" },
    { label: "Settings", icon: "⚙️" },
  ];

  // Function to render the selected page dynamically
  const renderPage = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <DahboardPage />;
      case "Profile":
        return <Profile />;
      default:
        return <DahboardPage />;
    }
  };

  const logout = () => {
    localStorage.removeItem("tokenEmployee");
    navigate("/employee-login");
  };

  const handleProfileClick = () => {
    setSelectedMenu("Profile"); // Update selected menu to Profile
    setDropdownOpen(false); // Close dropdown when clicked
  };

  const openChangePasswordModal = () => {
    setModalOpen(true);
    setErrorMessage(""); // Reset error message when opening modal
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${SERVERHOST}/api/task-manager-app/auth/change-employee-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenEmployee")}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully! Please login.");
        logout();
      } else {
        setErrorMessage(data.message || "Error changing password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const getDepartmentTheme = () => {
    const themes = {
      application: "#83a3fc", // Red
      design: "#4c6dc7", // Green
      production: "#2b499c", // Blue
      store: "#112661", // Pink
      quality: "#06153f", // Orange
      purchase: "#00071c", // Light Blue
    };
    return themes[department] || "#333";
  };

  const departmentColor = getDepartmentTheme();

  return (
    <div className={`${styles.dashboardContainer} ${styles[department]}`}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles.collapsedSidebar : ""
        }`}
        style={{ backgroundColor: departmentColor }}
      >
        {/* Hamburger Icon */}
        <div
          className={styles.toggleIcon}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          ☰
        </div>
        <div className={styles.logo}>
          {isSidebarCollapsed ? "E" : "Employee"}
        </div>
        <nav className={styles.menu}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              className={`${styles.menuItem} ${
                selectedMenu === item.label ? styles.active : ""
              }`}
              onClick={() => setSelectedMenu(item.label)}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              {!isSidebarCollapsed && (
                <span className={styles.menuLabel}>{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <header
          className={styles.topBar}
          style={{ backgroundColor: departmentColor }}
        >
          {/* Department Name Displayed in the Top Bar */}
          <div className={styles.pageTitle}>
            Welcome,{" "}
            {profileData && profileData.fullName
              ? profileData.fullName
              : "Employee"}{" "}
            - {department.charAt(0).toUpperCase() + department.slice(1)}{" "}
            Department - {selectedMenu}
          </div>
          <div
            className={styles.profileSection}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={
                profileData && profileData.profilePhoto
                  ? `${SERVERHOST}${profileData.profilePhoto}`
                  : ProfilePhoto || "https://via.placeholder.com/40"
              }
              alt="Profile"
              className={styles.profileImage}
            />
            {dropdownOpen && (
              <div ref={dropdownRef} className={styles.dropdownMenu}>
                <div
                  className={styles.dropdownItem}
                  onClick={handleProfileClick}
                >
                  <span className={styles.dropdownIcon}>👤</span> Profile
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={openChangePasswordModal}
                >
                  <span className={styles.dropdownIcon}>🔑</span> Change
                  Password
                </div>
                <div className={styles.dropdownItem} onClick={logout}>
                  <span className={styles.dropdownIcon}>🚪</span> Logout
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Render Selected Page */}
        <div className={styles.contentArea}>{renderPage()}</div>
        {modalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Change Password</h2>
              <div className={styles.modalInput}>
                <label>Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className={styles.modalInput}>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className={styles.modalInput}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
              )}
              <div className={styles.modalButtons}>
                <button onClick={handleChangePassword}>Submit</button>
                <button onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {/* Footer */}
        <footer
          className={styles.footer}
          style={{ backgroundColor: departmentColor }}
        >
          <div className={styles.footerContent}>
            &copy; {new Date().getFullYear()} Employee Dashboard - Designed by
            PV Softwares. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
