import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import useAuthAdmin from "../../../constants/useAuthAdmin";
import ProfilePhoto from "../../../assets/profile-photo.jpg";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";
import { toast } from "react-toastify";

// Importing individual page components
import DashboardPage from "./DashboardPage";
import Profile from "./Profile";
import CreateNewTask from "./CreateNewTask";
import AssignTask from "./AssignTask";
import ManageTasks from "./ManageTasks";

const AdminDashboard = ({ department }) => {
  const navigate = useNavigate();
  useAuthAdmin();
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []);

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
    { label: "Create Task", icon: "🆕" },
    { label: "Assign Task", icon: "✍️" },
    { label: "Reports", icon: "📊" },
    { label: "Settings", icon: "⚙️" },
  ];

  const logout = () => {
    localStorage.removeItem("tokenAdmin");
    navigate("/admin-login");
  };

  const handleProfileClick = () => {
    setSelectedMenu("Profile");
    setDropdownOpen(false);
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
        `${SERVERHOST}/api/task-manager-app/auth/change-admin-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
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

  // Function to render the selected page dynamically
  const renderPage = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <DashboardPage />;
      case "Create Task":
        return <CreateNewTask />;
        case "Assign Task":
        return <AssignTask />;
      case "Profile":
        return <Profile />;
      // case "Manage Tasks":
      //   return <TaskTable />;
      default:
        return <DashboardPage />;
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
        <div className={styles.logo}>{isSidebarCollapsed ? "A" : "Admin"}</div>
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
          <div className={styles.pageTitle}>
            Welcome, {profileData ? profileData.fullName : "Admin"} -{" "}
            {department.charAt(0).toUpperCase() + department.slice(1)}
            {" Department "}
            {selectedMenu}
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
            &copy; {new Date().getFullYear()} Admin Dashboard - Designed by PV
            Softwares. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
