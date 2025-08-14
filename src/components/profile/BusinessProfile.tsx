import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Check, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock profile data
const profileData = {
  company: {
    name: "TechSolutions AI",
    logo: "TS",
    foundingDate: "2019-05-12",
    teamSize: 15,
    location: "Bangalore, Karnataka",
    website: "https://techsolutionsai.com",
    description: "AI-powered workflow automation platform for enterprises",
  },
  financial: {
    revenue: "₹50 Lakhs",
    growthRate: "120",
    burnRate: "₹4 Lakhs",
    runwayMonths: 12,
    valuation: "₹12 Crore",
  },
  pitch: {
    problem: "Enterprises waste countless hours on repetitive tasks that could be automated",
    solution: "Our AI platform learns workflows and automates them with minimal setup",
    marketSize: "₹5000 Crore",
    competitors: "Traditional RPA vendors, manual processes",
    advantage: "Our AI requires no coding and learns continuously from user behavior",
    traction: "15 enterprise customers, 120% YoY growth",
  },
  funding: {
    amount: "25000000",
    equity: "15",
    useOfFunds: "40% Product Development, 35% Sales & Marketing, 25% Operations",
    timeline: "18 months",
    previousRounds: "Seed round of ₹50 Lakhs in 2020",
  },
  documents: {
    pitchDeck: "tech_solutions_deck.pdf",
    businessPlan: "tech_solutions_plan.pdf",
    financials: "tech_solutions_financials.xlsx",
  }
};

// Define the schemas with proper types
const companySchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  foundingDate: z.string(),
  teamSize: z.coerce.number().min(1, { message: "Team size must be at least 1." }),
  location: z.string(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

const financialSchema = z.object({
  revenue: z.string(),
  growthRate: z.string(),
  burnRate: z.string(),
  runwayMonths: z.coerce.number().min(1, { message: "Runway must be at least 1 month." }),
  valuation: z.string(),
});

const pitchSchema = z.object({
  problem: z.string().min(10, { message: "Problem statement must be at least 10 characters." }),
  solution: z.string().min(10, { message: "Solution must be at least 10 characters." }),
  marketSize: z.string(),
  competitors: z.string(),
  advantage: z.string().min(10, { message: "Competitive advantage must be at least 10 characters." }),
  traction: z.string(),
});

const fundingSchema = z.object({
  amount: z.string(),
  equity: z.string(),
  useOfFunds: z.string(),
  timeline: z.string(),
  previousRounds: z.string(),
});

// Infer the types from schemas for better type safety
type CompanyFormValues = z.infer<typeof companySchema>;
type FinancialFormValues = z.infer<typeof financialSchema>;
type PitchFormValues = z.infer<typeof pitchSchema>;
type FundingFormValues = z.infer<typeof fundingSchema>;

const BusinessProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  
  // Calculate profile completion
  const calculateCompletion = () => {
    let total = 0;
    let completed = 0;
    
    // Simple calculation - count non-empty fields
    Object.values(profileData).forEach((section) => {
      Object.values(section).forEach((field) => {
        total++;
        if (field && field !== "") {
          completed++;
        }
      });
    });
    
    return Math.round((completed / total) * 100);
  };
  
  const completionPercentage = calculateCompletion();
  
  // Company form
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: profileData.company.name,
      foundingDate: profileData.company.foundingDate,
      teamSize: profileData.company.teamSize,
      location: profileData.company.location,
      website: profileData.company.website,
      description: profileData.company.description,
    },
  });
  
  // Financial form
  const financialForm = useForm<FinancialFormValues>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      revenue: profileData.financial.revenue,
      growthRate: profileData.financial.growthRate,
      burnRate: profileData.financial.burnRate,
      runwayMonths: profileData.financial.runwayMonths,
      valuation: profileData.financial.valuation,
    },
  });
  
  // Pitch form
  const pitchForm = useForm<PitchFormValues>({
    resolver: zodResolver(pitchSchema),
    defaultValues: {
      problem: profileData.pitch.problem,
      solution: profileData.pitch.solution,
      marketSize: profileData.pitch.marketSize,
      competitors: profileData.pitch.competitors,
      advantage: profileData.pitch.advantage,
      traction: profileData.pitch.traction,
    },
  });
  
  // Funding form
  const fundingForm = useForm<FundingFormValues>({
    resolver: zodResolver(fundingSchema),
    defaultValues: {
      amount: profileData.funding.amount,
      equity: profileData.funding.equity,
      useOfFunds: profileData.funding.useOfFunds,
      timeline: profileData.funding.timeline,
      previousRounds: profileData.funding.previousRounds,
    },
  });
  
  const onSubmitCompany = (data: CompanyFormValues) => {
    toast({
      title: "Company information updated",
      description: "Your company profile has been saved successfully.",
    });
  };
  
  const onSubmitFinancial = (data: FinancialFormValues) => {
    toast({
      title: "Financial details updated",
      description: "Your financial information has been saved successfully.",
    });
  };
  
  const onSubmitPitch = (data: PitchFormValues) => {
    toast({
      title: "Pitch information updated",
      description: "Your pitch details have been saved successfully.",
    });
  };
  
  const onSubmitFunding = (data: FundingFormValues) => {
    toast({
      title: "Funding requirements updated",
      description: "Your funding requirements have been saved successfully.",
    });
  };
  
  const handleFileUpload = (type: string) => {
    toast({
      title: "Document uploaded",
      description: `Your ${type} has been uploaded successfully.`,
    });
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-2">Business Profile</h1>
      <p className="text-gray-600 mb-6">Complete your profile to improve investor matches</p>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Profile Completion</div>
          <div className="text-sm font-medium text-investify-primary">{completionPercentage}%</div>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>
      
      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="pitch">Pitch</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic details about your company that investors will see
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={companyForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="foundingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founding Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={companyForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4} 
                            placeholder="Briefly describe what your company does..." 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A concise description of your business (50-200 words recommended)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Company Information</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
              <CardDescription>
                Key financial metrics that showcase your business performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...financialForm}>
                <form onSubmit={financialForm.handleSubmit(onSubmitFinancial)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={financialForm.control}
                      name="revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Revenue</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Current or projected annual revenue</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="growthRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Growth Rate (%)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Year-over-year growth percentage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="burnRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Burn Rate</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="runwayMonths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Runway (months)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={financialForm.control}
                      name="valuation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Valuation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>If known/applicable</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Financial Details</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pitch">
          <Card>
            <CardHeader>
              <CardTitle>Pitch Information</CardTitle>
              <CardDescription>
                Details about your business proposition for investors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...pitchForm}>
                <form onSubmit={pitchForm.handleSubmit(onSubmitPitch)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={pitchForm.control}
                      name="problem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem Statement</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder="What problem does your business solve?" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={pitchForm.control}
                      name="solution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Solution</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder="How does your product/service solve this problem?" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={pitchForm.control}
                        name="marketSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Market Size</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={pitchForm.control}
                        name="competitors"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Competitors</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={pitchForm.control}
                      name="advantage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competitive Advantage</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder="What makes your solution unique or better than alternatives?" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={pitchForm.control}
                      name="traction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Traction</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Key metrics, customers, partnerships, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Pitch Information</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="funding">
          <Card>
            <CardHeader>
              <CardTitle>Funding Requirements</CardTitle>
              <CardDescription>
                Details about your funding needs and terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...fundingForm}>
                <form onSubmit={fundingForm.handleSubmit(onSubmitFunding)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={fundingForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Amount ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={fundingForm.control}
                      name="equity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equity Offered (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={fundingForm.control}
                      name="useOfFunds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Use of Funds</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder="How will the investment be used?" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormField
                        control={fundingForm.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Funding Timeline</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              How long will this funding last?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={fundingForm.control}
                        name="previousRounds"
                        render={({ field }) => (
                          <FormItem className="mt-6">
                            <FormLabel>Previous Funding</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Details of any previous funding rounds
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Save Funding Requirements</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Upload supporting documents for investors to review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1">Pitch Deck</h3>
                        <p className="text-gray-500 text-sm">PDF or PowerPoint, 10MB max</p>
                      </div>
                      {profileData.documents.pitchDeck ? (
                        <div className="bg-green-100 text-green-700 p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : null}
                    </div>
                    
                    {profileData.documents.pitchDeck ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                          <span>{profileData.documents.pitchDeck}</span>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Button size="sm" variant="outline">Replace</Button>
                          <Button size="sm" variant="outline" className="text-red-500">Remove</Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full mt-4" 
                        onClick={() => handleFileUpload("pitch deck")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Pitch Deck
                      </Button>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1">Business Plan</h3>
                        <p className="text-gray-500 text-sm">PDF or Word, 10MB max</p>
                      </div>
                      {profileData.documents.businessPlan ? (
                        <div className="bg-green-100 text-green-700 p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : null}
                    </div>
                    
                    {profileData.documents.businessPlan ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                          <span>{profileData.documents.businessPlan}</span>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Button size="sm" variant="outline">Replace</Button>
                          <Button size="sm" variant="outline" className="text-red-500">Remove</Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => handleFileUpload("business plan")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Business Plan
                      </Button>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1">Financial Projections</h3>
                        <p className="text-gray-500 text-sm">Excel or PDF, 10MB max</p>
                      </div>
                      {profileData.documents.financials ? (
                        <div className="bg-green-100 text-green-700 p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      ) : null}
                    </div>
                    
                    {profileData.documents.financials ? (
                      <div className="mt-4">
                        <div className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm">
                          <span>{profileData.documents.financials}</span>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Button size="sm" variant="outline">Replace</Button>
                          <Button size="sm" variant="outline" className="text-red-500">Remove</Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => handleFileUpload("financial projections")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Financials
                      </Button>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1">Additional Document</h3>
                        <p className="text-gray-500 text-sm">Any supporting file, 10MB max</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => handleFileUpload("additional document")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessProfile;
