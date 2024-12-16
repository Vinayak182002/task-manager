import React, { useState, useEffect, useRef } from "react";
import styles from "./SuperAdminDashboard.module.css";

// Importing individual page components
import DashboardPage from "./DashboardPage";
// import ManageAdminsPage from "./ManageAdminsPage/ManageAdminsPage";
// import ManageEmployeesPage from "./ManageEmployeesPage/ManageEmployeesPage";
// import ReportsPage from "./ReportsPage/ReportsPage";
// import SettingsPage from "./SettingsPage/SettingsPage";

const SuperAdminDashboard = () => {
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
    { label: "Manage Admins", icon: "👤" },
    { label: "Manage Employees", icon: "👥" },
    { label: "Manage Employees", icon: "👥" },
    { label: "Manage Employees", icon: "👥" },
    { label: "Manage Employees", icon: "👥" },
    { label: "Manage Employees", icon: "👥" },
    { label: "Manage Employees", icon: "👥" },
    { label: "Reports", icon: "📊" },
    { label: "Settings", icon: "⚙️" },
  ];

  // Function to render the selected page dynamically
  const renderPage = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <DashboardPage />;
      // case "Manage Admins":
      //   return <ManageAdminsPage />;
      // case "Manage Employees":
      //   return <ManageEmployeesPage />;
      // case "Reports":
      //   return <ReportsPage />;
      // case "Settings":
      //   return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles.collapsedSidebar : ""
        }`}
      >
        {/* Hamburger Icon */}
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
          <div className={styles.pageTitle}>{selectedMenu}</div>
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
