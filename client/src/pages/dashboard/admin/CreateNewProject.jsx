import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateNewProject.module.css";
import { toast } from "react-toastify";
import { SERVERHOST } from "../../../constants/constant";

const CreateNewProject = () => {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${SERVERHOST}/api/task-manager-app/auth/tasks/create-project`,
        projectData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenAdmin")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Project created successfully!");
        setProjectData({
          name: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error creating project:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An error occurred while creating the project."
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Project</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
            placeholder="Enter project name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Project Description</label>
          <textarea
            id="description"
            name="description"
            value={projectData.description}
            onChange={handleInputChange}
            placeholder="Enter project description"
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateNewProject;
