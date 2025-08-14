
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Redirect to dashboard based on user type
      const userType = localStorage.getItem("investify_user_type");
      if (userType === "business") {
        navigate("/business-dashboard");
      } else {
        navigate("/investor-dashboard");
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Welcome to Investify!</h3>
            <p>
              We're excited to help you on your investment journey. Let's get started by setting up your profile.
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Set Your Preferences</h3>
            <p>
              Tell us about your investment preferences so we can match you with the right opportunities.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Receive personalized match recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Connect with potential investors or businesses</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Get insights about market trends</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">You're All Set!</h3>
            <p>
              Your account has been successfully created. You're now ready to explore Investify.
            </p>
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center rounded-full p-2 bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-investify-mint/50">
        <CardHeader className="border-b border-investify-mint/20 pb-4">
          <CardTitle className="text-investify-primary text-center font-garrett">Investify Onboarding</CardTitle>
          <CardDescription className="text-center">
            Step {currentStep} of {totalSteps}
          </CardDescription>
          <div className="w-full flex space-x-1 mt-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index + 1 <= currentStep ? "bg-investify-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">{renderStepContent()}</CardContent>
        <CardFooter>
          <Button
            onClick={handleNext}
            className="w-full bg-investify-primary hover:bg-investify-primary/90"
          >
            {currentStep === totalSteps ? "Get Started" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
