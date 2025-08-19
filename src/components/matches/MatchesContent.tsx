// src/pages/FindMatchesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Building2,
  Loader2,
  AlertCircle,
  Star,
  Target,
  Briefcase,
  PiggyBank
} from "lucide-react";

type Startup = {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  location?: string;
  industry?: string;
  stage?: string;
  teamSize?: string;
  techStack?: string;
  businessModel?: string;
  fundingAmount?: string;
  investmentType?: string;
  revenueRange?: string;
  startupBrief?: string;
  targetMarket?: string;
  aiConfidence?: number;
  isOnboardingCompleted?: boolean;
  createdAt?: any;
  updatedAt?: any;
  userType?: string;
};

type Investor = {
  uid: string;
  displayName: string;
  email: string;
  location?: string;
  investorBrief?: string;
  investmentAmountRange?: string;
  preferredIndustries?: string[];
  preferredInvestmentTypes?: string[];
  preferredTeamSizes?: string[];
  preferredRevenueRanges?: string[];
  userType?: string;
  isOnboardingCompleted?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

type InvestorMatch = {
  investor_id: string;
  displayName: string;
  match_score: number;
  match_reason: string;
  investment_fit?: string;
  strategic_fit?: string;
};

type StartupMatch = {
  startup_id: string;
  displayName: string;
  match_score: number;
  match_reason: string;
  investment_fit?: string;
  industry_fit?: string;
};

type User = Startup | Investor;
type Match = InvestorMatch | StartupMatch;

// Helper: convert Firestore Timestamp to ISO string
const toIsoString = (ts: any): string | undefined => {
  if (!ts) return undefined;
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toISOString();
  if (ts.seconds) return new Date(ts.seconds * 1000).toISOString();
  return undefined;
};

// Helper: Get match score color
const getMatchScoreColor = (score: number): string => {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-teal-500";
  if (score >= 70) return "bg-cyan-500";
  if (score >= 60) return "bg-orange-500";
  return "bg-red-500";
};

// Helper: Get match score label
const getMatchScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Great Match";
  if (score >= 70) return "Good Match";
  if (score >= 60) return "Fair Match";
  return "Low Match";
};

// Helper: Check if user is startup
const isStartup = (user: User): user is Startup => {
  return user.userType === "startup" || user.userType === "business";
};

// Helper: Check if user is investor
const isInvestor = (user: User): user is Investor => {
  return user.userType === "investor";
};

// Helper: Check if match is startup match
const isStartupMatch = (match: Match): match is StartupMatch => {
  return 'startup_id' in match;
};

export default function FindMatchesScreen() {

  const BASE_URL = 'http://localhost:8000/'; // Change this to your actual backend URL

  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [cachedMatches, setCachedMatches] = useState<Match[]>([]);
  const [req, setReq] = useState<any>(null);

  // Load user profile and cached matches
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError("No user signed in.");
          setProfileLoading(false);
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const profile = { uid: user.uid, ...snap.data() } as User;
          setUserProfile(profile);

          // Load cached matches for this user
          const matchType = isStartup(profile) ? "investor" : "startup";
          const cacheKey = `${matchType}_matches_${user.uid}`;
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData);
              if (Array.isArray(parsed.matches) && parsed.timestamp) {
                // Check if cache is less than 24 hours old
                const cacheAge = Date.now() - parsed.timestamp;
                if (cacheAge < 24 * 60 * 60 * 1000) { // 24 hours
                  setMatches(parsed.matches);
                  setCachedMatches(parsed.matches);
                  toast({
                    title: "Cached Matches Loaded",
                    description: `Loaded ${parsed.matches.length} previously found matches.`,
                  });
                }
              }
            } catch (err) {
              console.error("Error parsing cached matches:", err);
              localStorage.removeItem(cacheKey);
            }
          }
        } else {
          setError("User profile not found in database.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching user profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Build request payload for startup finding investors
  const buildStartupRequestPayload = (startup: Startup, investors: Investor[]) => ({
    startup: {
      uid: startup.uid,
      displayName: startup.displayName,
      email: startup.email,
      phone: startup.phone || "",
      location: startup.location || "",
      industry: startup.industry || "",
      stage: startup.stage || "",
      teamSize: startup.teamSize || "",
      techStack: startup.techStack || "",
      businessModel: startup.businessModel || "",
      fundingAmount: startup.fundingAmount || "",
      investmentType: startup.investmentType || "",
      revenueRange: startup.revenueRange || "",
      startupBrief: startup.startupBrief || "",
      targetMarket: startup.targetMarket || "",
      aiConfidence: startup.aiConfidence ?? 0,
      isOnboardingCompleted: Boolean(startup.isOnboardingCompleted),
      createdAt: toIsoString(startup.createdAt) || new Date().toISOString(),
      updatedAt: toIsoString(startup.updatedAt) || new Date().toISOString(),
      userType: startup.userType || "startup",
    },
    investors: investors.map((inv) => ({
      ...inv,
      preferredIndustries: inv.preferredIndustries || [],
      preferredInvestmentTypes: inv.preferredInvestmentTypes || [],
      preferredTeamSizes: inv.preferredTeamSizes || [],
      preferredRevenueRanges: inv.preferredRevenueRanges || [],
      createdAt: toIsoString(startup.createdAt) || new Date().toISOString(),
      updatedAt: toIsoString(startup.updatedAt) || new Date().toISOString(),
    })),
  });

  // Build request payload for investor finding startups
  const buildInvestorRequestPayload = (investor: Investor, startups: Startup[]) => ({
    investor: {
      uid: investor.uid,
      displayName: investor.displayName,
      email: investor.email,
      location: investor.location || "",
      investorBrief: investor.investorBrief || "",
      investmentAmountRange: investor.investmentAmountRange || "",
      preferredIndustries: investor.preferredIndustries || [],
      preferredInvestmentTypes: investor.preferredInvestmentTypes || [],
      preferredTeamSizes: investor.preferredTeamSizes || [],
      preferredRevenueRanges: investor.preferredRevenueRanges || [],
    },
    startups: startups.map((startup) => ({
      uid: startup.uid,
      displayName: startup.displayName,
      email: startup.email,
      phone: startup.phone || "",
      location: startup.location || "",
      industry: startup.industry || "",
      stage: startup.stage || "",
      teamSize: startup.teamSize || "",
      techStack: startup.techStack || "",
      businessModel: startup.businessModel || "",
      fundingAmount: startup.fundingAmount || "",
      investmentType: startup.investmentType || "",
      revenueRange: startup.revenueRange || "",
      startupBrief: startup.startupBrief || "",
      targetMarket: startup.targetMarket || "",
      aiConfidence: startup.aiConfidence ?? 0,
      isOnboardingCompleted: Boolean(startup.isOnboardingCompleted),
      createdAt: toIsoString(startup.createdAt) || new Date().toISOString(),
      updatedAt: toIsoString(startup.updatedAt) || new Date().toISOString(),
      userType: startup.userType || "startup",
    })),
  });

  // Clear cached matches
  const clearCache = () => {
    const auth = getAuth();
    if (auth.currentUser && userProfile) {
      const matchType = isStartup(userProfile) ? "investor" : "startup";
      const cacheKey = `${matchType}_matches_${auth.currentUser.uid}`;
      localStorage.removeItem(cacheKey);
      setMatches([]);
      setCachedMatches([]);
      const entityType = isStartup(userProfile) ? "investor" : "startup";
      toast({
        title: "Cache Cleared",
        description: `Cached ${entityType} matches have been cleared.`,
      });
    }
  };

  const findMatches = async () => {
    if (!userProfile) return;
    setLoading(true);
    setError(null);

    try {
      let requestData: any;
      let endpoint: string;
      let entityType: string;

      if (isStartup(userProfile)) {
        // Startup finding investors
        const investors: Investor[] = [];
        const investorsQuery = query(
          collection(db, "users"),
          where("userType", "==", "investor")
        );
        const investorsSnapshot = await getDocs(investorsQuery);

        investorsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          investors.push({
            uid: docSnap.id,
            displayName: data.displayName || "Unknown Investor",
            email: data.email || "",
            location: data.location,
            investorBrief: data.investorBrief,
            investmentAmountRange: data.investmentAmountRange,
            preferredIndustries: data.preferredIndustries,
            preferredInvestmentTypes: data.preferredInvestmentTypes,
            preferredTeamSizes: data.preferredTeamSizes,
            preferredRevenueRanges: data.preferredRevenueRanges,
            userType: data.userType,
            isOnboardingCompleted: data.isOnboardingCompleted,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });

        if (investors.length === 0) {
          toast({
            title: "No Investors Found",
            description: "No investors are currently registered in the platform.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        requestData = buildStartupRequestPayload(userProfile, investors);
        endpoint = `${BASE_URL}api/matchmaking/find-investor-matches/`;
        entityType = "investor";
      } else if (isInvestor(userProfile)) {
        // Investor finding startups
        const startups: Startup[] = [];
        const startupsQuery = query(
          collection(db, "users"),
          where("userType", "==", "business")
        );
        const startupsSnapshot = await getDocs(startupsQuery);

        startupsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          startups.push({
            uid: docSnap.id,
            displayName: data.displayName || "Unknown Startup",
            email: data.email || "",
            phone: data.phone,
            location: data.location,
            industry: data.industry,
            stage: data.stage,
            teamSize: data.teamSize,
            techStack: data.techStack,
            businessModel: data.businessModel,
            fundingAmount: data.fundingAmount,
            investmentType: data.investmentType,
            revenueRange: data.revenueRange,
            startupBrief: data.startupBrief,
            targetMarket: data.targetMarket,
            aiConfidence: data.aiConfidence,
            isOnboardingCompleted: data.isOnboardingCompleted,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            userType: data.userType,
          });
        });

        if (startups.length === 0) {
          toast({
            title: "No Startups Found",
            description: "No startups are currently registered in the platform.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        requestData = buildInvestorRequestPayload(userProfile, startups);
        endpoint = `${BASE_URL}api/matchmaking/find-startup-matches/`;
        entityType = "startup";
      } else {
        setError("Invalid user type. Must be startup, business, or investor.");
        setLoading(false);
        return;
      }

      setReq(requestData);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      if (Array.isArray(data.matches)) {
        setMatches(data.matches);
        setCachedMatches(data.matches);

        // Cache the matches locally
        const auth = getAuth();
        if (auth.currentUser) {
          const cacheKey = `${entityType}_matches_${auth.currentUser.uid}`;
          const cacheData = {
            matches: data.matches,
            timestamp: Date.now(),
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        }

        toast({
          title: `${entityType === "investor" ? "Investor" : "Startup"} Matches Found`,
          description: `Found ${data.matches.length} potential ${entityType}${data.matches.length === 1 ? '' : 's'} for you.`,
        });
      } else {
        toast({
          title: "Unexpected Response",
          description: "The matching service returned an unexpected format.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to find matches";
      setError(errorMessage);
      toast({
        title: "Matching Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const isUserStartup = userProfile && isStartup(userProfile);
  const isUserInvestor = userProfile && isInvestor(userProfile);
  const targetEntity = isUserStartup ? "Investors" : "Startups";
  const targetEntityLower = targetEntity.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-2 rounded-lg">
              {isUserStartup ? <Search className="h-6 w-6 text-white" /> : <PiggyBank className="h-6 w-6 text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Find {targetEntity}</h1>
          </div>
          <p className="text-gray-600 text-lg">
            {isUserStartup
              ? "Discover investors that align with your startup's vision and funding needs"
              : "Find promising startups that match your investment criteria"
            }
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Profile Card */}
        {userProfile && (
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isUserStartup ? <Building2 className="h-6 w-6" /> : <PiggyBank className="h-6 w-6" />}
                  <div>
                    <CardTitle className="text-xl">{userProfile.displayName}</CardTitle>
                    <p className="text-teal-100 text-sm">{userProfile.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {userProfile.userType === "business" ? "Business" : userProfile.userType || "User"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {isUserStartup ? (
                  <>
                    {userProfile.industry && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userProfile.industry}</span>
                      </div>
                    )}
                    {userProfile.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userProfile.location}</span>
                      </div>
                    )}
                    {userProfile.fundingAmount && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userProfile.fundingAmount}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {userProfile.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{userProfile.location}</span>
                      </div>
                    )}
                    {(userProfile as Investor).investmentAmountRange && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{(userProfile as Investor).investmentAmountRange}</span>
                      </div>
                    )}
                    {(userProfile as Investor).preferredIndustries && (userProfile as Investor).preferredIndustries!.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{(userProfile as Investor).preferredIndustries!.slice(0, 2).join(", ")}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={findMatches}
                  disabled={loading}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Matches...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Find New {targetEntity}
                    </>
                  )}
                </Button>

                {cachedMatches.length > 0 && (
                  <Button
                    onClick={clearCache}
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 py-3 px-4 rounded-lg"
                  >
                    Clear Cache
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Your Perfect Matches</h3>
            <p className="text-gray-600 text-center max-w-md">
              Our AI is analyzing {targetEntityLower} profiles and matching them with your {isUserStartup ? "startup's" : "investment"} unique profile...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && matches.length === 0 && userProfile && (
          <div className="text-center py-16">
            <div className="bg-white rounded-full p-4 shadow-lg inline-block mb-4">
              <Target className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {cachedMatches.length > 0 ? "Cache Cleared" : `Ready to Find ${targetEntity}?`}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {cachedMatches.length > 0
                ? `Your cached matches have been cleared. Click 'Find New ${targetEntity}' to search again.`
                : `Click the 'Find New ${targetEntity}' button above to discover ${targetEntityLower} that align with your ${isUserStartup ? "startup's goals and funding requirements" : "investment criteria and preferences"}.`
              }
            </p>
          </div>
        )}

        {/* Results Header */}
        {matches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {targetEntity} Matches ({matches.length})
                </h2>
              </div>
              <Badge variant="outline" className="text-sm font-medium">
                Sorted by Match Score
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">
              Based on your {isUserStartup ? "startup" : "investment"} profile, here are {targetEntityLower} most likely to be {isUserStartup ? "interested in your venture" : "a good fit for your portfolio"}
            </p>
          </div>
        )}

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match, idx) => (
            <Card
              key={idx}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden"
            >
              {/* Match Score Header */}
              <div className={`${getMatchScoreColor(match.match_score)} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span className="font-bold text-lg">{match.match_score}%</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                    {getMatchScoreLabel(match.match_score)}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-gray-900 group-hover:text-teal-600 transition-colors">
                  {match.displayName}
                </CardTitle>
                <Badge variant="outline" className="w-fit text-xs">
                  ID: {isStartupMatch(match) ? match.startup_id : (match as InvestorMatch).investor_id}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Match Reason */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Why this match: </span>
                    {match.match_reason}
                  </p>
                </div>

                {/* Investment Fit */}
                {match.investment_fit && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-sm text-gray-900">Investment Fit</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-6 leading-relaxed">
                      {match.investment_fit}
                    </p>
                  </div>
                )}

                {/* Strategic/Industry Fit */}
                {(match as InvestorMatch).strategic_fit && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-cyan-600" />
                      <span className="font-medium text-sm text-gray-900">Strategic Fit</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-6 leading-relaxed">
                      {(match as InvestorMatch).strategic_fit}
                    </p>
                  </div>
                )}

                {/* Industry Fit (for startup matches) */}
                {isStartupMatch(match) && match.industry_fit && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm text-gray-900">Industry Fit</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-6 leading-relaxed">
                      {match.industry_fit}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-teal-200 text-teal-600 hover:bg-teal-50"
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                  >
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Footer */}
        {matches.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-teal-600" />
              Match Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{matches.length}</div>
                <div className="text-sm text-gray-600">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {matches.filter(m => m.match_score >= 80).length}
                </div>
                <div className="text-sm text-gray-600">Great Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {matches.filter(m => m.match_score >= 90).length}
                </div>
                <div className="text-sm text-gray-600">Excellent Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length) || 0}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}