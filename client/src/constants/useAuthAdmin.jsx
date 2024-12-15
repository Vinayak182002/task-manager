import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuthAdmin = () => {
  const navigate = useNavigate();  // Get the navigate function from react-router

  useEffect(() => {
    const token = localStorage.getItem("tokenAdmin");  // Check for the token

    if (!token) {
      navigate("/admin-login"); 
    }
  }, [navigate]);
};

export default useAuthAdmin;
