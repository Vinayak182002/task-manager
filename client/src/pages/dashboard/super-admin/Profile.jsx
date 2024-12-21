import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchProfileData } from "./get-Data";
import { SERVERHOST } from "../../../constants/constant";
import ProfilePhoto from "../../../assets/profile-photo.png";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    profilePhoto: null,
    profilePhotoPreview: null, // Temporary preview URL
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch profile data from API
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const data = await fetchProfileData();
        setProfileData({
          ...data,
          profilePhotoPreview: `${SERVERHOST}${data.profilePhoto}`, // Set the current profile photo URL
        });
      } catch (error) {
        toast.error("Failed to load your details. Check your connection!");
      }
    };

    getProfileData();
  }, []);

  // Handle form submission for updating profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profilePhoto", profileData.profilePhoto);
    formData.append("fullName", profileData.fullName);
    formData.append("userName", profileData.userName);
    formData.append("email", profileData.email);
    formData.append("phoneNumber", profileData.phoneNumber);
    formData.append("address", JSON.stringify(profileData.address));
    formData.append("description", profileData.description);

    try {
      const response = await axios.put(
        `${SERVERHOST}/api/task-manager-app/auth/get-data/update-sa-data`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("tokenSuperAdmin")}`,
          },
        }
      );

      setProfileData({
        ...response.data.superAdmin,
        profilePhotoPreview: `${SERVERHOST}${response.data.superAdmin.profilePhoto}`,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again!");
      console.error("Error updating profile:", error);
    }
  };

  // Handle input changes for the editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address")) {
      setProfileData({
        ...profileData,
        address: { ...profileData.address, [name.split(".")[1]]: value },
      });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  // Handle file selection for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        profilePhoto: file,
        profilePhotoPreview: URL.createObjectURL(file), // Create a temporary URL for the selected file
      });
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2>
          Profile Information - {profileData.fullName} ({profileData.role})
        </h2>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.profilePhoto}>
          <img
            src={
              profileData.profilePhotoPreview || ProfilePhoto // Use preview URL or fallback to default image
            }
            alt="Profile"
            className={styles.profileImage}
          />
          {isEditing && (
            <div className={styles.uploadPhotoContainer}>
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/*"
                onChange={handleFileChange} // Update the file change handler
                className={styles.uploadPhotoInput}
              />
            </div>
          )}
        </div>
        <form className={styles.profileForm} onSubmit={handleProfileUpdate}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={profileData.fullName}
              disabled={!isEditing}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.userName}
              disabled={!isEditing}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              disabled={!isEditing}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={profileData.description}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={profileData.phoneNumber}
              disabled={!isEditing}
              onChange={handleInputChange}
              minLength={10}
              maxLength={10}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Address</label>
            <input
              type="text"
              name="address.street"
              value={profileData.address.street}
              disabled={!isEditing}
              onChange={handleInputChange}
              placeholder="Street"
            />
            <input
              type="text"
              name="address.city"
              value={profileData.address.city}
              disabled={!isEditing}
              onChange={handleInputChange}
              placeholder="City"
            />
            <input
              type="text"
              name="address.state"
              value={profileData.address.state}
              disabled={!isEditing}
              onChange={handleInputChange}
              placeholder="State"
            />
            <input
              type="text"
              name="address.postalCode"
              value={profileData.address.postalCode}
              disabled={!isEditing}
              onChange={handleInputChange}
              placeholder="Postal Code"
            />
            <input
              type="text"
              name="address.country"
              value={profileData.address.country}
              disabled={!isEditing}
              onChange={handleInputChange}
              placeholder="Country"
            />
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={styles.editButton}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            {isEditing && (
              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
