import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';

if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn('Gemini API key not configured. AI categorization will be disabled.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface StartupCategorization {
  industry: string;
  stage: string;
  revenueRange: string;
  fundingAmount: string;
  investmentType: string;
  businessModel: string;
  targetMarket: string;
  techStack?: string;
  teamSize: string;
  confidence: number;
}

export const categorizeStartup = async (startupBrief: string): Promise<StartupCategorization | null> => {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('Gemini API key not configured. Returning null.');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
Analyze the following startup brief and categorize it into specific business parameters. Return a JSON object with the following fields:

{
  "industry": "Select from: Technology, Healthcare, Finance, E-commerce, Education, Real Estate, Food & Beverage, Transportation, Energy, Entertainment, Manufacturing, Agriculture, Other",
  "stage": "Select from: Idea Stage, MVP/Prototype, Early Stage, Growth Stage, Expansion Stage, Mature",
  "revenueRange": "Select from: Pre-revenue, $0-$100K, $100K-$1M, $1M-$10M, $10M-$50M, $50M+",
  "fundingAmount": "Select from: Under $100K, $100K-$500K, $500K-$2M, $2M-$10M, $10M-$50M, $50M+",
  "investmentType": "Select from: Pre-seed, Seed, Series A, Series B, Series C+, Debt Financing, Grant Funding, Revenue-based Financing",
  "businessModel": "Select from: B2B, B2C, B2B2C, Marketplace, Subscription, Freemium, E-commerce, Licensing, Advertising",
  "targetMarket": "Select from: Local, Regional, National, International, Global",
  "techStack": "If mentioned, extract the main technologies used (optional)",
  "teamSize": "Select from: Solo Founder, 2-5 people, 6-15 people, 16-50 people, 50+ people",
  "confidence": "Rate your confidence in this categorization from 0.0 to 1.0"
}

Only return valid JSON. Be specific and choose the most appropriate category based on the description.

Startup Brief:
"${startupBrief}"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const categorization = JSON.parse(jsonMatch[0]) as StartupCategorization;
    
    // Validate required fields
    if (!categorization.industry || !categorization.stage || !categorization.revenueRange) {
      throw new Error('Invalid categorization response - missing required fields');
    }

    console.log('Startup categorization successful:', categorization);
    return categorization;

  } catch (error) {
    console.error('Error categorizing startup:', error);
    return null;
  }
};

// Test function for development
export const testGeminiConnection = async (): Promise<boolean> => {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return false;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("Say 'Hello' if you can hear me.");
    const response = await result.response;
    const text = response.text();
    return text.toLowerCase().includes('hello');
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
};