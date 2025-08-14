
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BusinessDashboard from "./pages/BusinessDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import BusinessProfile from "./pages/BusinessProfile";
import Messages from "./pages/Messages";
import Matches from "./pages/Matches";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

// Auth context simulation
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"business" | "investor" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("investify_auth") === "true";
      const storedUserType = localStorage.getItem("investify_user_type") as "business" | "investor" | null;
      
      setIsAuthenticated(isLoggedIn);
      setUserType(storedUserType);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for storage changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);
  
  const login = (type: "business" | "investor") => {
    localStorage.setItem("investify_auth", "true");
    localStorage.setItem("investify_user_type", type);
    setIsAuthenticated(true);
    setUserType(type);
  };
  
  const logout = () => {
    localStorage.removeItem("investify_auth");
    localStorage.removeItem("investify_user_type");
    setIsAuthenticated(false);
    setUserType(null);
  };
  
  return { isAuthenticated, userType, login, logout, isLoading };
};

// Protected route component
const ProtectedRoute = ({ 
  children,
  requiredUserType = null
}: { 
  children: JSX.Element,
  requiredUserType?: "business" | "investor" | null
}) => {
  const { isAuthenticated, userType, isLoading } = useAuth();
  
  // Show nothing while checking authentication status
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-investify-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to the correct dashboard if user type doesn't match
    return <Navigate 
      to={userType === "business" ? "/business-dashboard" : "/investor-dashboard"} 
      replace 
    />;
  }
  
  return children;
};

const App = () => {
  const { userType } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            {/* Dashboard routes with protected routes */}
            <Route
              path="/dashboard"
              element={
                <Navigate
                  to={userType === "investor" ? "/investor-dashboard" : "/business-dashboard"}
                  replace
                />
              }
            />
            <Route
              path="/business-dashboard"
              element={
                <ProtectedRoute requiredUserType="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investor-dashboard"
              element={
                <ProtectedRoute requiredUserType="investor">
                  <InvestorDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Business Profile */}
            <Route
              path="/business-profile"
              element={
                <ProtectedRoute requiredUserType="business">
                  <BusinessProfile />
                </ProtectedRoute>
              }
            />
            
            {/* Messages */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            
            {/* Matches */}
            <Route
              path="/matches"
              element={
                <ProtectedRoute>
                  <Matches />
                </ProtectedRoute>
              }
            />
            
            {/* Analytics */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            
            {/* Settings */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
