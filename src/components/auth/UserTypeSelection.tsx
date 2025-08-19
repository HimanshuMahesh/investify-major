import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Building2, TrendingUp } from "lucide-react";

const UserTypeSelection = () => {
  const [selectedType, setSelectedType] = useState<'business' | 'investor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserType } = useAuth();
  const { toast } = useToast();

  const handleTypeSelection = async () => {
    if (!selectedType) return;

    setIsLoading(true);
    try {
      await setUserType(selectedType);
      toast({
        title: "Account setup complete!",
        description: `Welcome to Investify as a ${selectedType === 'business' ? 'startup/business' : 'investor'}!`,
      });
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "An error occurred during account setup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to Investify!
          </CardTitle>
          <CardDescription>
            Please select how you'd like to use Investify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Business/Startup Option */}
            <div
              className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                selectedType === 'business'
                  ? 'border-investify-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedType('business')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${
                  selectedType === 'business' ? 'bg-investify-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    I'm a Startup/Business
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Looking for investors to fund my business or startup
                  </p>
                </div>
              </div>
            </div>

            {/* Investor Option */}
            <div
              className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                selectedType === 'investor'
                  ? 'border-investify-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedType('investor')}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${
                  selectedType === 'investor' ? 'bg-investify-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    I'm an Investor
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Looking to discover and invest in promising startups
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleTypeSelection}
            disabled={!selectedType || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Setting up your account..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypeSelection;