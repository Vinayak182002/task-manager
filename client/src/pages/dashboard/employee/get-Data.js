
import axios from "axios";

// Server host URL
import { SERVERHOST } from "../../../constants/constant"

// Fetch Super Admin profile data
export const fetchProfileData = async () => {
  try {
    const response = await axios.get(
      `${SERVERHOST}/api/task-manager-app/auth/get-data/get-employee-data`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokenEmployee")}`,
        },
      }
    );
    return response.data.data; // Return the data part of the response
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error; // Rethrow the error to handle it in the calling component
  }
};
