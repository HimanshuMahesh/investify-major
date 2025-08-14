
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupComponent from "@/components/auth/Signup";

const Signup = () => {
  const navigate = useNavigate();
  
  // Listen for auth changes after signup
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("investify_auth") === "true";
      if (isLoggedIn) {
        navigate("/onboarding");
      }
    };
    
    // Initial check
    checkAuth();
    
    // Listen for storage changes
    window.addEventListener("storage", checkAuth);
    
    // Also attach a mutation observer to detect DOM changes that might indicate successful signup
    const observer = new MutationObserver(() => {
      setTimeout(checkAuth, 500); // Small delay to ensure localStorage is updated
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      window.removeEventListener("storage", checkAuth);
      observer.disconnect();
    };
  }, [navigate]);
  
  return <SignupComponent />;
};

export default Signup;
