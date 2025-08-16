
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

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


// Protected route component
const ProtectedRoute = ({ 
  children,
  requiredUserType = null
}: { 
  children: JSX.Element,
  requiredUserType?: "business" | "investor" | null
}) => {
  const { user, userProfile, loading } = useAuth();
  
  // Show loading spinner while checking authentication status
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-investify-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if onboarding is completed
  if (!userProfile?.isOnboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (requiredUserType && userProfile.userType !== requiredUserType) {
    // Redirect to the correct dashboard if user type doesn't match
    return <Navigate 
      to={userProfile.userType === "business" ? "/business-dashboard" : "/investor-dashboard"} 
      replace 
    />;
  }
  
  return children;
};

// Onboarding route component - only checks authentication, not onboarding completion
const OnboardingRoute = ({ children }: { children: JSX.Element }) => {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-investify-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if onboarding is already completed, redirect to dashboard
  if (userProfile?.isOnboardingCompleted) {
    return <Navigate 
      to={userProfile.userType === "business" ? "/business-dashboard" : "/investor-dashboard"} 
      replace 
    />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { userProfile } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/onboarding" 
        element={
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        } 
      />
      
      {/* Dashboard routes with protected routes */}
      <Route
        path="/dashboard"
        element={
          <Navigate
            to={userProfile?.userType === "investor" ? "/investor-dashboard" : "/business-dashboard"}
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
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
