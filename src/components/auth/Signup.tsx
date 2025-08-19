import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import UserTypeSelection from "./UserTypeSelection";

const Signup = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const { signInWithGoogle, user, userProfile, loading } = useAuth();

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (result.isNewUser) {
        // Show user type selection for new users
        setShowUserTypeSelection(true);
      } else {
        // Existing user - show message
        toast({
          title: "Welcome back!",
          description: "You already have an account with us.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during account creation.",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Link to="/" className="flex justify-center mb-4">
            <span className="text-2xl font-bold text-investify-primary">Investify</span>
          </Link>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Connect with Google to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Button 
              className="w-full flex items-center justify-center gap-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50" 
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  fill="currentColor"
                />
              </svg>
              {isLoading ? "Creating account..." : "Continue with Google"}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Secure authentication with your Google account
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-800">
              Privacy Policy
            </a>
            .
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
