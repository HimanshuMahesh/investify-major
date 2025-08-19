
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginComponent from "@/components/auth/Login";

const Login = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading } = useAuth();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      if (userProfile) {
        if (!userProfile.isOnboardingCompleted) {
          // Redirect to onboarding if not completed
          navigate("/onboarding", { replace: true });
        } else {
          // Redirect to the appropriate dashboard
          navigate(
            userProfile.userType === "investor" ? "/investor-dashboard" : "/business-dashboard",
            { replace: true }
          );
        }
      }
      // If user exists but no userProfile, let the component handle user type selection
    }
  }, [user, userProfile, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-investify-primary"></div>
    </div>;
  }
  
  return <LoginComponent />;
};

export default Login;
