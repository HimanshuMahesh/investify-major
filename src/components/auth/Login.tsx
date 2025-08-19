
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import UserTypeSelection from "./UserTypeSelection";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const { toast } = useToast();
  const { signInWithGoogle, user, userProfile, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (result.isNewUser) {
        // Show user type selection for new users
        setShowUserTypeSelection(true);
      } else {
        // Existing user - show success message
        toast({
          title: "Login successful",
          description: "Welcome back to Investify!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login error",
        description: error.message || "An error occurred during Google sign-in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show user type selection if it's a new user or if user exists without profile
  if (showUserTypeSelection || (!loading && user && !userProfile)) {
    return <UserTypeSelection />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <span className="text-2xl font-bold text-investify-primary">Investify</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-gray-600">
          Connect with Google to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <Button 
              className="w-full flex items-center justify-center gap-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50" 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  fill="currentColor"
                />
              </svg>
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Secure authentication with your Google account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
