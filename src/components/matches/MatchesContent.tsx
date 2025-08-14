
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
  X
} from "lucide-react";
import { mockBusinesses, mockInvestors, Business, Investor } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

// Adjust the component based on user type
const MatchesContent = () => {
  const userType = localStorage.getItem("investify_user_type") as "business" | "investor" | null;
  
  // For demo purposes, default to investor view if not specified
  return userType === "business" ? <BusinessMatchesView /> : <InvestorMatchesView />;
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
  const { toast } = useToast();
  
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
  );
};

const BusinessMatchesView = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Filter investors
  const filteredInvestors = mockInvestors.filter((investor) => {
    if (searchTerm && !investor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !investor.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  const handleContactInvestor = (investor: Investor) => {
    toast({
      title: "Message initiated",
      description: `You can now message ${investor.name}.`,
    });
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Investor Matches</h1>
          <p className="text-gray-600">Connect with investors interested in your business</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-2">
          <Button 
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters panel */}
        {filtersOpen && (
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <div>
                  <h3 className="font-medium text-sm mb-2">Investment Amount</h3>
                  <div className="pl-2 pr-2">
                    <Slider
                      defaultValue={[0, 20000000]}
                      max={20000000}
                      step={500000}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <span>$0</span>
                    <span>$20M+</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Investor Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-vc" />
                      <label htmlFor="type-vc" className="text-sm cursor-pointer">
                        Venture Capital
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-angel" />
                      <label htmlFor="type-angel" className="text-sm cursor-pointer">
                        Angel Investors
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-pe" />
                      <label htmlFor="type-pe" className="text-sm cursor-pointer">
                        Private Equity
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-corporate" />
                      <label htmlFor="type-corporate" className="text-sm cursor-pointer">
                        Corporate VC
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-impact" />
                      <label htmlFor="type-impact" className="text-sm cursor-pointer">
                        Impact Investor
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Location</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-sf" />
                      <label htmlFor="location-sf" className="text-sm cursor-pointer">
                        San Francisco, CA
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-ny" />
                      <label htmlFor="location-ny" className="text-sm cursor-pointer">
                        New York, NY
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-boston" />
                      <label htmlFor="location-boston" className="text-sm cursor-pointer">
                        Boston, MA
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-austin" />
                      <label htmlFor="location-austin" className="text-sm cursor-pointer">
                        Austin, TX
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="location-seattle" />
                      <label htmlFor="location-seattle" className="text-sm cursor-pointer">
                        Seattle, WA
                      </label>
                    </div>
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
                    placeholder="Search investors..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <Select defaultValue="match">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Match Score</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                      <SelectItem value="portfolio">Portfolio Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Investors</TabsTrigger>
                  <TabsTrigger value="interested">Interested</TabsTrigger>
                  <TabsTrigger value="contacted">Contacted</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="space-y-4">
                    {filteredInvestors.map((investor) => (
                      <Card key={investor.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className="h-14 w-14 rounded-full bg-investify-navy text-white flex items-center justify-center text-xl font-bold mr-4">
                              {investor.logo}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{investor.name}</h3>
                                  <p className="text-sm text-gray-600">{investor.type} • {investor.focus}</p>
                                </div>
                                <div className="mt-2 sm:mt-0 sm:text-right">
                                  <div className="bg-green-50 text-green-700 font-medium rounded px-2 py-1 text-sm inline-block">
                                    {investor.compatibilityScore}% match
                                  </div>
                                  <p className="mt-1 text-sm font-medium">
                                    Invests: {investor.investmentRange}
                                  </p>
                                </div>
                              </div>
                              
                              <Collapsible className="mt-2">
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-0 h-auto flex items-center text-sm text-gray-500 hover:text-gray-900">
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    View details
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 text-sm">
                                  <p className="mb-2">{investor.description}</p>
                                  <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div>
                                      <p className="text-gray-500">Portfolio Size</p>
                                      <p className="font-medium">{investor.portfolioSize} companies</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Years Active</p>
                                      <p className="font-medium">{investor.yearsActive} years</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Successful Exits</p>
                                      <p className="font-medium">{investor.successfulExits}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Location</p>
                                      <p className="font-medium">{investor.location}</p>
                                    </div>
                                  </div>
                                  
                                  {investor.industries && (
                                    <div className="mt-3">
                                      <p className="text-gray-500 mb-1">Industries of Interest</p>
                                      <div className="flex flex-wrap gap-1">
                                        {investor.industries.map((industry) => (
                                          <Badge key={industry} variant="outline">{industry}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {investor.stages && (
                                    <div className="mt-3">
                                      <p className="text-gray-500 mb-1">Preferred Stages</p>
                                      <div className="flex flex-wrap gap-1">
                                        {investor.stages.map((stage) => (
                                          <Badge key={stage} variant="outline">{stage}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                              
                              <div className="mt-4">
                                <Button onClick={() => handleContactInvestor(investor)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Contact Investor
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="interested">
                  <div className="text-center py-12 text-gray-500">
                    <p>No investors have expressed interest yet.</p>
                    <p className="text-sm mt-2">Complete your profile to improve visibility.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="contacted">
                  <div className="text-center py-12 text-gray-500">
                    <p>You haven't contacted any investors yet.</p>
                    <Button variant="link">Browse matches to find investors to contact</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchesContent;
