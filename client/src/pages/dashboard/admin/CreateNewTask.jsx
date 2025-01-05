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
    currentDepartment: "",
    projectId: "",
    departmentDeadlines: {}, // Object to store deadlines for each department
  });

  const [projects, setProjects] = useState([]); // Store projects fetched from backend

  // Fetch all projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${SERVERHOST}/api/task-manager-app/auth/tasks/get-projects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
          },
        });

        if (response.status === 200) {
          setProjects(response.data.projects); // Assuming response.data.projects contains an array of { _id, name }
        }
      } catch (error) {
        console.error("Error fetching projects:", error.response?.data || error.message);
        toast.error("Failed to fetch projects.");
      }
    };

    fetchProjects();
  }, []);

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

  const handleDeadlineChange = (e, department) => {
    setTaskData({
      ...taskData,
      departmentDeadlines: {
        ...taskData.departmentDeadlines,
        [department]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert departmentDeadlines object to an array
    const departmentDeadlinesArray = Object.keys(taskData.departmentDeadlines).map((department) => ({
      department,
      deadline: taskData.departmentDeadlines[department],
    }));
  
    const updatedTaskData = {
      ...taskData,
      departmentDeadlines: departmentDeadlinesArray,
    };
  
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/create-task`,
        updatedTaskData,
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
          currentDepartment: "",
          projectId: "",
          departmentDeadlines: {},
        });
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
            required
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
            required
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

        {/* Project Selection */}
        <div className={styles.formGroup}>
          <label htmlFor="projectId">Project</label>
          <select
            id="projectId"
            name="projectId"
            value={taskData.projectId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="currentDepartment">Current Department</label>
          <select
            id="currentDepartment"
            name="currentDepartment"
            value={adminDepartment}
            disabled
          >
            <option value="">Select Department</option>
            <option value="application">Application</option>
            <option value="design">Design</option>
            <option value="production">Production</option>
            <option value="store">Store</option>
            <option value="quality">Quality</option>
            <option value="purchase">Purchase</option>
            <option value="maintenance">Maintenance</option>
            <option value="services">Services</option>
          </select>
        </div>

        {/* Department Deadlines */}
        <h3 className={styles.sectionTitle}>Set Deadlines for Departments</h3>
        {[
          "application",
          "design",
          "production",
          "store",
          "quality",
          "purchase",
          "maintenance",
          "services",
        ].map((department) => (
          <div key={department} className={styles.formGroup}>
            <label htmlFor={`deadline-${department}`}>
              {department.charAt(0).toUpperCase() + department.slice(1)} Deadline
            </label>
            <input
              type="date"
              id={`deadline-${department}`}
              name={`deadline-${department}`}
              value={taskData.departmentDeadlines[department] || ""}
              onChange={(e) => handleDeadlineChange(e, department)}
            />
          </div>
        ))}

        <button type="submit" className={styles.submitButton}>
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateNewTask;
