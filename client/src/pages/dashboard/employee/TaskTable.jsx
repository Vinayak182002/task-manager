import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TaskTable.module.css";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";

const TaskTable = () => {
  const [projects, setProjects] = useState([]); // State to store projects
  const [tasks, setTasks] = useState([]); // State to store tasks for the selected project
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [selectedProject, setSelectedProject] = useState(""); // State to store selected project ID

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        setProfileData(data); // Set profile data to state
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch projects when profile data is available
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/task-manager-app/auth/tasks/get-projects`
        ); // Fetch projects for the employee
        setProjects(response.data.projects); // Set the fetched projects data
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (profileData) {
      fetchProjects(); // Fetch projects when profile data is available
    }
  }, [profileData]);

  // Fetch tasks for the selected project
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProject) return; // If no project is selected, don't fetch tasks

      setTasks([]); // Reset the task list when project changes

      try {
        const response = await axios.get(
          `${SERVERHOST}/api/task-manager-app/auth/tasks/get-tasks-by-project/${selectedProject}`
        ); // Fetch tasks for the selected project
        setTasks(response.data.tasks); // Set the fetched tasks data
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks(); // Fetch tasks whenever the selected project changes
  }, [selectedProject]); // Dependency on selectedProject

  return (
    <div className={styles.taskTableContainer}>
      <h2 className={styles.taskTableTitle}>Assigned Tasks</h2>

      {/* Dropdown for selecting project */}
      <div className={styles.projectSelectContainer}>
        <select
          className={styles.projectDropdown}
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display tasks if a project is selected */}
      {selectedProject && (
        <div className={styles.tableResponsive}>
          <table
            className={styles.taskTable}
            key={selectedProject} // Adding key prop to re-render table on project change
          >
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td> {/* Sr No is the index + 1 */}
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td>
                      {
                        task.departmentDeadlines
                          .filter(
                            (deadline) => deadline.department === `${profileData.department}`
                          ) // Filter for the selected department
                          .map((deadline) => new Date(deadline.deadline).toLocaleDateString()) // Format the deadline date
                          .join(", ") // In case there are multiple deadlines
                      }
                    </td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noTasks}>
                    No tasks are assigned to you for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
