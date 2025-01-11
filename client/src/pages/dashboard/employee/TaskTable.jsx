import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TaskTable.module.css";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";
import { toast } from "react-toastify";

const TaskTable = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionNote, setSubmissionNote] = useState("");
  const [files, setFiles] = useState([]);
  const [taskSubmissionStatus, setTaskSubmissionStatus] = useState({});

  // Fetch profile data when component mounts
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

  // Fetch projects when profile data is available
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

    if (profileData) {
      fetchProjects();
    }
  }, [profileData]);

  // Fetch tasks for the selected project
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProject || !profileData) return;

      setTasks([]); // Clear tasks initially
      try {
        const response = await axios.get(
          `${SERVERHOST}/api/task-manager-app/auth/tasks/get-tasks-assigned-to-employee/${profileData._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("tokenEmployee")}`,
            },
          }
        );

        const tasksData = response.data.tasks;

        // Filter tasks to include only those that belong to the selected project
        const filteredTasks = tasksData.filter(
          (task) => task.projectId === selectedProject
        );

        // Fetch employee names for each submission
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

        // Check if the employee has already submitted the task
        const statusMap = {};
        updatedTasks.forEach((task) => {
          const hasSubmitted = task.submissionFiles.some(
            (submission) =>
              submission.uploadedBy.toString() === profileData._id.toString()
          );
          statusMap[task._id] = hasSubmitted ? "submitted" : "notSubmitted";
        });

        setTasks(updatedTasks);
        setTaskSubmissionStatus(statusMap);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [selectedProject, profileData]);

  // Handle file selection for submission
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Open modal to submit task
  const openModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSubmissionNote("");
    setFiles([]);
  };

  // Submit task
  const submitTask = async () => {
    if (!selectedTask) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("submissionNote", submissionNote);
    formData.append("department", profileData.department);

    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/submit-task-by-employee/${selectedTask._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenEmployee")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the task submission status locally
      setTaskSubmissionStatus((prevStatus) => ({
        ...prevStatus,
        [selectedTask._id]: "submitted",
      }));

      closeModal();
      toast.success(response.data.message); // Alert success message
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Error submitting task.");
    }
  };

  // Function to open file in new tab
  const openFileInNewTab = (filePath) => {
    window.open(filePath, "_blank");
  };

  const validateSubmission = async (taskId) => {
    try {
      await axios.patch(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/validate-submission-by-employee/${taskId}/${profileData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenEmployee")}`,
          },
        }
      );

      // Update UI
      setTaskSubmissionStatus((prevStatus) => ({
        ...prevStatus,
        [taskId]: "validated",
      }));

      toast.success("Task validated successfully");
    } catch (error) {
      console.error("Error validating submission:", error);
      toast.error("Error validating submission.");
    }
  };

  const deleteSubmission = async (taskId) => {
    try {
      await axios.delete(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/delete-submission-by-employee/${taskId}/${profileData._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenEmployee")}`,
          },
        }
      );

      // Update the UI: Remove submissions from the task state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, submissionFiles: task.submissionFiles.filter((sub) => sub.uploadedBy !== profileData._id) }
            : task
        )
      );

      setTaskSubmissionStatus((prevStatus) => ({
        ...prevStatus,
        [taskId]: "notSubmitted",
      }));

      toast.success("Submission deleted successfully");
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Error deleting submission.");
    }
  };

  return (
    <div className={styles.taskTableContainer}>
      <h2 className={styles.taskTableTitle}>Assigned Tasks</h2>

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

      {selectedProject && (
        <div className={styles.tableResponsive}>
          <table className={styles.taskTable} key={selectedProject}>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Attachments</th>
                <th>Actions</th>
                <th>Self-Validate</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td>
                      {task.departmentDeadlines
                        .filter(
                          (deadline) =>
                            deadline.department === profileData.department
                        )
                        .map((deadline) =>
                          new Date(deadline.deadline).toLocaleDateString()
                        )
                        .join(", ")}
                    </td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
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
                    <td>
                      {/* Submit button */}
                      <button
                        disabled={taskSubmissionStatus[task._id] === "submitted"}
                        onClick={() => openModal(task)}
                      >
                        {taskSubmissionStatus[task._id] === "submitted"
                          ? "Submitted"
                          : "Submit"}
                      </button>
                    </td>
                    <td>
                      {task.submissionFiles.some(
                        (submission) =>
                          submission.uploadedBy.toString() ===
                          profileData._id.toString()
                      ) ? (
                        <>
                          {task.submissionFiles.some(
                            (submission) =>
                              submission.uploadedBy.toString() ===
                                profileData._id.toString() &&
                              submission.selfValidated
                          ) ? (
                            <span>You have validated this task submission</span>
                          ) : (
                            <>
                              {taskSubmissionStatus[task._id] === "submitted" && (
                                <>
                                  <button
                                    onClick={() => validateSubmission(task._id)}
                                    disabled={task.submissionFiles.some(
                                      (submission) =>
                                        submission.uploadedBy.toString() ===
                                          profileData._id.toString() &&
                                        submission.selfValidated
                                    )}
                                  >
                                    {task.submissionFiles.some(
                                      (submission) =>
                                        submission.uploadedBy.toString() ===
                                          profileData._id.toString() &&
                                        submission.selfValidated
                                    )
                                      ? "Validated"
                                      : "Validate"}
                                  </button>
                                  <button onClick={() => deleteSubmission(task._id)}>
                                    Delete
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <span>Not submitted</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No tasks available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for submitting task */}
      {modalVisible && selectedTask && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeModal} onClick={closeModal}>
              &times;
            </span>
            <h3>Submit Task: {selectedTask.title}</h3>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <textarea
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              placeholder="Add a note (optional)"
              className={styles.noteTextarea}
            />
            <button onClick={submitTask} className={styles.submitButton}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
