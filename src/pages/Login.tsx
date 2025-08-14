
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "@/components/auth/Login";

const Login = () => {
  const navigate = useNavigate();
  
  // Check if user is already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("investify_auth") === "true";
    const userType = localStorage.getItem("investify_user_type");
    
    if (isAuthenticated && userType) {
      // Redirect to the appropriate dashboard
      navigate(
        userType === "investor" ? "/investor-dashboard" : "/business-dashboard",
        { replace: true }
      );
    }
  }, [navigate]);
  
  return <LoginComponent />;
};

export default Login;
