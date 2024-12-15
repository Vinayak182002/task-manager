import React, { useState } from 'react';
import styles from './SuperAdminDashboard.module.css';

const SuperAdminDashboard = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Admin Dashboard</h2>
        </div>
        <ul className={styles.menu}>
          <li>Dashboard</li>
          <li>Manage Admins</li>
          <li>Manage Employees</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Horizontal Bar with Profile */}
        <div className={styles.topBar}>
          <div className={styles.profile}>
            <img 
              src="profile-pic-url" 
              alt="Profile" 
              className={styles.profilePic} 
              onClick={handleDropdownToggle}
            />
            {isDropdownVisible && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li>Profile</li>
                  <li>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Content */}
        <div className={styles.content}>
          {/* Here will be the dynamic content based on selected menu */}
          <h1>Welcome to the Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
