import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AssignTaskToAdmin.module.css";
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant";

const AssignTaskToAdmin = () => {
  const [tasks, setTasks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [adminDetails, setAdminDetails] = useState({}); // State to store admin details
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchAdmins();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/get-tasks-by-creator`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenSuperAdmin")}`,
          },
        }
      );
      setTasks(response.data.tasks || []); // Fallback to an empty array if no tasks
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      toast.error("Failed to fetch tasks.");
      setTasks([]); // Set to an empty array on error
    }
  };

  const fetchAdmins = async () => {
    try {
      const role = "admin";
      const response = await axios.get(
        `${SERVERHOST}/api/task-manager-app/auth/get-data/get-all-users-by-role/${role}`
      );
      setAdmins(response.data.data);

      // Create a mapping of admin IDs to fullNames
      const adminMap = response.data.data.reduce((acc, admin) => {
        acc[admin._id] = admin.fullName;
        return acc;
      }, {});
      setAdminDetails(adminMap);  // Store the mapping
    } catch (error) {
      console.error("Error fetching admins:", error.response?.data || error.message);
      toast.error("Failed to fetch admins.");
    }
  };

  const handleAssignTask = async () => {
    if (!selectedTask || !selectedAdmin) {
      toast.error("Please select a task and an admin.");
      return;
    }

    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/assign-task/${selectedTask._id}`, // Use task._id
        { assignedToName: selectedAdmin },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenSuperAdmin")}`,
          },
        }
      );

      toast.success("Task assigned successfully.");
      fetchTasks(); // Refresh tasks after assignment
      setSelectedTask(null);
      setSelectedAdmin("");
      setIsModalOpen(false); // Close the modal after assigning the task
    } catch (error) {
      console.error("Error assigning task:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to assign the task.");
    }
  };

  const openModal = (taskId) => {
    const task = tasks.find(t => t._id === taskId); // Find the task by its ID
    setSelectedTask(task); // Set the whole task object
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setSelectedAdmin("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Assign Tasks to Admin</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={task._id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>
                  {task.initiallyAssignedTo ? (
                    <span>
                      Already assigned to {adminDetails[task.initiallyAssignedTo] || "Unknown Admin"}
                    </span>
                  ) : (
                    <button
                      className={styles.assignButton}
                      onClick={() => openModal(task._id)} // Pass task ID to open the modal
                    >
                      Assign Task
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && selectedTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Select Admin for Task: {selectedTask.title}</h3> {/* Display task title */}
            <div className={styles.dropdownContainer}>
              <label htmlFor="adminDropdown">Choose an Admin: </label>
              <select
                id="adminDropdown"
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className={styles.selectDropdown}
              >
                <option value="">Select Admin</option>
                {Array.isArray(admins) && admins.length > 0 ? (
                  admins.map((admin) => (
                    <option key={admin._id} value={admin.fullName}>
                      {admin.fullName} - {admin.department} Department
                    </option>
                  ))
                ) : (
                  <option disabled>No admins available</option>
                )}
              </select>
              <button className={styles.submitButton} onClick={handleAssignTask}>
                Assign it!
              </button>
            </div>
            <button className={styles.closeModalButton} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTaskToAdmin;
