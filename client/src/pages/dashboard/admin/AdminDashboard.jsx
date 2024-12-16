import React, { useState, useEffect, useRef } from "react";
import styles from "./AdminDashboard.module.css";
// import useAuthAmin from "../../../constants/useAuthAdmin"

// Importing individual page components
import DashboardPage from "./DashboardPage";
import ManageTasks from "./ManageTasks";
import TaskTable from "./TaskTable";


const AdminDashboard = ({ department }) => {
  // useAuthAmin();
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const dropdownRef = useRef(null);

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

  // Function to render the selected page dynamically
  const renderPage = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <DashboardPage />;
      case "Manage Tasks":
        return <TaskTable />;
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
    <div
      className={`${styles.dashboardContainer} ${styles[department]}`}
    >
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
          {isSidebarCollapsed ? "A" : "Admin"}
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
        <header className={styles.topBar} style={{ backgroundColor: departmentColor }}>
          <div className={styles.pageTitle}>{department.charAt(0).toUpperCase() + department.slice(1)} Department - {selectedMenu}</div>
          <div
            className={styles.profileSection}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className={styles.profileImage}
            />
            {dropdownOpen && (
              <div ref={dropdownRef} className={styles.dropdownMenu}>
                <div className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>👤</span> Profile
                </div>
                <div className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>🚪</span> Logout
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Render Selected Page */}
        <div className={styles.contentArea}>{renderPage()}</div>

        {/* Footer */}
        <footer className={styles.footer} style={{ backgroundColor: departmentColor }}>
          <div className={styles.footerContent}>
            &copy; {new Date().getFullYear()} Admin Dashboard - Designed by PV Softwares. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
