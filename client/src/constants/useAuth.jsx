import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuth = () => {
  const navigate = useNavigate();  // Get the navigate function from react-router

  useEffect(() => {
    const token = localStorage.getItem("tokenSuperAdmin");  // Check for the token

    if (!token) {
      navigate("/super-admin-login"); 
    }
  }, [navigate]);
};

export default useAuth;
