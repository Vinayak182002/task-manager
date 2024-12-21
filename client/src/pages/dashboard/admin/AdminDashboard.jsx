import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import useAuthAdmin from "../../../constants/useAuthAdmin";
import ProfilePhoto from "../../../assets/profile-photo.jpg";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";

// Importing individual page components
import DashboardPage from "./DashboardPage";
import Profile from "./Profile";
import ManageTasks from "./ManageTasks";

const AdminDashboard = ({ department }) => {
  const navigate = useNavigate();
  useAuthAdmin();
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    { label: "Manage Tasks", icon: "📋" },
    { label: "Reports", icon: "📊" },
    { label: "Reports", icon: "📊" },
    { label: "Reports", icon: "📊" },
    { label: "Reports", icon: "📊" },
    { label: "Reports", icon: "📊" },
    { label: "Reports", icon: "📊" },
    { label: "Reports", icon: "📊" },
    { label: "Settings", icon: "⚙️" },
  ];

  const logout = () => {
    localStorage.removeItem("tokenAdmin");
    navigate("/admin-login");
  };

  // Function to render the selected page dynamically
  const renderPage = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <DashboardPage />;
      case "Profile":
        return <Profile />;
      // case "Manage Tasks":
      //   return <TaskTable />;
      default:
        return <DashboardPage />;
    }
  };

  const handleProfileClick = () => {
    setSelectedMenu("Profile"); // Update selected menu to Profile
    setDropdownOpen(false); // Close dropdown when clicked
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
            Welcome,{" "}
            {profileData && profileData.fullName
              ? profileData.fullName
              : "Admin"}{" "}
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
