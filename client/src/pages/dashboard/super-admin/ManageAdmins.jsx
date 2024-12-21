import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ManageAdmins.module.css";
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState(null);  // Store the newly created admin data
  const [copySuccess, setCopySuccess] = useState("");

  const departments = [
    "Application",
    "Design",
    "Production",
    "Store",
    "Quality",
    "Purchase",
  ];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${SERVERHOST}/api/task-manager-app/auth/get-data/get-all-users-by-role/admin`
      );
      setAdmins(response.data.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admins.");
    }
  };

  const handleAddAdmin = async () => {
    setLoading(true);
    try {
      const departmentLowercase = department.toLowerCase();
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/admin-registration-by-sa`,
        { fullName, email, department: departmentLowercase },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenSuperAdmin")}`,
          },
        }
      );

      setNewAdmin(response.data.data); // Store the new admin's data
      toast.success(response.data.message);
      fetchAdmins(); // Refresh the list after adding new admin
      setIsModalOpen(false);
      setFullName("");
      setEmail("");
      setDepartment("");
    } catch (error) {
      console.error("Error adding admin:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add admin.");
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
    setDepartment("");
  };

  const handleCopyLoginDetails = () => {
    const loginDetails = `Email: ${newAdmin.email}, Password: ${newAdmin.password}`;
    navigator.clipboard.writeText(loginDetails);
    setCopySuccess("Login details copied to clipboard!");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Admins</h1>
      <div className={styles.addButtonContainer}>
        <button className={styles.addButton} onClick={openModal}>
          Add new Admin
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {admins && admins.length > 0 ? (
            admins.map((admin, index) => (
              <tr key={admin._id}>
                <td>{index + 1}</td>
                <td>{admin.fullName}</td>
                <td>{admin.email}</td>
                <td>{admin.department}</td>
                {/* <td>
                  <button className={styles.viewButton}>View</button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No admins available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Create New Admin</h3>
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
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.modalButtons}>
                <button
                  className={styles.submitButton}
                  onClick={handleAddAdmin}
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

      {/* Modal to display the new admin login details */}
      {newAdmin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>New Admin Created</h3>
            <p>
              Here are the login details of the new admin:
            </p>
            <div className={styles.details}>
              <p>Email: {newAdmin.email}</p>
              <p>Password: {newAdmin.plainPassword}</p>
              <button onClick={handleCopyLoginDetails} className={styles.copyButton}>
                Copy Login Details
              </button>
              {copySuccess && <p className={styles.copySuccess}>{copySuccess}</p>}
            </div>
            <button className={styles.closeButton} onClick={() => setNewAdmin(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
