// Helper function to generate random data
function generateRandomData(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate profile views data for the last 7 days
function generateProfileViewsData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    views: generateRandomData(10, 50)
  }));
}

// Generate match quality distribution
function generateMatchQualityData() {
  return [
    { name: "90-100%", value: generateRandomData(10, 20), color: "#10B981" },
    { name: "70-89%", value: generateRandomData(20, 35), color: "#3B82F6" },
    { name: "50-69%", value: generateRandomData(15, 25), color: "#6366F1" },
    { name: "<50%", value: generateRandomData(5, 15), color: "#9CA3AF" },
  ];
}

// Generate industry interest data
function generateIndustryInterestData() {
  const industries = [
    { industry: "AI & ML" },
    { industry: "FinTech" },
    { industry: "Healthcare" },
    { industry: "CleanTech" },
    { industry: "SaaS" },
    { industry: "E-commerce" },
    { industry: "EdTech" }
  ];

  return industries.map(item => ({
    industry: item.industry,
    investor: generateRandomData(30, 80),
    business: generateRandomData(20, 70)
  }));
}

// Generate funding metrics data
function generateFundingMetricsData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

  return months.slice(0, currentMonth + 1).map(month => ({
    month,
    target: generateRandomData(400000, 800000),
    raised: generateRandomData(300000, 750000)
  }));
}

// Generate engagement metrics
function generateEngagementMetrics() {
  return [
    { name: "Profile Views", value: generateRandomData(150, 400) },
    { name: "Messages", value: generateRandomData(20, 60) },
    { name: "Meeting Requests", value: generateRandomData(10, 30) },
    { name: "Document Downloads", value: generateRandomData(15, 35) },
  ];
}

// Generate user activity data
function generateUserActivityData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    activeUsers: generateRandomData(50, 200),
    newUsers: generateRandomData(10, 40),
    sessions: generateRandomData(100, 300)
  }));
}

// Generate conversion funnel data
function generateConversionFunnelData() {
  return [
    { stage: "Profile Views", count: generateRandomData(800, 1200), conversion: 100 },
    { stage: "Messages Sent", count: generateRandomData(200, 400), conversion: 25 },
    { stage: "Meetings Booked", count: generateRandomData(50, 150), conversion: 20 },
    { stage: "Deals Closed", count: generateRandomData(10, 30), conversion: 15 },
  ];
}

// Mock API function that simulates the Next.js route handler
export async function getAnalyticsData(params: {
  timeRange?: string;
  userType?: string;
} = {}) {
  try {
    const { timeRange = '7d', userType = 'business' } = params;

    // Generate different data based on time range
    let profileViewsData = generateProfileViewsData();
    if (timeRange === '30d') {
      // Generate 30 days of data
      profileViewsData = Array.from({ length: 30 }, (_, i) => ({
        day: `Day ${i + 1}`,
        views: generateRandomData(10, 50)
      }));
    } else if (timeRange === '90d') {
      // Generate 90 days of data (sample every 3 days)
      profileViewsData = Array.from({ length: 30 }, (_, i) => ({
        day: `Week ${i + 1}`,
        views: generateRandomData(50, 150)
      }));
    } else if (timeRange === '1y') {
      // Generate 12 months of data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      profileViewsData = months.map(month => ({
        day: month,
        views: generateRandomData(200, 800)
      }));
    }

    const responseData = {
      engagementMetrics: generateEngagementMetrics(),
      profileViewsData,
      matchQualityData: generateMatchQualityData(),
      industryInterestData: generateIndustryInterestData(),
      fundingMetricsData: userType === 'business' ? generateFundingMetricsData() : null,
      userActivityData: generateUserActivityData(),
      conversionFunnelData: generateConversionFunnelData(),
      timeRange,
      userType,
      generatedAt: new Date().toISOString()
    };

    // Add some delay to simulate real API call
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    return responseData;
  } catch (error) {
    console.error('Error generating analytics data:', error);
    throw new Error('Failed to generate analytics data');
  }
}