import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuthAdmin = () => {
  const navigate = useNavigate();  // Get the navigate function from react-router

  useEffect(() => {
    const token = localStorage.getItem("tokenAdmin");  // Check for the token

    if (token) {
      try {
        // Decode the token manually (extract the payload)
        const base64Url = token.split('.')[1];
        const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decodedToken = JSON.parse(base64);

        // Extract the expiration time from the token
        const expirationTime = decodedToken.exp * 1000; // Convert exp to milliseconds

        // Check if the token has expired
        if (expirationTime < Date.now()) {
          // console.log("Token has expired.");
          localStorage.removeItem("tokenAdmin");
          toast.error("Session Expired! Please login!");
          window.location.reload();
          navigate("/admin-login");  // Redirect to login page
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        toast.error("Session Expired! Please login!");
        navigate("/admin-login");
      }
    } else {
      toast.error("Session Expired! Please login!");
      navigate("/admin-login");  // Redirect to login if no token found
    }
  }, [navigate]);  // Run the effect on navigate change
};

export default useAuthAdmin;
