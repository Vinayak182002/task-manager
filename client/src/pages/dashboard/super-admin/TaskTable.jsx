import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TaskTable.module.css";
import { SERVERHOST } from "../../../constants/constant";

const TaskTable = () => {
  const [projects, setProjects] = useState([]); // List of projects
  const [tasks, setTasks] = useState([]); // List of tasks for selected project
  const [selectedProject, setSelectedProject] = useState(""); // Selected project
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedTask, setSelectedTask] = useState(null); // Selected task data

  // Fetch projects from the server
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/task-manager-app/auth/tasks/get-projects`
        );
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch tasks for selected project
  useEffect(() => {
    if (selectedProject) {
      const fetchTasks = async () => {
        try {
          setTasks([]);
          const response = await axios.get(
            `${SERVERHOST}/api/task-manager-app/auth/tasks/get-tasks-by-project/${selectedProject}`
          );

          const filteredTasks = response.data.tasks;
          const updatedTasks = await Promise.all(
            filteredTasks.map(async (task) => {
              const updatedSubmissionFiles = await Promise.all(
                task.submissionFiles.map(async (submission) => {
                  const employeeResponse = await axios.get(
                    `${SERVERHOST}/api/task-manager-app/auth/get-data/get-employee-by-id/${submission.uploadedBy}`
                  );
                  return {
                    ...submission,
                    uploadedByName: employeeResponse.data.employee.fullName,
                  };
                })
              );

              return {
                ...task,
                submissionFiles: updatedSubmissionFiles,
              };
            })
          );

          setTasks(updatedTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchTasks();
    }
  }, [selectedProject]);

  // Open modal with task data
  const handleRowClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  return (
    <div className={styles.taskTableContainer}>
      <h2 className={styles.taskTableTitle}>Select Project and View Tasks</h2>

      {/* Dropdown for selecting project */}
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

      {/* Task Table */}
      {selectedProject && (
        <div className={styles.tableResponsive}>
          <table className={styles.taskTable}>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th>Task Status</th>
                <th>Current Department</th>
                <th>Next Department</th>
                <th>Assigned Date</th>
                <th>Confirm Date from Application Department</th>
                <th>Confirm Date from Design Department</th>
                <th>Confirm Date from Production Department</th>
                <th>Confirm Date from Store Department</th>
                <th>Confirm Date from Quality Department</th>
                <th>Confirm Date from Purchase Department</th>
                <th>Confirm Date from Maintenance Department</th>
                <th>Confirm Date from Services Department</th>
                <th>Attachments</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => handleRowClick(task)} // Row click handler
                  >
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.status}</td>
                    <td>{task.currentDepartment}</td>
                    <td>{task.nextDepartment}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td>
                      {task.departmentDeadlines
                        .filter(
                          (deadline) => deadline.department === "application"
                        )
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {task.departmentDeadlines
                        .filter((deadline) => deadline.department === "design")
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {task.departmentDeadlines
                        .filter(
                          (deadline) => deadline.department === "production"
                        )
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {task.departmentDeadlines
                        .filter((deadline) => deadline.department === "store")
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {task.departmentDeadlines
                        .filter((deadline) => deadline.department === "quality")
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {task.departmentDeadlines
                        .filter(
                          (deadline) => deadline.department === "purchase"
                        )
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {task.departmentDeadlines
                        .filter(
                          (deadline) => deadline.department === "maintenance"
                        )
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {task.departmentDeadlines
                        .filter(
                          (deadline) => deadline.department === "services"
                        )
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )}
                    </td>
                    <td>
                      {/* Attachments column */}
                      {task.submissionFiles &&
                      task.submissionFiles.length > 0 ? (
                        task.submissionFiles.map((submission, index) => (
                          <div key={index}>
                            <a
                              href="#"
                              onClick={() =>
                                openFileInNewTab(submission.filePath)
                              } // Open file in new tab
                            >
                              {submission.fileName} - Uploaded By:{" "}
                              {submission.uploadedByName}
                            </a>
                            <br />
                            <br />
                          </div>
                        ))
                      ) : (
                        <span>No attachments</span>
                      )}
                    </td>
                    <td>{task.priority}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noTasks}>
                    No tasks available for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal to display selected task */}
      {showModal && selectedTask && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {/* Close button */}
            <button className={styles.closeBtn} onClick={handleCloseModal}>
              ❌
            </button>
            <h3><strong>Task Title:</strong>{selectedTask.title}</h3>
            <p>
              <strong>Description:</strong> {selectedTask.description}
            </p>
            <p>
              <strong>Task Status:</strong> {selectedTask.status}
            </p>
            <p>
              <strong>Current Department:</strong>{" "}
              {selectedTask.currentDepartment}
            </p>
            <p>
              <strong>Next Department:</strong> {selectedTask.nextDepartment}
            </p>
            <p>
              <strong>Assigned Date:</strong>{" "}
              {new Date(selectedTask.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Confirm Date from Application Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "application")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Confirm Date from Design Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "design")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Confirm Date from Production Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "production")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Confirm Date from Store Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "store")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Confirm Date from Quality Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "quality")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Confirm Date from Purchase Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "purchase")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Confirm Date from Maintenance Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "maintenance")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Confirm Date from Services Department:</strong>
              {selectedTask.departmentDeadlines
                .filter((deadline) => deadline.department === "services")
                .map((deadline) =>
                  new Date(deadline.deadline).toLocaleDateString()
                )}
            </p>
            <p>
              <strong>Attachments:</strong>
              {selectedTask.submissionFiles && selectedTask.submissionFiles.length > 0 ? (
                selectedTask.submissionFiles.map((submission, index) => (
                  <div key={index}>
                    <a
                      href="#"
                      onClick={() => openFileInNewTab(submission.filePath)} // Open file in new tab
                    >
                      {submission.fileName} - Uploaded By:{" "}
                      {submission.uploadedByName}
                    </a>
                    <br />
                    <br />
                  </div>
                ))
              ) : (
                <span>No attachments</span>
              )}
            </p>
            <p>
              <strong>Priority:</strong> {selectedTask.priority}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
