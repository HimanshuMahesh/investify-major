
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { categorizeStartup, StartupCategorization, categorizeInvestor, InvestorCategorization } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Check, Building2, Sparkles, Edit3, TrendingUp } from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [startupBrief, setStartupBrief] = useState("");
  const [investorBrief, setInvestorBrief] = useState("");
  const [categorization, setCategorization] = useState<StartupCategorization | null>(null);
  const [investorCategorization, setInvestorCategorization] = useState<InvestorCategorization | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const totalSteps = 5; // Increased for the new AI categorization step
  const { userProfile, updateUserProfile } = useAuth();
  const userType = userProfile?.userType;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      // If moving from brief step to categorization step, generate AI categorization
      if (currentStep === 2 && userType === "business" && startupBrief.trim() && !categorization) {
        setIsGenerating(true);
        try {
          const aiCategorization = await categorizeStartup(startupBrief.trim());
          setCategorization(aiCategorization);
        } catch (error) {
          console.error('AI categorization failed:', error);
        }
        setIsGenerating(false);
      }
      
      // If moving from investor brief step to categorization step, generate AI categorization
      if (currentStep === 2 && userType === "investor" && investorBrief.trim() && !investorCategorization) {
        setIsGenerating(true);
        try {
          const aiCategorization = await categorizeInvestor(investorBrief.trim());
          setInvestorCategorization(aiCategorization);
        } catch (error) {
          console.error('AI investor categorization failed:', error);
        }
        setIsGenerating(false);
      }
      
      setCurrentStep(currentStep + 1);
    } else {
      // Update user profile to mark onboarding as completed
      if (userProfile) {
        const updates: any = {
          isOnboardingCompleted: true,
          ...(userType === "business" && startupBrief.trim() && { startupBrief: startupBrief.trim() }),
          ...(userType === "investor" && investorBrief.trim() && { investorBrief: investorBrief.trim() })
        };

        // Add startup AI categorization fields if available
        if (categorization && userType === "business") {
          updates.industry = categorization.industry;
          updates.stage = categorization.stage;
          updates.revenueRange = categorization.revenueRange;
          updates.fundingAmount = categorization.fundingAmount;
          updates.investmentType = categorization.investmentType;
          updates.businessModel = categorization.businessModel;
          updates.targetMarket = categorization.targetMarket;
          updates.techStack = categorization.techStack;
          updates.teamSize = categorization.teamSize;
          updates.aiConfidence = categorization.confidence;
        }

        // Add investor AI categorization fields if available
        if (investorCategorization && userType === "investor") {
          updates.preferredIndustries = investorCategorization.preferredIndustries;
          updates.preferredStages = investorCategorization.preferredStages;
          updates.investmentRange = investorCategorization.investmentRange;
          updates.investmentTypes = investorCategorization.investmentTypes;
          updates.riskTolerance = investorCategorization.riskTolerance;
          updates.investmentHorizon = investorCategorization.investmentHorizon;
          updates.geographicPreference = investorCategorization.geographicPreference;
          updates.portfolioSize = investorCategorization.portfolioSize;
          updates.investmentStyle = investorCategorization.investmentStyle;
          updates.aiConfidence = investorCategorization.confidence;
        }

        await updateUserProfile(updates);
      }
      
      // Redirect to dashboard based on user type
      if (userType === "business") {
        navigate("/business-dashboard");
      } else {
        navigate("/investor-dashboard");
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 2 && userType === "business") {
      return startupBrief.trim().length > 0;
    }
    if (currentStep === 2 && userType === "investor") {
      return investorBrief.trim().length > 0;
    }
    if (currentStep === 3 && (userType === "business" || userType === "investor")) {
      return !isGenerating; // Can proceed once AI categorization is done
    }
    return true;
  };

  const updateCategorizationField = (field: keyof StartupCategorization, value: string) => {
    if (categorization) {
      setCategorization({
        ...categorization,
        [field]: value
      });
    }
  };

  const updateInvestorCategorizationField = (field: keyof InvestorCategorization, value: string | string[]) => {
    if (investorCategorization) {
      setInvestorCategorization({
        ...investorCategorization,
        [field]: value
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Welcome to Investify!</h3>
            <p>
              We're excited to help you on your {userType === "business" ? "fundraising" : "investment"} journey. Let's get started by setting up your profile.
            </p>
          </div>
        );
      case 2:
        if (userType === "business") {
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-investify-primary" />
                <h3 className="text-lg font-medium">Tell us about your startup</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Give us a brief description of your startup. This will help investors understand your business and find the right match.
              </p>
              <div className="space-y-2">
                <Label htmlFor="startup-brief">Startup Brief *</Label>
                <Textarea
                  id="startup-brief"
                  placeholder="Describe your startup, what problem it solves, your target market, business model, and what makes it unique. Include any key achievements or milestones..."
                  value={startupBrief}
                  onChange={(e) => setStartupBrief(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <div className="text-sm text-gray-500 text-right">
                  {startupBrief.length}/1000 characters
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-investify-primary" />
                <h3 className="text-lg font-medium">Tell us about your investment preferences</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Describe your investment experience, preferred industries, investment size, risk tolerance, and what you're looking for in startups.
              </p>
              <div className="space-y-2">
                <Label htmlFor="investor-brief">Investment Brief *</Label>
                <Textarea
                  id="investor-brief"
                  placeholder="Describe your investment background, preferred industries, typical investment amounts, risk tolerance, investment timeline, and what type of startups you're interested in. Include any specific requirements or criteria..."
                  value={investorBrief}
                  onChange={(e) => setInvestorBrief(e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <div className="text-sm text-gray-500 text-right">
                  {investorBrief.length}/1000 characters
                </div>
              </div>
            </div>
          );
        }
      case 3:
        if (userType === "business") {
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-investify-primary" />
                <h3 className="text-lg font-medium">AI-Generated Startup Profile</h3>
              </div>
              
              {isGenerating ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-investify-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Our AI is analyzing your startup brief...</p>
                </div>
              ) : categorization ? (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Based on your startup brief, our AI has categorized your business. You can review and edit these details:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Industry */}
                    <div className="space-y-2">
                      <Label>Industry</Label>
                      <Select value={categorization.industry} onValueChange={(value) => updateCategorizationField('industry', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Energy">Energy</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Agriculture">Agriculture</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Stage */}
                    <div className="space-y-2">
                      <Label>Stage</Label>
                      <Select value={categorization.stage} onValueChange={(value) => updateCategorizationField('stage', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Idea Stage">Idea Stage</SelectItem>
                          <SelectItem value="MVP/Prototype">MVP/Prototype</SelectItem>
                          <SelectItem value="Early Stage">Early Stage</SelectItem>
                          <SelectItem value="Growth Stage">Growth Stage</SelectItem>
                          <SelectItem value="Expansion Stage">Expansion Stage</SelectItem>
                          <SelectItem value="Mature">Mature</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Revenue Range */}
                    <div className="space-y-2">
                      <Label>Revenue Range</Label>
                      <Select value={categorization.revenueRange} onValueChange={(value) => updateCategorizationField('revenueRange', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pre-revenue">Pre-revenue</SelectItem>
                          <SelectItem value="$0-$100K">$0-$100K</SelectItem>
                          <SelectItem value="$100K-$1M">$100K-$1M</SelectItem>
                          <SelectItem value="$1M-$10M">$1M-$10M</SelectItem>
                          <SelectItem value="$10M-$50M">$10M-$50M</SelectItem>
                          <SelectItem value="$50M+">$50M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Funding Amount */}
                    <div className="space-y-2">
                      <Label>Funding Amount Needed</Label>
                      <Select value={categorization.fundingAmount} onValueChange={(value) => updateCategorizationField('fundingAmount', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under $100K">Under $100K</SelectItem>
                          <SelectItem value="$100K-$500K">$100K-$500K</SelectItem>
                          <SelectItem value="$500K-$2M">$500K-$2M</SelectItem>
                          <SelectItem value="$2M-$10M">$2M-$10M</SelectItem>
                          <SelectItem value="$10M-$50M">$10M-$50M</SelectItem>
                          <SelectItem value="$50M+">$50M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Investment Type */}
                    <div className="space-y-2">
                      <Label>Investment Type</Label>
                      <Select value={categorization.investmentType} onValueChange={(value) => updateCategorizationField('investmentType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Series C+">Series C+</SelectItem>
                          <SelectItem value="Debt Financing">Debt Financing</SelectItem>
                          <SelectItem value="Grant Funding">Grant Funding</SelectItem>
                          <SelectItem value="Revenue-based Financing">Revenue-based Financing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Business Model */}
                    <div className="space-y-2">
                      <Label>Business Model</Label>
                      <Select value={categorization.businessModel} onValueChange={(value) => updateCategorizationField('businessModel', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B2B">B2B</SelectItem>
                          <SelectItem value="B2C">B2C</SelectItem>
                          <SelectItem value="B2B2C">B2B2C</SelectItem>
                          <SelectItem value="Marketplace">Marketplace</SelectItem>
                          <SelectItem value="Subscription">Subscription</SelectItem>
                          <SelectItem value="Freemium">Freemium</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Licensing">Licensing</SelectItem>
                          <SelectItem value="Advertising">Advertising</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {categorization.confidence && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        AI Confidence: {Math.round(categorization.confidence * 100)}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">AI categorization failed. You can still proceed manually.</p>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-investify-primary" />
                <h3 className="text-lg font-medium">AI-Generated Investment Profile</h3>
              </div>
              
              {isGenerating ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-investify-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Our AI is analyzing your investment preferences...</p>
                </div>
              ) : investorCategorization ? (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Based on your investment brief, our AI has categorized your preferences. You can review and edit these details:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Investment Range */}
                    <div className="space-y-2">
                      <Label>Investment Range</Label>
                      <Select value={investorCategorization.investmentRange} onValueChange={(value) => updateInvestorCategorizationField('investmentRange', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Under $10K">Under $10K</SelectItem>
                          <SelectItem value="$10K-$50K">$10K-$50K</SelectItem>
                          <SelectItem value="$50K-$250K">$50K-$250K</SelectItem>
                          <SelectItem value="$250K-$1M">$250K-$1M</SelectItem>
                          <SelectItem value="$1M-$5M">$1M-$5M</SelectItem>
                          <SelectItem value="$5M-$25M">$5M-$25M</SelectItem>
                          <SelectItem value="$25M+">$25M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Risk Tolerance */}
                    <div className="space-y-2">
                      <Label>Risk Tolerance</Label>
                      <Select value={investorCategorization.riskTolerance} onValueChange={(value) => updateInvestorCategorizationField('riskTolerance', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Conservative">Conservative</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Aggressive">Aggressive</SelectItem>
                          <SelectItem value="Very Aggressive">Very Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Investment Horizon */}
                    <div className="space-y-2">
                      <Label>Investment Horizon</Label>
                      <Select value={investorCategorization.investmentHorizon} onValueChange={(value) => updateInvestorCategorizationField('investmentHorizon', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Short-term (1-2 years)">Short-term (1-2 years)</SelectItem>
                          <SelectItem value="Medium-term (3-5 years)">Medium-term (3-5 years)</SelectItem>
                          <SelectItem value="Long-term (5-10 years)">Long-term (5-10 years)</SelectItem>
                          <SelectItem value="Very Long-term (10+ years)">Very Long-term (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Geographic Preference */}
                    <div className="space-y-2">
                      <Label>Geographic Preference</Label>
                      <Select value={investorCategorization.geographicPreference} onValueChange={(value) => updateInvestorCategorizationField('geographicPreference', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Local">Local</SelectItem>
                          <SelectItem value="Regional">Regional</SelectItem>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                          <SelectItem value="Global">Global</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Portfolio Size */}
                    <div className="space-y-2">
                      <Label>Portfolio Size</Label>
                      <Select value={investorCategorization.portfolioSize} onValueChange={(value) => updateInvestorCategorizationField('portfolioSize', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Individual Angel">Individual Angel</SelectItem>
                          <SelectItem value="Small Portfolio (2-10 investments)">Small Portfolio (2-10 investments)</SelectItem>
                          <SelectItem value="Medium Portfolio (11-25 investments)">Medium Portfolio (11-25 investments)</SelectItem>
                          <SelectItem value="Large Portfolio (26-50 investments)">Large Portfolio (26-50 investments)</SelectItem>
                          <SelectItem value="Very Large Portfolio (50+ investments)">Very Large Portfolio (50+ investments)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Investment Style */}
                    <div className="space-y-2">
                      <Label>Investment Style</Label>
                      <Select value={investorCategorization.investmentStyle} onValueChange={(value) => updateInvestorCategorizationField('investmentStyle', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Passive Investor">Passive Investor</SelectItem>
                          <SelectItem value="Active Advisor">Active Advisor</SelectItem>
                          <SelectItem value="Board Participant">Board Participant</SelectItem>
                          <SelectItem value="Hands-on Mentor">Hands-on Mentor</SelectItem>
                          <SelectItem value="Strategic Partner">Strategic Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Display preferred industries as read-only for now */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Preferred Industries</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {investorCategorization.preferredIndustries.join(', ')}
                    </p>
                  </div>

                  {/* Display preferred stages as read-only for now */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Preferred Stages</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {investorCategorization.preferredStages.join(', ')}
                    </p>
                  </div>

                  {investorCategorization.confidence && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        AI Confidence: {Math.round(investorCategorization.confidence * 100)}%
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">AI categorization failed. You can still proceed manually.</p>
                </div>
              )}
            </div>
          );
        }
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Platform Benefits</h3>
            <p>
              Here's what you can do on Investify:
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{userType === "business" ? "Get matched with potential investors" : "Discover promising startups"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Access detailed analytics and insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Secure messaging and communication</span>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">You're All Set!</h3>
            <p>
              Your account has been successfully created. You're now ready to explore Investify and {userType === "business" ? "connect with investors" : "discover great startups"}.
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
            disabled={!canProceed()}
            className="w-full bg-investify-primary hover:bg-investify-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
