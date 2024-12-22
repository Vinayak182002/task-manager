import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AssignTaskToAdmin.module.css";
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant";

const AssignTaskToAdmin = () => {
  const [tasks, setTasks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState("");
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
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      setTasks([]);
    }
  };

  const fetchAdmins = async () => {
    try {
      const role = "admin";
      const response = await axios.get(
        `${SERVERHOST}/api/task-manager-app/auth/get-data/get-all-users-by-role/${role}`
      );
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error("Error fetching admins:", error.response?.data || error.message);
      toast.error("Failed to fetch admins.");
    }
  };

  const handleAssignTask = async () => {
    if (!selectedTask || !selectedAdminId) {
      toast.error("Please select a task and an admin.");
      return;
    }

    try {
      await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/assign-task/${selectedTask._id}`,
        { assignedToIds: [selectedAdminId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenSuperAdmin")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Task assigned successfully.");
      fetchTasks();
      setSelectedTask(null);
      setSelectedAdminId("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error assigning task:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to assign the task.");
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setSelectedAdminId("");
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
          {tasks.length > 0 ? (
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
                      Already Assigned to{" "}
                      {
                        admins.find((admin) => admin._id === task.initiallyAssignedTo)
                          ? admins.find((admin) => admin._id === task.initiallyAssignedTo).fullName
                          : "Admin not found"
                      }
                    </span>
                  ) : (
                    <button
                      className={styles.assignButton}
                      onClick={() => openModal(task)}
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
            <h3>Assign Task: {selectedTask.title}</h3>
            <label htmlFor="adminDropdown">Choose Admin:</label>
            <select
              id="adminDropdown"
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
              className={styles.selectDropdown}
            >
              <option value="">Select Admin</option>
              {admins
                .filter((admin) => admin.department === selectedTask.currentDepartment) // Only show admins from the same department as the task
                .map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.fullName}
                  </option>
                ))}
            </select>
            <button className={styles.submitButton} onClick={handleAssignTask}>
              Assign
            </button>
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
