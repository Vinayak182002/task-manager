import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManageEmployees.module.css";
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${SERVERHOST}/api/task-manager-app/auth/get-data/get-all-users-by-role/employee`
      );
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Employees</h1>

      {loading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee._id}>
                  <td>{index + 1}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.role}</td>
                  {/* <td>
                    <button className={styles.viewButton}>View</button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No employees available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageEmployees;
