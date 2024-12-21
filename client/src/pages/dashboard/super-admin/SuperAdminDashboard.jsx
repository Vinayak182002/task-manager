import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SuperAdminDashboard.module.css";
import useAuth from "../../../constants/useAuth";
import ProfilePhoto from "../../../assets/profile-photo.jpg";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";

// Importing individual page components
import DashboardPage from "./DashboardPage";
import Profile from "./Profile";
import CreateNewTask from "./CreateNewTask";
import AssignTaskToAdmin from "./AssignTaskToAdmin";
import ManageAdmins from "./ManageAdmins";
import ManageEmployees from "./ManageEmployees";
// import ManageAdminsPage from "./ManageAdminsPage/ManageAdminsPage";
// import ManageEmployeesPage from "./ManageEmployeesPage/ManageEmployeesPage";
// import ReportsPage from "./ReportsPage/ReportsPage";
// import SettingsPage from "./SettingsPage/SettingsPage";

const SuperAdminDashboard = () => {
  useAuth();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profileData, setProfileData] = useState(null); // State to store profile data
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
    { label: "Create Task", icon: "➕" },
    { label: "Assign Task", icon: "➕" },
    { label: "Manage Admins", icon: "👤" },
    { label: "Manage Employees", icon: "👥" },
    // { label: "Reports", icon: "📊" },
    // { label: "Settings", icon: "⚙️" },
  ];

  // Function to render the selected page dynamically
  const renderPage = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <DashboardPage />;
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
    setSelectedMenu("Profile"); // Update selected menu to Profile
    setDropdownOpen(false); // Close dropdown when clicked
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.pageTitle}>
            Welcome,{" "}
            {profileData && profileData.fullName
              ? profileData.fullName
              : "Super-Admin"}{" "}
            - {selectedMenu}
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
                <div className={styles.dropdownItem} onClick={logout}>
                  <span className={styles.dropdownIcon}>🚪</span> Logout
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Render Selected Page */}
        <div className={styles.contentArea}>{renderPage()}</div>

        {/* Footer */}
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
