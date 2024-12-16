import React from "react";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the main dashboard area for the super admin.</p>
    </div>
  );
};

export default DashboardPage;
