import apiClient from './apiClient';

const analyticsService = {
  /**
   * Get performance overview data
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with performance data
   */
  getPerformanceOverview: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/performance', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching performance overview:', error);
      throw error;
    }
  },

  /**
   * Get audience demographics data
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with demographics data
   */
  getAudienceDemographics: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/audience', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audience demographics:', error);
      throw error;
    }
  },

  /**
   * Get geographic distribution data
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with geographic data
   */
  getGeographicDistribution: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/geographic', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic distribution:', error);
      throw error;
    }
  },

  /**
   * Get platform distribution data
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with platform distribution data
   */
  getPlatformDistribution: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/platforms', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching platform distribution:', error);
      throw error;
    }
  },

  /**
   * Get revenue analytics data
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with revenue data
   */
  getRevenueAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/revenue', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  },

  /**
   * Get top performing tracks
   * @param {Object} params - Query parameters (timeframe, limit, etc.)
   * @returns {Promise} - Promise with top tracks data
   */
  getTopTracks: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/top-tracks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching top tracks:', error);
      throw error;
    }
  },

  /**
   * Get top performing releases
   * @param {Object} params - Query parameters (timeframe, limit, etc.)
   * @returns {Promise} - Promise with top releases data
   */
  getTopReleases: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/top-releases', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching top releases:', error);
      throw error;
    }
  },

  /**
   * Get listener growth data
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with listener growth data
   */
  getListenerGrowth: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/listener-growth', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching listener growth:', error);
      throw error;
    }
  },

  /**
   * Get analytics data for a specific time period
   * @param {string} period - Time period ('day', 'week', 'month', 'year')
   * @param {Object} params - Additional query parameters
   * @returns {Promise} - Promise with time period analytics data
   */
  getAnalyticsForPeriod: async (period, params = {}) => {
    try {
      const response = await apiClient.get(`/analytics/period/${period}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching analytics for period ${period}:`, error);
      throw error;
    }
  },

  /**
   * Export analytics data as CSV
   * @param {string} type - Type of analytics to export
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with CSV data
   */
  exportAnalyticsCSV: async (type, params = {}) => {
    try {
      const response = await apiClient.get(`/analytics/export/${type}`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting ${type} analytics as CSV:`, error);
      throw error;
    }
  },

  /**
   * Get comparison analytics between two time periods
   * @param {Object} params - Query parameters with period1 and period2 details
   * @returns {Promise} - Promise with comparison data
   */
  getComparisonAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/compare', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching comparison analytics:', error);
      throw error;
    }
  }
};

export default analyticsService;