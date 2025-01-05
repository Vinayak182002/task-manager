import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManageEmployees.module.css";
import { fetchProfileData } from "./get-Data";
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState(null); // Store the newly created employee data
  const [copySuccess, setCopySuccess] = useState("");
  const [profileData, setProfileData] = useState(null);

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

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${SERVERHOST}/api/task-manager-app/auth/get-data/get-employees-for-admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
          },
        }
      );
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees.");
    }
  };

  const handleAddEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/employee-registration-by-admin`,
        { fullName, email, department: profileData.department.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
          },
        }
      );

      setNewEmployee(response.data.data); // Store the new employee's data
      toast.success(response.data.message);
      fetchEmployees(); // Refresh the list after adding new employee
      setIsModalOpen(false);
      setFullName("");
      setEmail("");
    } catch (error) {
      console.error(
        "Error adding employee:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFullName("");
    setEmail("");
  };

  const handleCopyLoginDetails = () => {
    const loginDetails = `Email: ${newEmployee.email}, Password: ${newEmployee.plainPassword}`;
    navigator.clipboard.writeText(loginDetails);
    setCopySuccess("Login details copied to clipboard!");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Employees</h1>
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={openModal}>
          Add new Employee
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {employees && employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={employee._id}>
                <td>{index + 1}</td>
                <td>{employee.fullName}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No employees available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Create New Employee</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="department">Department:</label>
                <input
                  type="text"
                  id="department"
                  value={profileData.department}
                  disabled
                />
              </div>

              <div className={styles.modalButtons}>
                <button
                  className={styles.submitButton}
                  onClick={handleAddEmployee}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Submit"}
                </button>
                <button className={styles.closeButton} onClick={closeModal}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to display the new employee login details */}
      {newEmployee && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>New Employee Created</h3>
            <p>Here are the login details of the new employee:</p>
            <div className={styles.details}>
              <p>Email: {newEmployee.email}</p>
              <p>Password: {newEmployee.plainPassword}</p>
              <button
                onClick={handleCopyLoginDetails}
                className={styles.copyButton}
              >
                Copy Login Details
              </button>
              {copySuccess && (
                <p className={styles.copySuccess}>{copySuccess}</p>
              )}
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setNewEmployee(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;
