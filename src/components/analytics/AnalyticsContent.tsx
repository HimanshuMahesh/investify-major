
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for analytics
const profileViewsData = [
  { day: "Mon", views: 12 },
  { day: "Tue", views: 19 },
  { day: "Wed", views: 15 },
  { day: "Thu", views: 27 },
  { day: "Fri", views: 32 },
  { day: "Sat", views: 24 },
  { day: "Sun", views: 10 },
];

const matchQualityData = [
  { name: "90-100%", value: 12, color: "#10B981" },
  { name: "70-89%", value: 25, color: "#3B82F6" },
  { name: "50-69%", value: 18, color: "#6366F1" },
  { name: "<50%", value: 8, color: "#9CA3AF" },
];

const industryInterestData = [
  { industry: "AI & ML", investor: 65, business: 52 },
  { industry: "FinTech", investor: 45, business: 38 },
  { industry: "Healthcare", investor: 55, business: 70 },
  { industry: "CleanTech", investor: 40, business: 45 },
  { industry: "SaaS", investor: 70, business: 58 },
];

const fundingMetricsData = [
  { month: "Jan", target: 500000, raised: 320000 },
  { month: "Feb", target: 500000, raised: 380000 },
  { month: "Mar", target: 500000, raised: 420000 },
  { month: "Apr", target: 500000, raised: 490000 },
  { month: "May", target: 600000, raised: 550000 },
  { month: "Jun", target: 600000, raised: 620000 },
];

const engagementMetrics = [
  { name: "Profile Views", value: 245 },
  { name: "Messages", value: 32 },
  { name: "Meeting Requests", value: 15 },
  { name: "Document Downloads", value: 21 },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', '#8884D8'];

const AnalyticsContent = () => {
  // Adjust based on user type
  const userType = localStorage.getItem("investify_user_type") as "business" | "investor" | null;
  
  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your performance and engagement metrics</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Select defaultValue="last7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="thisyear">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {engagementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600 font-medium">↑ 12% from last week</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${COLORS[index % COLORS.length]}-100`}>
                  {/* Would use an appropriate icon here */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          {userType === "business" && <TabsTrigger value="funding">Funding</TabsTrigger>}
          {userType === "investor" && <TabsTrigger value="investments">Investments</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Views Over Time</CardTitle>
                <CardDescription>Daily profile views over the last week</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={profileViewsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3B82F6"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Match Quality Distribution</CardTitle>
                <CardDescription>Breakdown of current matches by quality score</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={matchQualityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {matchQualityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Industry Interest Comparison</CardTitle>
                <CardDescription>Interest levels across different industries</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={industryInterestData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      barSize={20}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="industry" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="investor" name="Investor Interest" fill="#8884d8" />
                      <Bar dataKey="business" name="Business Activity" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 gap-6">
            {/* Content for engagement tab would go here */}
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Metrics</CardTitle>
                <CardDescription>Detailed breakdown of platform engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Engagement metrics content would go here...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="matches">
          <div className="grid grid-cols-1 gap-6">
            {/* Content for matches tab would go here */}
            <Card>
              <CardHeader>
                <CardTitle>Match Performance</CardTitle>
                <CardDescription>Detailed analysis of your matching activity</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Match performance content would go here...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="funding">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
                <CardDescription>Track your funding goals vs. actuals</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fundingMetricsData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      barSize={20}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="target" name="Target" fill="#8884d8" />
                      <Bar dataKey="raised" name="Raised" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="investments">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Portfolio</CardTitle>
                <CardDescription>Overview of your investment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Investment portfolio content would go here...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsContent;
