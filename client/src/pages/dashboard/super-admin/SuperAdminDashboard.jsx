import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SuperAdminDashboard.module.css";
import useAuth from "../../../constants/useAuth";
import ProfilePhoto from "../../../assets/profile-photo.jpg";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";
import { toast } from "react-toastify";

// Importing individual page components
import DashboardPage from "./DashboardPage";
import Profile from "./Profile";
import CreateNewTask from "./CreateNewTask";
import AssignTaskToAdmin from "./AssignTaskToAdmin";
import ManageAdmins from "./ManageAdmins";
import ManageEmployees from "./ManageEmployees";
import ChatBot from "./ChatBox";
import CreateNewProject from "./CreateNewProject";

const SuperAdminDashboard = () => {
  useAuth();
  const navigate = useNavigate();
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
    { label: "Create Project", icon: "🆕" },
    { label: "Create Task", icon: "🆕" },
    { label: "Assign Task", icon: "✍️" },
    { label: "Manage Tasks", icon: "📑" },
    { label: "Manage Admins", icon: "👤" },
    { label: "Manage Employees", icon: "👥" },
  ];

  const renderPage = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <DashboardPage />;
      case "Create Project":
        return <CreateNewProject />;
      case "Create Task":
        return <CreateNewTask />;
      case "Assign Task":
        return <AssignTaskToAdmin />;
      case "Manage Admins":
        return <ManageAdmins />;
      case "Manage Employees":
        return <ManageEmployees />;
      case "Profile":
        return <Profile />;
      default:
        return <DashboardPage />;
    }
  };

  const logout = () => {
    localStorage.removeItem("tokenSuperAdmin");
    navigate("/super-admin-login");
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
        `${SERVERHOST}/api/task-manager-app/auth/change-sa-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenSuperAdmin")}`,
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

  return (
    <div className={styles.dashboardContainer}>
      <aside
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles.collapsedSidebar : ""
        }`}
      >
        <div
          className={styles.toggleIcon}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          ☰
        </div>
        <div className={styles.logo}>
          {isSidebarCollapsed ? "SA" : "SuperAdmin"}
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

      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageTitle}>
            Welcome, {profileData ? profileData.fullName : "Super-Admin"} -{" "}
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

        <div className={styles.contentArea}>
          {renderPage()} <ChatBot />
        </div>

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

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            &copy; {new Date().getFullYear()} SuperAdmin Dashboard - Designed by
            PV Softwares. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
