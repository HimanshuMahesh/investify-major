
export interface Business {
  id: string;
  name: string;
  logo: string;
  industry: string;
  stage: string;
  location: string;
  fundingNeeded: string;
  description: string;
  foundingDate: string;
  teamSize: number;
  revenue?: string;
  growth?: string;
  valuation?: string;
  equity?: string;
  compatibilityScore?: number;
  pitchDeck?: string;
  businessPlan?: string;
  financials?: string;
}

export interface Investor {
  id: string;
  name: string;
  logo: string;
  type: string;
  focus: string;
  location: string;
  investmentRange: string;
  description: string;
  portfolioSize?: number;
  yearsActive?: number;
  successfulExits?: number;
  industries?: string[];
  stages?: string[];
  compatibilityScore?: number;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Activity {
  id: string;
  type: "view" | "message" | "bookmark" | "meeting" | "document";
  actor: string;
  target: string;
  time: string;
  description?: string;
}

// Mock Businesses
export const mockBusinesses: Business[] = [
  {
    id: "b1",
    name: "TechSolutions AI",
    logo: "TS",
    industry: "AI & Machine Learning",
    stage: "Series A",
    location: "Mumbai, Maharashtra",
    fundingNeeded: "₹1.8 Crore",
    description: "AI-powered workflow automation platform for enterprises",
    foundingDate: "2019-05-12",
    teamSize: 15,
    revenue: "₹35 Lakh",
    growth: "120% YoY",
    valuation: "₹8.5 Crore",
    equity: "15%",
    compatibilityScore: 94,
    pitchDeck: "tech_solutions_deck.pdf",
    businessPlan: "tech_solutions_plan.pdf",
    financials: "tech_solutions_financials.xlsx"
  },
  {
    id: "b2",
    name: "MedHealth",
    logo: "MH",
    industry: "Healthcare",
    stage: "Seed",
    location: "Bangalore, Karnataka",
    fundingNeeded: "₹60 Lakh",
    description: "Digital health platform for remote patient monitoring",
    foundingDate: "2021-02-28",
    teamSize: 8,
    revenue: "₹8 Lakh",
    growth: "80% YoY",
    valuation: "₹3 Crore",
    equity: "12%",
    compatibilityScore: 87,
    pitchDeck: "med_health_deck.pdf",
    businessPlan: "med_health_plan.pdf"
  },
  {
    id: "b3",
    name: "GreenEnergy",
    logo: "GE",
    industry: "CleanTech",
    stage: "Series B",
    location: "Delhi, NCR",
    fundingNeeded: "₹3.5 Crore",
    description: "Renewable energy solutions for commercial buildings",
    foundingDate: "2018-11-05",
    teamSize: 32,
    revenue: "₹1.5 Crore",
    growth: "65% YoY",
    valuation: "₹20 Crore",
    equity: "10%",
    compatibilityScore: 82,
    pitchDeck: "green_energy_deck.pdf",
    businessPlan: "green_energy_plan.pdf",
    financials: "green_energy_financials.xlsx"
  },
  {
    id: "b4",
    name: "FinanceApp",
    logo: "FA",
    industry: "FinTech",
    stage: "Seed",
    location: "Hyderabad, Telangana",
    fundingNeeded: "₹85 Lakh",
    description: "Personal finance management app with AI-driven insights",
    foundingDate: "2022-01-15",
    teamSize: 6,
    revenue: "₹3.5 Lakh",
    growth: "150% YoY",
    valuation: "₹3.5 Crore",
    equity: "18%",
    compatibilityScore: 78,
    pitchDeck: "finance_app_deck.pdf"
  },
  {
    id: "b5",
    name: "LogisticsPlus",
    logo: "LP",
    industry: "Supply Chain",
    stage: "Series A",
    location: "Chennai, Tamil Nadu",
    fundingNeeded: "₹2.2 Crore",
    description: "AI-powered logistics optimization platform",
    foundingDate: "2020-07-22",
    teamSize: 18,
    revenue: "₹75 Lakh",
    growth: "95% YoY",
    valuation: "₹10.5 Crore",
    equity: "14%",
    compatibilityScore: 73,
    pitchDeck: "logistics_plus_deck.pdf",
    businessPlan: "logistics_plus_plan.pdf",
    financials: "logistics_plus_financials.xlsx"
  }
];

// Mock Investors
export const mockInvestors: Investor[] = [
  {
    id: "i1",
    name: "Venture Capital Partners",
    logo: "VC",
    type: "Venture Capital",
    focus: "Tech & SaaS",
    location: "Mumbai, Maharashtra",
    investmentRange: "₹75 Lakh - ₹3.5 Crore",
    description: "Early stage VC firm focused on B2B SaaS and enterprise tech",
    portfolioSize: 24,
    yearsActive: 8,
    successfulExits: 7,
    industries: ["SaaS", "AI & Machine Learning", "Enterprise Software"],
    stages: ["Seed", "Series A"],
    compatibilityScore: 92
  },
  {
    id: "i2",
    name: "Growth Equity Fund",
    logo: "GE",
    type: "Private Equity",
    focus: "Healthcare & Fintech",
    location: "Bangalore, Karnataka",
    investmentRange: "₹3.5 Crore - ₹15 Crore",
    description: "Growth stage investor for healthcare and fintech startups",
    portfolioSize: 15,
    yearsActive: 12,
    successfulExits: 9,
    industries: ["Healthcare", "FinTech", "InsurTech"],
    stages: ["Series B", "Series C"],
    compatibilityScore: 86
  },
  {
    id: "i3",
    name: "Angel Network",
    logo: "AN",
    type: "Angel Investors",
    focus: "Early Stage Startups",
    location: "Delhi, NCR",
    investmentRange: "₹20 Lakh - ₹75 Lakh",
    description: "Network of angel investors focused on early-stage innovation",
    portfolioSize: 35,
    yearsActive: 5,
    successfulExits: 4,
    industries: ["Consumer Tech", "E-commerce", "Mobile Apps"],
    stages: ["Pre-seed", "Seed"],
    compatibilityScore: 78
  },
  {
    id: "i4",
    name: "Impact Ventures",
    logo: "IV",
    type: "Impact Investor",
    focus: "Sustainability & Social Impact",
    location: "Pune, Maharashtra",
    investmentRange: "₹35 Lakh - ₹2.2 Crore",
    description: "Impact-focused fund investing in sustainable solutions",
    portfolioSize: 18,
    yearsActive: 6,
    successfulExits: 2,
    industries: ["CleanTech", "AgTech", "Sustainable Consumer"],
    stages: ["Seed", "Series A"],
    compatibilityScore: 81
  },
  {
    id: "i5",
    name: "Tech Horizons Capital",
    logo: "TH",
    type: "Corporate VC",
    focus: "Emerging Technologies",
    location: "Hyderabad, Telangana",
    investmentRange: "₹1.5 Crore - ₹7 Crore",
    description: "Corporate venture arm investing in emerging tech",
    portfolioSize: 22,
    yearsActive: 9,
    successfulExits: 6,
    industries: ["AI & Machine Learning", "Blockchain", "IoT"],
    stages: ["Series A", "Series B"],
    compatibilityScore: 75
  }
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: "msg1",
    sender: "i1",
    recipient: "b1",
    content: "Hi, we're interested in your AI platform. Could you share more details about your technology stack?",
    timestamp: "2023-05-12T14:23:00Z",
    read: true
  },
  {
    id: "msg2",
    sender: "b1",
    recipient: "i1",
    content: "Hi there! Thanks for your interest. Our platform is built on a combination of machine learning models trained on industry-specific datasets, with a proprietary NLP engine. Would you like to schedule a demo?",
    timestamp: "2023-05-12T16:45:00Z",
    read: true
  },
  {
    id: "msg3",
    sender: "i2",
    recipient: "b2",
    content: "Hello, we reviewed your pitch deck and would like to discuss your go-to-market strategy in more detail. Are you available for a call next week?",
    timestamp: "2023-05-14T09:12:00Z",
    read: false
  },
  {
    id: "msg4",
    sender: "i3",
    recipient: "b1",
    content: "Your solution looks promising. I'd like to understand more about your customer acquisition strategy and current traction.",
    timestamp: "2023-05-15T11:30:00Z",
    read: false
  },
  {
    id: "msg5",
    sender: "i1",
    recipient: "b3",
    content: "We're impressed by your clean energy solution. Could you share your projections for the next 3-5 years?",
    timestamp: "2023-05-16T13:45:00Z",
    read: true,
    attachments: ["meeting_request.ics"]
  }
];

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: "act1",
    type: "view",
    actor: "i1",
    target: "b1",
    time: "2 hours ago",
    description: "Viewed your company profile"
  },
  {
    id: "act2",
    type: "message",
    actor: "i2",
    target: "b2",
    time: "1 day ago",
    description: "Sent you a message"
  },
  {
    id: "act3",
    type: "bookmark",
    actor: "i3",
    target: "b1",
    time: "2 days ago",
    description: "Bookmarked your business"
  },
  {
    id: "act4",
    type: "document",
    actor: "i1",
    target: "b3",
    time: "3 days ago",
    description: "Downloaded your pitch deck"
  },
  {
    id: "act5",
    type: "meeting",
    actor: "i4",
    target: "b2",
    time: "1 week ago",
    description: "Scheduled a meeting"
  }
];
