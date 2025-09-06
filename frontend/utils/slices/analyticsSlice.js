import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../api';

// Async thunks
export const fetchPerformanceOverview = createAsyncThunk(
  'analytics/fetchPerformanceOverview',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getPerformanceOverview(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAudienceDemographics = createAsyncThunk(
  'analytics/fetchAudienceDemographics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getAudienceDemographics(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchGeographicDistribution = createAsyncThunk(
  'analytics/fetchGeographicDistribution',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getGeographicDistribution(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchPlatformDistribution = createAsyncThunk(
  'analytics/fetchPlatformDistribution',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getPlatformDistribution(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchRevenueAnalytics = createAsyncThunk(
  'analytics/fetchRevenueAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getRevenueAnalytics(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTopTracks = createAsyncThunk(
  'analytics/fetchTopTracks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getTopTracks(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTopReleases = createAsyncThunk(
  'analytics/fetchTopReleases',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getTopReleases(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchListenerGrowth = createAsyncThunk(
  'analytics/fetchListenerGrowth',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getListenerGrowth(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchAnalyticsForPeriod = createAsyncThunk(
  'analytics/fetchAnalyticsForPeriod',
  async ({ period, params = {} }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getAnalyticsForPeriod(period, params);
      return { period, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const exportAnalyticsCSV = createAsyncThunk(
  'analytics/exportAnalyticsCSV',
  async ({ type, params = {} }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.exportAnalyticsCSV(type, params);
      return { type, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchComparisonAnalytics = createAsyncThunk(
  'analytics/fetchComparisonAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getComparisonAnalytics(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  performanceOverview: null,
  audienceDemographics: null,
  geographicDistribution: null,
  platformDistribution: null,
  revenueAnalytics: null,
  topTracks: [],
  topReleases: [],
  listenerGrowth: null,
  periodData: {},
  comparisonData: null,
  exportedData: {},
  isLoading: false,
  error: null,
  timeframe: '30d', // Default timeframe
};

// Analytics slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTimeframe: (state, action) => {
      state.timeframe = action.payload;
    },
    clearExportedData: (state) => {
      state.exportedData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch performance overview
      .addCase(fetchPerformanceOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPerformanceOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.performanceOverview = action.payload;
        state.error = null;
      })
      .addCase(fetchPerformanceOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch performance overview';
      })
      
      // Fetch audience demographics
      .addCase(fetchAudienceDemographics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAudienceDemographics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.audienceDemographics = action.payload;
        state.error = null;
      })
      .addCase(fetchAudienceDemographics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch audience demographics';
      })
      
      // Fetch geographic distribution
      .addCase(fetchGeographicDistribution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeographicDistribution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.geographicDistribution = action.payload;
        state.error = null;
      })
      .addCase(fetchGeographicDistribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch geographic distribution';
      })
      
      // Fetch platform distribution
      .addCase(fetchPlatformDistribution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlatformDistribution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.platformDistribution = action.payload;
        state.error = null;
      })
      .addCase(fetchPlatformDistribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch platform distribution';
      })
      
      // Fetch revenue analytics
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueAnalytics = action.payload;
        state.error = null;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch revenue analytics';
      })
      
      // Fetch top tracks
      .addCase(fetchTopTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topTracks = action.payload;
        state.error = null;
      })
      .addCase(fetchTopTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch top tracks';
      })
      
      // Fetch top releases
      .addCase(fetchTopReleases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopReleases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topReleases = action.payload;
        state.error = null;
      })
      .addCase(fetchTopReleases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch top releases';
      })
      
      // Fetch listener growth
      .addCase(fetchListenerGrowth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListenerGrowth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listenerGrowth = action.payload;
        state.error = null;
      })
      .addCase(fetchListenerGrowth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch listener growth';
      })
      
      // Fetch analytics for period
      .addCase(fetchAnalyticsForPeriod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsForPeriod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.periodData[action.payload.period] = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAnalyticsForPeriod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch analytics for period';
      })
      
      // Export analytics CSV
      .addCase(exportAnalyticsCSV.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportAnalyticsCSV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exportedData[action.payload.type] = action.payload.data;
        state.error = null;
      })
      .addCase(exportAnalyticsCSV.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to export analytics';
      })
      
      // Fetch comparison analytics
      .addCase(fetchComparisonAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComparisonAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comparisonData = action.payload;
        state.error = null;
      })
      .addCase(fetchComparisonAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch comparison analytics';
      });
  },
});

export const { clearError, setTimeframe, clearExportedData } = analyticsSlice.actions;

export default analyticsSlice.reducer;