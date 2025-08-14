
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";

// Extract components for better maintainability
const StatCard = ({ label, value }: { label: string; value: string }) => (
  <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <CardDescription>{label}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-investify-primary">{value}</p>
    </CardContent>
  </Card>
);

const ActivityItem = ({ business, action, time }: { business: string; action: string; time: string }) => (
  <div className="flex items-start pb-4 border-b last:border-0 last:pb-0 hover:bg-investify-mint/10 p-2 rounded-md transition-colors">
    <div className="h-8 w-8 rounded-full bg-investify-primary/20 flex items-center justify-center mr-3 text-investify-primary flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
      </svg>
    </div>
    <div>
      <p className="text-sm">
        <span className="font-medium">{business}</span> {action}
      </p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

const BusinessMatchCard = ({ business }: { business: any }) => (
  <div key={business.id} className="border rounded-lg p-4 mb-4 hover:border-investify-primary hover:bg-investify-mint/10 transition-colors">
    <div className="flex items-start flex-col md:flex-row">
      <div className="h-12 w-12 rounded-full bg-investify-primary text-white flex items-center justify-center text-xl font-bold mr-4 mb-4 md:mb-0 flex-shrink-0">
        {business.logo}
      </div>
      <div className="flex-1 w-full md:w-auto">
        <div className="flex justify-between items-start flex-wrap md:flex-nowrap gap-2">
          <div>
            <h3 className="font-semibold text-lg">{business.name}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="bg-investify-mint/20 text-investify-primary border-investify-primary/20">{business.industry}</Badge>
              <Badge variant="outline" className="bg-investify-mint/20 text-investify-primary border-investify-primary/20">{business.stage}</Badge>
              <Badge variant="outline" className="bg-investify-mint/20 text-investify-primary border-investify-primary/20">{business.location}</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {business.description}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-investify-mint/30 text-investify-primary font-medium rounded px-2 py-1 text-sm">
              {business.compatibilityScore}% match
            </div>
            <p className="mt-1 text-sm font-medium">
              Seeking: {business.fundingNeeded}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap mt-4 gap-2">
          <Button size="sm" className="bg-investify-primary hover:bg-investify-primary/90">View Details</Button>
          <Button size="sm" variant="outline" className="hover:bg-investify-mint/20 hover:border-investify-primary">Contact</Button>
        </div>
      </div>
    </div>
  </div>
);

const InvestorDashboard = () => {
  // Mock data for the dashboard
  const matchedBusinesses = [
    {
      id: 1,
      name: "TechSolutions AI",
      logo: "TS",
      industry: "AI & Machine Learning",
      stage: "Series A",
      fundingNeeded: "₹1.9Cr",
      compatibilityScore: 94,
      description: "AI-powered workflow automation platform for enterprises",
      location: "Bengaluru",
    },
    {
      id: 2,
      name: "MedHealth",
      logo: "MH",
      industry: "Healthcare",
      stage: "Seed",
      fundingNeeded: "₹60L",
      compatibilityScore: 87,
      description: "Digital health platform for remote patient monitoring",
      location: "Mumbai",
    },
    {
      id: 3,
      name: "GreenEnergy",
      logo: "GE",
      industry: "CleanTech",
      stage: "Series B",
      fundingNeeded: "₹3.75Cr",
      compatibilityScore: 82,
      description: "Renewable energy solutions for commercial buildings",
      location: "Delhi",
    },
  ];

  const portfolioStats = [
    { label: "Active Investments", value: "8" },
    { label: "Deal Pipeline", value: "12" },
    { label: "Due Diligence", value: "3" },
    { label: "Total Committed", value: "₹3.2Cr" },
  ];

  const recentActivity = [
    { id: 1, business: "TechSolutions AI", action: "Updated their pitch", time: "3 hours ago" },
    { id: 2, business: "MedHealth", action: "Added new financial documents", time: "1 day ago" },
    { id: 3, business: "FinanceApp", action: "Responded to your questions", time: "2 days ago" },
  ];

  return (
    <div className="py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 border-l-4 border-investify-primary pl-3">Investor Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {portfolioStats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Investment Opportunities</CardTitle>
                  <CardDescription>Businesses matching your investment criteria</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-investify-mint/20 hover:border-investify-primary">
                  Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recommended">
                <TabsList className="mb-4">
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>
                <TabsContent value="recommended">
                  {matchedBusinesses.map((business) => (
                    <BusinessMatchCard key={business.id} business={business} />
                  ))}
                  <Button variant="link" className="mt-2 text-investify-primary hover:text-investify-primary/80">
                    See all matches <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </TabsContent>
                <TabsContent value="new">
                  <div className="text-center py-8 text-gray-500">
                    <p>Loading new investment opportunities...</p>
                  </div>
                </TabsContent>
                <TabsContent value="saved">
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven't saved any businesses yet.</p>
                    <Button variant="link" className="text-investify-primary hover:text-investify-primary/80">Explore recommended matches</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col gap-6">
          <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} {...activity} />
                ))}
              </div>
              <Button variant="link" className="mt-4 p-0 h-auto text-investify-primary hover:text-investify-primary/80">
                View all activity <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
                Update investment preferences
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
                Review pending due diligence
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
                Schedule meetings (2)
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
                Respond to messages (5)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
