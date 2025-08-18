
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowRight, 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowDownUp, 
  Grid2X2, 
  List,
  Heart,
  MessageSquare,
  X,
  Loader2
} from "lucide-react";
import { mockBusinesses, mockInvestors, Business, Investor } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Add this function after the imports and before the MatchesContent component
const renderApiResponseCards = (apiResponse: any) => {
  if (!apiResponse) return null;

  // If it's an error response
  if (apiResponse.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium mb-2">Error:</h3>
        <p className="text-red-700">{apiResponse.error}</p>
        {apiResponse.details && (
          <p className="text-red-700 mt-1">Details: {apiResponse.details}</p>
        )}
        {apiResponse.raw && (
          <details className="mt-3">
            <summary className="text-red-600 cursor-pointer">Show raw response</summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto max-h-40">
              {apiResponse.raw}
            </pre>
          </details>
        )}
      </div>
    );
  }

  // If it's a raw text response
  if (apiResponse.raw) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-medium mb-2">Raw Response (Not JSON):</h3>
        <pre className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded overflow-auto max-h-60">
          {apiResponse.raw}
        </pre>
      </div>
    );
  }

  // If it's a successful JSON response, render as cards
  const renderMatchCard = (match: any, index: number) => {
    // Handle different response structures
    const matchData = match.match || match.investor || match.startup || match;
    const score = match.score || match.compatibility_score || match.match_score || 'N/A';
    const name = matchData?.displayName || matchData?.name || 'Unknown';
    const industry = matchData?.industry || 'Not specified';
    const description = matchData?.description || matchData?.startupBrief || 'No description available';
    const location = matchData?.location || 'Not specified';
    const funding = matchData?.funding_needed || matchData?.fundingAmount || matchData?.investmentRange || 'Not specified';
    const stage = matchData?.stage || 'Not specified';
    const email = matchData?.email || 'Not available';

    return (
      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-investify-navy text-white flex items-center justify-center text-lg font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="text-sm">{email}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {typeof score === 'number' ? `${score}%` : score} Match
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">{industry}</Badge>
              {stage && <Badge variant="outline" className="text-xs">{stage}</Badge>}
              {location && <Badge variant="outline" className="text-xs">{location}</Badge>}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {matchData?.userType === 'investor' ? 'Investment Range:' : 'Funding Needed:'}
              </span>
              <span className="text-gray-600">{funding}</span>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Handle different response structures
  let matches = [];
  if (Array.isArray(apiResponse)) {
    matches = apiResponse;
  } else if (apiResponse.matches && Array.isArray(apiResponse.matches)) {
    matches = apiResponse.matches;
  } else if (apiResponse.top_matches && Array.isArray(apiResponse.top_matches)) {
    matches = apiResponse.top_matches;
  } else if (apiResponse.recommendations && Array.isArray(apiResponse.recommendations)) {
    matches = apiResponse.recommendations;
  } else {
    // If it's a single object, wrap it in an array
    matches = [apiResponse];
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No matches found in the response.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match, index) => renderMatchCard(match, index))}
    </div>
  );
};

// Adjust the component based on user type
const MatchesContent = () => {
  const { userProfile } = useAuth();
  
  console.log('Current user profile:', userProfile);
  console.log('Current user type:', userProfile?.userType);
  
  // Temporary debug section for testing
  const [debugUserType, setDebugUserType] = useState<'business' | 'investor' | null>(null);
  
  // Use debug user type if set, otherwise use the actual user profile
  const currentUserType = debugUserType || userProfile?.userType;
  
  return (
    <div>
      {/* Temporary debug controls - remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Debug Mode:</p>
          <p>Current user type: {currentUserType}</p>
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              onClick={() => setDebugUserType('business')}
              variant={currentUserType === 'business' ? 'default' : 'outline'}
            >
              Set as Business
            </Button>
            <Button 
              size="sm" 
              onClick={() => setDebugUserType('investor')}
              variant={currentUserType === 'investor' ? 'default' : 'outline'}
            >
              Set as Investor
            </Button>
            <Button 
              size="sm" 
              onClick={() => setDebugUserType(null)}
              variant="outline"
            >
              Use Real Profile
            </Button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      {currentUserType === "business" ? <BusinessMatchesView /> : <InvestorMatchesView />}
    </div>
  );
};

const InvestorMatchesView = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    fundingRange: [0, 5000000],
    industries: [] as string[],
    stages: [] as string[],
    locations: [] as string[],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  // All available filter options
  const filterOptions = {
    industries: ["AI & Machine Learning", "Healthcare", "FinTech", "CleanTech", "Supply Chain", "SaaS"],
    stages: ["Pre-seed", "Seed", "Series A", "Series B", "Series C"],
    locations: ["San Francisco, CA", "New York, NY", "Boston, MA", "Austin, TX", "Chicago, IL"],
  };
  
  // Filter and sort businesses
  const filteredBusinesses = mockBusinesses
    .filter((business) => {
      // Search term filter
      if (searchTerm && !business.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !business.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Industry filter
      if (filterValues.industries.length > 0 && 
          !filterValues.industries.includes(business.industry)) {
        return false;
      }
      
      // Stage filter
      if (filterValues.stages.length > 0 && 
          !filterValues.stages.includes(business.stage)) {
        return false;
      }
      
      // Location filter
      if (filterValues.locations.length > 0 && 
          !filterValues.locations.includes(business.location)) {
        return false;
      }
      
      // Funding range filter
      const fundingNum = parseInt(business.fundingNeeded.replace(/[^0-9]/g, ""));
      if (fundingNum < filterValues.fundingRange[0] || fundingNum > filterValues.fundingRange[1]) {
        return false;
      }
      
      return true;
    });

  const toggleIndustryFilter = (industry: string) => {
    setFilterValues(prev => {
      if (prev.industries.includes(industry)) {
        return {...prev, industries: prev.industries.filter(i => i !== industry)};
      } else {
        return {...prev, industries: [...prev.industries, industry]};
      }
    });
  };
  
  const toggleStageFilter = (stage: string) => {
    setFilterValues(prev => {
      if (prev.stages.includes(stage)) {
        return {...prev, stages: prev.stages.filter(s => s !== stage)};
      } else {
        return {...prev, stages: [...prev.stages, stage]};
      }
    });
  };
  
  const toggleLocationFilter = (location: string) => {
    setFilterValues(prev => {
      if (prev.locations.includes(location)) {
        return {...prev, locations: prev.locations.filter(l => l !== location)};
      } else {
        return {...prev, locations: [...prev.locations, location]};
      }
    });
  };
  
  const handleSaveMatch = (business: Business) => {
    toast({
      title: "Business saved",
      description: `You've saved ${business.name} to your matches.`,
    });
  };
  
  const handleContactBusiness = (business: Business) => {
    toast({
      title: "Message initiated",
      description: `You can now message ${business.name}.`,
    });
  };
  
  const handleRejectMatch = (business: Business) => {
    toast({
      title: "Match rejected",
      description: `You've removed ${business.name} from your matches.`,
    });
  };

  const findStartups = async () => {
    setLoading(true);
    try {
      console.log('Calling API endpoint with POST for startups...');
      
      // ✅ FETCH ACTUAL STARTUPS FROM FIREBASE
      console.log('Fetching startups from Firebase...');
      let startups: any[] = [];
      
      try {
        const startupsQuery = query(
          collection(db, 'users'),
          where('userType', '==', 'business')
        );
        
        console.log('Firebase query created for startups:', startupsQuery);
        const startupsSnapshot = await getDocs(startupsQuery);
        console.log('Firebase snapshot received for startups, size:', startupsSnapshot.size);
        
        startupsSnapshot.forEach((doc) => {
          const startupData = doc.data();
          console.log('Processing startup doc:', doc.id, startupData);
          startups.push({
            uid: doc.id,
            displayName: startupData.displayName || 'Unknown Startup',
            email: startupData.email || '',
            userType: startupData.userType || 'business',
            industry: startupData.industry || 'General',
            stage: startupData.stage || 'Not specified',
            funding_needed: startupData.fundingAmount || 'Not specified',
            description: startupData.startupBrief || 'Not specified'
          });
        });
        
        console.log('Fetched startups from Firebase:', startups);
        console.log('Number of startups found:', startups.length);
        
        if (startups.length === 0) {
          toast({
            title: "No Startups Found",
            description: "No startups are currently registered in Firebase. Please try again after startups sign up.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } catch (firebaseError) {
        console.error('Error fetching startups from Firebase:', firebaseError);
        toast({
          title: "Firebase Error",
          description: "Failed to fetch startups from database. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
             // Use the actual investor data from user profile - NO DUMMY DATA
       const requestData = {
         investor: {
           uid: userProfile?.uid || "investor_" + Date.now(),
           displayName: userProfile?.displayName || "My Investment Fund",
           email: userProfile?.email || "investor@example.com",
           name: userProfile?.displayName || "My Investment Fund",
           industry: userProfile?.industry || "Technology",
           investmentRange: "500k-2M", // Default investment range for investors
           description: userProfile?.startupBrief || "An investor seeking opportunities"
         },
         startups: startups // Array of all startups from Firebase
       };
       
       console.log('Request data for startups:', requestData);
       console.log('Investor data:', requestData.investor);
       console.log('Startups array length:', requestData.startups.length);
       console.log('Startups array:', requestData.startups);
       
       // Simple POST request to your API endpoint for finding startups
       const response = await fetch('https://70c23b88793c.ngrok-free.app/api/matchmaking/find-startup-matches/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Raw API Response:', responseText);
      
      // Check if response is HTML (error page)
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        console.log('Received HTML response, likely an error page');
        setApiResponse({ error: 'HTML response received', raw: responseText });
        setHasSearched(true);
        toast({
          title: "API Error",
          description: "The API returned an HTML page instead of data.",
          variant: "destructive",
        });
        return;
      }

      // Try to parse as JSON first
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed JSON data:', data);
        
        // Display EXACT API response - no processing, no dummy data
        setApiResponse(data);
      } catch (parseError) {
        console.log('Failed to parse as JSON, treating as text');
        
        // If it's not JSON, display the raw text response
        setApiResponse({ raw: responseText });
      }
      
      setHasSearched(true);
      toast({
        title: "API Response Received",
        description: "Successfully fetched data from the API.",
      });
      
    } catch (error) {
      console.error('Error fetching startups:', error);
      
      setApiResponse({
        error: 'Failed to fetch from API',
        details: error instanceof Error ? error.message : 'Unknown error',
        raw: 'No response received'
      });
      setHasSearched(true);
      toast({
        title: "API Error",
        description: `Failed to fetch from API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Investment Opportunities</h1>
          <p className="text-gray-600">Find and connect with promising businesses</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            className="ml-2"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters {filterValues.industries.length || filterValues.stages.length || filterValues.locations.length ? 
                      `(${filterValues.industries.length + filterValues.stages.length + filterValues.locations.length})` : 
                      ''}
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Find Startups Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Click the button to find startups using your investor profile</p>
              </div>
              <Button 
                onClick={findStartups}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding Startups...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find Startups
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* API Response Display */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">API Response</h2>
                  <p className="text-sm text-gray-600">
                    Response from the API endpoint
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {renderApiResponseCards(apiResponse)}
            </CardContent>
          </Card>
        )}
      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters panel */}
          {filtersOpen && (
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Filters</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFilterValues({
                        fundingRange: [0, 5000000],
                        industries: [],
                        stages: [],
                        locations: [],
                      })}
                    >
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-0">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Funding Amount</h3>
                    <div className="pl-2 pr-2">
                      <Slider
                        defaultValue={[0, 5000000]}
                        max={5000000}
                        step={100000}
                        value={filterValues.fundingRange}
                        onValueChange={(value) => setFilterValues({ ...filterValues, fundingRange: value })}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <span>${(filterValues.fundingRange[0]/1000000).toFixed(1)}M</span>
                      <span>${(filterValues.fundingRange[1]/1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Industries</h3>
                    <div className="space-y-2">
                      {filterOptions.industries.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`industry-${industry}`} 
                            checked={filterValues.industries.includes(industry)}
                            onCheckedChange={() => toggleIndustryFilter(industry)}
                          />
                          <label 
                            htmlFor={`industry-${industry}`}
                            className="text-sm cursor-pointer"
                          >
                            {industry}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Stage</h3>
                    <div className="space-y-2">
                      {filterOptions.stages.map((stage) => (
                        <div key={stage} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`stage-${stage}`}
                            checked={filterValues.stages.includes(stage)}
                            onCheckedChange={() => toggleStageFilter(stage)}
                          />
                          <label 
                            htmlFor={`stage-${stage}`}
                            className="text-sm cursor-pointer"
                          >
                            {stage}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Location</h3>
                    <div className="space-y-2">
                      {filterOptions.locations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`location-${location}`}
                            checked={filterValues.locations.includes(location)}
                            onCheckedChange={() => toggleLocationFilter(location)}
                          />
                          <label 
                            htmlFor={`location-${location}`}
                            className="text-sm cursor-pointer"
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Main content */}
          <div className={`${filtersOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search businesses..." 
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="recommended">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="match">Match Score</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="funding-asc">Funding: Low to High</SelectItem>
                        <SelectItem value="funding-desc">Funding: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <Tabs defaultValue="all">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">All Matches</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                    <TabsTrigger value="contacted">Contacted</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    {filteredBusinesses.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>No businesses match your current filters. Try adjusting your criteria.</p>
                      </div>
                    ) : viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredBusinesses.map((business) => (
                          <Card key={business.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-6">
                                <div className="flex items-start gap-3">
                                  <div className="h-12 w-12 rounded-full bg-investify-navy text-white flex items-center justify-center text-xl font-bold">
                                    {business.logo}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                      <h3 className="font-semibold">{business.name}</h3>
                                      <div className="bg-green-50 text-green-700 font-medium rounded px-2 py-0.5 text-xs">
                                        {business.compatibilityScore}% match
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      <Badge variant="outline" className="text-xs">{business.industry}</Badge>
                                      <Badge variant="outline" className="text-xs">{business.stage}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{business.location}</p>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{business.description}</p>
                                    <p className="text-sm font-medium">Seeking: {business.fundingNeeded}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex divide-x border-t">
                                <Button 
                                  variant="ghost" 
                                  className="flex-1 rounded-none h-12"
                                  onClick={() => handleSaveMatch(business)}
                                >
                                  <Heart className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="flex-1 rounded-none h-12"
                                  onClick={() => handleContactBusiness(business)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="flex-1 rounded-none h-12 hover:bg-red-50 hover:text-red-500"
                                  onClick={() => handleRejectMatch(business)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredBusinesses.map((business) => (
                          <Card key={business.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="h-14 w-14 rounded-full bg-investify-navy text-white flex items-center justify-center text-xl font-bold mr-4">
                                  {business.logo}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-semibold text-lg">{business.name}</h3>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        <Badge variant="outline">{business.industry}</Badge>
                                        <Badge variant="outline">{business.stage}</Badge>
                                        <Badge variant="outline">{business.location}</Badge>
                                      </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 sm:text-right">
                                      <div className="bg-green-50 text-green-700 font-medium rounded px-2 py-1 text-sm inline-block">
                                        {business.compatibilityScore}% match
                                      </div>
                                      <p className="mt-1 text-sm font-medium">
                                        Seeking: {business.fundingNeeded}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 my-2">
                                    {business.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    <Button size="sm" onClick={() => handleSaveMatch(business)}>
                                      <Heart className="h-4 w-4 mr-2" />
                                      Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleContactBusiness(business)}>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="text-red-500 hover:bg-red-50"
                                      onClick={() => handleRejectMatch(business)}
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="saved">
                    <div className="text-center py-12 text-gray-500">
                      <p>You haven't saved any businesses yet.</p>
                      <Button variant="link">Browse matches to find businesses to save</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contacted">
                    <div className="text-center py-12 text-gray-500">
                      <p>You haven't contacted any businesses yet.</p>
                      <Button variant="link">Browse matches to find businesses to contact</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusinessMatchesView = () => {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const findInvestors = async () => {
    setLoading(true);
    try {
      console.log('Calling API endpoint with POST...');
      
      // ✅ FETCH ACTUAL INVESTORS FROM FIREBASE - This is the correct implementation
      console.log('Fetching investors from Firebase...');
      let investors: any[] = [];
      
      try {
        const investorsQuery = query(
          collection(db, 'users'),
          where('userType', '==', 'investor')
        );
        
        console.log('Firebase query created:', investorsQuery);
        const investorsSnapshot = await getDocs(investorsQuery);
        console.log('Firebase snapshot received, size:', investorsSnapshot.size);
        
        investorsSnapshot.forEach((doc) => {
          const investorData = doc.data();
          console.log('Processing investor doc:', doc.id, investorData);
          investors.push({
            uid: doc.id,
            displayName: investorData.displayName || 'Unknown Investor',
            email: investorData.email || '',
            userType: investorData.userType || 'investor',
            industry: investorData.industry || 'General',
            investmentRange: investorData.investmentRange || 'Not specified',
            location: investorData.location || 'Not specified'
          });
        });
        
        console.log('Fetched investors from Firebase:', investors);
        console.log('Number of investors found:', investors.length);
        
        if (investors.length === 0) {
          toast({
            title: "No Investors Found",
            description: "No investors are currently registered in Firebase. Please try again after investors sign up.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } catch (firebaseError) {
        console.error('Error fetching investors from Firebase:', firebaseError);
        toast({
          title: "Firebase Error",
          description: "Failed to fetch investors from database. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Use the actual startup data from user profile - NO DUMMY DATA
      const requestData = {
        startup: {
          uid: userProfile?.uid || "startup_" + Date.now(),
          displayName: userProfile?.displayName || "My Startup",
          email: userProfile?.email || "startup@example.com",
          name: userProfile?.displayName || "My Startup",
          industry: userProfile?.industry || "Technology",
          stage: userProfile?.stage || "Seed",
          funding_needed: parseInt(userProfile?.fundingAmount || "1000000"),
          description: userProfile?.startupBrief || "A startup seeking investment"
        },
        investors: investors // Array of all investors from Firebase
      };
      
      console.log('Request data:', requestData);
      console.log('Startup data:', requestData.startup);
      console.log('Investors array length:', requestData.investors.length);
      console.log('Investors array:', requestData.investors);
      
      // Simple POST request to your API endpoint
      const response = await fetch('https://70c23b88793c.ngrok-free.app/api/matchmaking/find-investor-matches/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Raw API Response:', responseText);
      
      // Check if response is HTML (error page)
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        console.log('Received HTML response, likely an error page');
        setApiResponse({ error: 'HTML response received', raw: responseText });
        setHasSearched(true);
        toast({
          title: "API Error",
          description: "The API returned an HTML page instead of data.",
          variant: "destructive",
        });
        return;
      }

      // Try to parse as JSON first
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed JSON data:', data);
        
        // Display EXACT API response - no processing, no dummy data
        setApiResponse(data);
      } catch (parseError) {
        console.log('Failed to parse as JSON, treating as text');
        
        // If it's not JSON, display the raw text response
        setApiResponse({ raw: responseText });
      }
      
      setHasSearched(true);
      toast({
        title: "API Response Received",
        description: "Successfully fetched data from the API.",
      });
      
    } catch (error) {
      console.error('Error fetching investors:', error);
      
      setApiResponse({
        error: 'Failed to fetch from API',
        details: error instanceof Error ? error.message : 'Unknown error',
        raw: 'No response received'
      });
      setHasSearched(true);
      toast({
        title: "API Error",
        description: `Failed to fetch from API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactInvestor = (investor: any) => {
    toast({
      title: "Message initiated",
      description: `You can now message ${investor.displayName || 'this investor'}.`,
    });
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Investors</h1>
          <p className="text-gray-600">Connect with investors interested in your business</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Search and Find Investors Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Click the button to find investors using your startup profile</p>
              </div>
              <Button 
                onClick={findInvestors}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding Investors...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find My Investors
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* API Response Display */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">API Response</h2>
                  <p className="text-sm text-gray-600">
                    Response from the API endpoint
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {renderApiResponseCards(apiResponse)}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchesContent;
