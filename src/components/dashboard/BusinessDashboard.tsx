
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

// Extract components to improve maintainability
const ProfileCard = ({ profileCompletion }: { profileCompletion: number }) => (
  <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <CardTitle>Profile Completion</CardTitle>
      <CardDescription>Complete your profile to improve matches</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{profileCompletion}% complete</span>
        <span className="text-sm font-medium text-investify-primary">26/40</span>
      </div>
      <Progress value={profileCompletion} className="h-2 bg-gray-100" indicatorClassName="bg-investify-primary" />
      <Button variant="link" className="p-0 mt-4 h-auto text-investify-primary hover:text-investify-primary/80">
        Complete your profile <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

const StatsCard = () => (
  <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <CardTitle>Match Statistics</CardTitle>
      <CardDescription>Your investor matching activity</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-investify-mint/20 p-4 rounded-md text-center border-l-2 border-investify-primary">
          <p className="text-2xl font-bold text-investify-primary">12</p>
          <p className="text-sm text-gray-500">Total Matches</p>
        </div>
        <div className="bg-investify-mint/20 p-4 rounded-md text-center border-l-2 border-investify-primary">
          <p className="text-2xl font-bold text-investify-primary">5</p>
          <p className="text-sm text-gray-500">New This Week</p>
        </div>
        <div className="bg-investify-mint/20 p-4 rounded-md text-center border-l-2 border-investify-primary">
          <p className="text-2xl font-bold text-investify-primary">3</p>
          <p className="text-sm text-gray-500">Messages</p>
        </div>
        <div className="bg-investify-mint/20 p-4 rounded-md text-center border-l-2 border-investify-primary">
          <p className="text-2xl font-bold text-investify-primary">8</p>
          <p className="text-sm text-gray-500">Profile Views</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActionsCard = () => (
  <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription>Common tasks and updates</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
        Update your pitch
      </Button>
      <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
        Review funding requirements
      </Button>
      <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
        Upload financial documents
      </Button>
      <Button variant="outline" className="w-full justify-start hover:bg-investify-mint/20 hover:border-investify-primary">
        Respond to messages (3)
      </Button>
    </CardContent>
  </Card>
);

const BusinessDashboard = () => {
  // Mock data for the dashboard
  const profileCompletion = 65;
  const potentialMatches = [
    {
      id: 1,
      name: "Venture Capital Partners",
      logo: "VC",
      type: "Venture Capital",
      focus: "Tech & SaaS",
      compatibilityScore: 92,
      investmentRange: "₹75L - ₹3.75Cr",
    },
    {
      id: 2,
      name: "Growth Equity Fund",
      logo: "GE",
      type: "Private Equity",
      focus: "Healthcare & Fintech",
      compatibilityScore: 86,
      investmentRange: "₹3.75Cr - ₹15Cr",
    },
    {
      id: 3,
      name: "Angel Network",
      logo: "AN",
      type: "Angel Investors",
      focus: "Early Stage Startups",
      compatibilityScore: 78,
      investmentRange: "₹18L - ₹75L",
    },
  ];

  const recentActivity = [
    { id: 1, type: "view", investor: "Tech Ventures", time: "2 hours ago" },
    { id: 2, type: "message", investor: "Growth Partners", time: "1 day ago" },
    { id: 3, type: "bookmark", investor: "Angel Investors Group", time: "2 days ago" },
  ];

  return (
    <div className="py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 border-l-4 border-investify-primary pl-3">Business Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <ProfileCard profileCompletion={profileCompletion} />
        <StatsCard />
        <QuickActionsCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Potential Investor Matches</CardTitle>
              <CardDescription>Investors who might be interested in your business</CardDescription>
            </CardHeader>
            <CardContent>
              {potentialMatches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4 mb-4 flex items-center hover:border-investify-primary hover:bg-investify-mint/10 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-investify-primary text-white flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                    {match.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start flex-wrap md:flex-nowrap">
                      <div>
                        <h3 className="font-semibold text-lg">{match.name}</h3>
                        <p className="text-sm text-gray-500">{match.type} • {match.focus}</p>
                        <p className="text-sm mt-1">Investment: {match.investmentRange}</p>
                      </div>
                      <div className="text-right mt-2 md:mt-0">
                        <div className="bg-investify-mint/30 text-investify-primary font-medium rounded px-2 py-1 text-sm">
                          {match.compatibilityScore}% match
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap mt-4 gap-2">
                      <Button size="sm" className="bg-investify-primary hover:bg-investify-primary/90">View Details</Button>
                      <Button size="sm" variant="outline" className="hover:bg-investify-mint/20 hover:border-investify-primary">Send Message</Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="link" className="mt-2 text-investify-primary hover:text-investify-primary/80">
                See all matches <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-t-2 border-investify-primary bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest interactions with investors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start pb-4 border-b last:border-0 last:pb-0 hover:bg-investify-mint/10 p-2 rounded-md transition-colors">
                    <div className="h-8 w-8 rounded-full bg-investify-primary/20 flex items-center justify-center mr-3 text-investify-primary flex-shrink-0">
                      {activity.type === "view" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {activity.type === "message" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      )}
                      {activity.type === "bookmark" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.investor}</span>
                        {activity.type === "view" && " viewed your profile"}
                        {activity.type === "message" && " sent you a message"}
                        {activity.type === "bookmark" && " bookmarked your business"}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 p-0 h-auto text-investify-primary hover:text-investify-primary/80">
                View all activity <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
