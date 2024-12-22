import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CreateNewTask.module.css";
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant";
import { fetchProfileData } from "./get-Data";

const CreateNewTask = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    currentDepartment: "",
  });
  const [adminDepartment, setAdminDepartment] = useState(""); // New state for admin's department

  // Fetch the logged-in admin's department
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        setAdminDepartment(data.department);
        
        // Update taskData with the admin department
        setTaskData((prevData) => ({
          ...prevData,
          currentDepartment: data.department, // Set department value in taskData
        }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []); // Only run once on component mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/create-task`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Task created successfully!");
        setTaskData({
          title: "",
          description: "",
          priority: "Medium",
          deadline: "",
          currentDepartment: "", // Reset the department
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An error occurred while creating the task."
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Task</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            rows="4"
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={taskData.priority}
            onChange={handleInputChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={taskData.deadline}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="currentDepartment">Current Department</label>
          <input
            id="currentDepartment"
            name="currentDepartment"
            value={adminDepartment}
            disabled // Disable the department field, but still use the value
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateNewTask;
