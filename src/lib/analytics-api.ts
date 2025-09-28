export interface AnalyticsData {
  engagementMetrics: Array<{
    name: string;
    value: number;
  }>;
  profileViewsData: Array<{
    day: string;
    views: number;
  }>;
  matchQualityData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  industryInterestData: Array<{
    industry: string;
    investor: number;
    business: number;
  }>;
  fundingMetricsData: Array<{
    month: string;
    target: number;
    raised: number;
  }> | null;
  userActivityData: Array<{
    day: string;
    activeUsers: number;
    newUsers: number;
    sessions: number;
  }>;
  conversionFunnelData: Array<{
    stage: string;
    count: number;
    conversion: number;
  }>;
  timeRange: string;
  userType: string;
  generatedAt: string;
}

export interface AnalyticsFilters {
  timeRange: '7d' | '30d' | '90d' | '1y';
  userType: 'business' | 'investor';
}

class AnalyticsAPI {
  private baseUrl = '/api/analytics';

  async getAnalytics(filters: Partial<AnalyticsFilters> = {}): Promise<AnalyticsData> {
    try {
      // Import the mock data generator function
      const { getAnalyticsData } = await import('../app/api/analytics/route');
      const data = await getAnalyticsData(filters);
      return data as AnalyticsData;
    } catch (error) {
      throw new Error(`Failed to fetch analytics data: ${error}`);
    }
  }

  async getEngagementMetrics(filters?: Partial<AnalyticsFilters>) {
    const data = await this.getAnalytics(filters);
    return data.engagementMetrics;
  }

  async getProfileViews(filters?: Partial<AnalyticsFilters>) {
    const data = await this.getAnalytics(filters);
    return data.profileViewsData;
  }

  async getMatchQualityData(filters?: Partial<AnalyticsFilters>) {
    const data = await this.getAnalytics(filters);
    return data.matchQualityData;
  }

  async getIndustryInterestData(filters?: Partial<AnalyticsFilters>) {
    const data = await this.getAnalytics(filters);
    return data.industryInterestData;
  }

  async getFundingMetrics(filters?: Partial<AnalyticsFilters>) {
    const data = await this.getAnalytics(filters);
    return data.fundingMetricsData;
  }

  async getUserActivityData(filters?: Partial<AnalyticsFilters>) {
    const data = await this.getAnalytics(filters);
    return data.userActivityData;
  }

  async getConversionFunnelData(filters?: Partial<AnalyticsFilters>) {
    const data = await this.getAnalytics(filters);
    return data.conversionFunnelData;
  }
}

export const analyticsAPI = new AnalyticsAPI();