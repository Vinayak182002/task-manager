import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuthEmployee = () => {
  const navigate = useNavigate();  // Get the navigate function from react-router

  useEffect(() => {
    const token = localStorage.getItem("tokenEmployee");  // Check for the token

    if (!token) {
      navigate("/employee-login"); 
    }
  }, [navigate]);
};

export default useAuthEmployee;
