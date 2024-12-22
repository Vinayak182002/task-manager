import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AssignTask.module.css"; // CSS Module for styling
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant"; // Adjust path if necessary

const AssignTask = () => {
  const [createdTasks, setCreatedTasks] = useState([]); // List of tasks created by the admin
  const [assignedTasks, setAssignedTasks] = useState([]); // List of tasks assigned to the admin
  const [employees, setEmployees] = useState([]); // List of employees for task assignment
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Selected employees for task assignment
  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [selectedTaskId, setSelectedTaskId] = useState(null); // The task to assign employees to
  const [assignedEmployeesForTask, setAssignedEmployeesForTask] = useState([]); // List of employees already assigned to the task

  // Fetch tasks created by the logged-in admin
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/task-manager-app/auth/tasks/get-tasks-by-creator`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
            },
          }
        );

        if (response.status === 200) {
          setCreatedTasks(response.data.tasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        toast.error("Error fetching tasks.");
      }
    };

    fetchTasks();
  }, []);

  // Fetch tasks assigned to the logged-in admin
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/task-manager-app/auth/tasks/get-tasks-assigned-to-admin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
            },
          }
        );

        if (response.status === 200) {
          setAssignedTasks(response.data.tasks);
        }
      } catch (error) {
        console.error("Error fetching assigned tasks:", error.message);
        toast.error("Error fetching assigned tasks.");
      }
    };

    fetchAssignedTasks();
  }, []);

  // Fetch employees from the same department as the admin
  useEffect(() => {
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

        if (response.status === 200) {
          setEmployees(response.data.employees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error.message);
        toast.error("Error fetching employees.");
      }
    };

    fetchEmployees();
  }, []);

  // Fetch already assigned employees for a task
  useEffect(() => {
    if (selectedTaskId) {
      const fetchAssignedEmployeesForTask = async () => {
        try {
          const response = await axios.get(
            `${SERVERHOST}/api/task-manager-app/auth/tasks/get-assigned-employees/${selectedTaskId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
              },
            }
          );

          if (response.status === 200) {
            setAssignedEmployeesForTask(response.data.employees);
          }
        } catch (error) {
          console.error("Error fetching assigned employees:", error.message);
          toast.error("Error fetching assigned employees.");
        }
      };

      fetchAssignedEmployeesForTask();
    }
  }, [selectedTaskId]);

  // Handle selection of employees with checkboxes
  const handleEmployeeSelection = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployees(
      (prevSelected) =>
        prevSelected.includes(employeeId)
          ? prevSelected.filter((id) => id !== employeeId) // Remove if already selected
          : [...prevSelected, employeeId] // Add to the selected list
    );
  };

  // Open the modal for assigning employees to a task
  const openAssignTaskModal = (taskId) => {
    setSelectedTaskId(taskId);
    setShowModal(true);
  };

  // Close the modal
  const closeAssignTaskModal = () => {
    setShowModal(false);
    setSelectedEmployees([]); // Clear selected employees when modal is closed
  };

  // Handle task assignment
  const handleTaskAssignment = async () => {
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/assign-task/${selectedTaskId}`,
        { assignedToIds: selectedEmployees },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Task assigned successfully to employees.");
        closeAssignTaskModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error assigning task:", error.message);
      toast.error("Error assigning task.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      {/* Tasks Created by Admin */}
      <div className={styles.taskList}>
        <h2>Tasks Created by You</h2>
        {createdTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <table className={styles.taskTable}>
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
              {createdTasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>
                    <button
                      className={styles.assignButton}
                      onClick={() => openAssignTaskModal(task._id)}
                    >
                      {task.assignedEmployees && task.assignedEmployees.length > 0
                        ? "Assign this task to more employees"
                        : "Assign Task"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tasks Assigned to Admin */}
      <div className={styles.taskList}>
        <h2>Tasks Assigned to You - By SuperAdmin</h2>
        {assignedTasks.length === 0 ? (
          <p>No tasks assigned to you.</p>
        ) : (
          <table className={styles.taskTable}>
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
              {assignedTasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>
                    <button
                      className={styles.assignButton}
                      onClick={() => openAssignTaskModal(task._id)}
                    >
                      {task.assignedEmployees && task.assignedEmployees.length > 0
                        ? "Assign this task to more employees"
                        : "Assign Task"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for assigning task */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Assign Task</h2>

            <label htmlFor="employees">Select Employees</label>
            <div className={styles.checkboxList}>
              {employees
                .filter(
                  (employee) =>
                    !assignedEmployeesForTask.some(
                      (assignedEmployee) =>
                        assignedEmployee._id.toString() ===
                        employee._id.toString()
                    )
                )
                .map((employee) => (
                  <div key={employee._id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id={employee._id}
                      value={employee._id}
                      checked={selectedEmployees.includes(employee._id)}
                      onChange={handleEmployeeSelection}
                    />
                    <label htmlFor={employee._id}>{employee.fullName}</label>
                  </div>
                ))}
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={closeAssignTaskModal}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleTaskAssignment}
                className={styles.assignButton}
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTask;
