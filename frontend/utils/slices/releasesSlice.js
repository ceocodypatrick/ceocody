import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { releasesService } from '../api';

// Async thunks
export const fetchReleases = createAsyncThunk(
  'releases/fetchReleases',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await releasesService.getAllReleases(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchReleaseById = createAsyncThunk(
  'releases/fetchReleaseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await releasesService.getReleaseById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createRelease = createAsyncThunk(
  'releases/createRelease',
  async (releaseData, { rejectWithValue }) => {
    try {
      const response = await releasesService.createRelease(releaseData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateRelease = createAsyncThunk(
  'releases/updateRelease',
  async ({ id, releaseData }, { rejectWithValue }) => {
    try {
      const response = await releasesService.updateRelease(id, releaseData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteRelease = createAsyncThunk(
  'releases/deleteRelease',
  async (id, { rejectWithValue }) => {
    try {
      await releasesService.deleteRelease(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const uploadReleaseCover = createAsyncThunk(
  'releases/uploadReleaseCover',
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const response = await releasesService.uploadReleaseCover(file, onProgress);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addTracksToRelease = createAsyncThunk(
  'releases/addTracksToRelease',
  async ({ releaseId, trackIds }, { rejectWithValue }) => {
    try {
      const response = await releasesService.addTracksToRelease(releaseId, trackIds);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const removeTrackFromRelease = createAsyncThunk(
  'releases/removeTrackFromRelease',
  async ({ releaseId, trackId }, { rejectWithValue }) => {
    try {
      const response = await releasesService.removeTrackFromRelease(releaseId, trackId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchReleaseAnalytics = createAsyncThunk(
  'releases/fetchReleaseAnalytics',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await releasesService.getReleaseAnalytics(id, params);
      return { id, analytics: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const submitForDistribution = createAsyncThunk(
  'releases/submitForDistribution',
  async ({ id, platforms }, { rejectWithValue }) => {
    try {
      const response = await releasesService.submitForDistribution(id, platforms);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getDistributionStatus = createAsyncThunk(
  'releases/getDistributionStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await releasesService.getDistributionStatus(id);
      return { id, status: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  releases: [],
  currentRelease: null,
  uploadedCover: null,
  analytics: {},
  distributionStatus: {},
  isLoading: false,
  error: null,
  uploadProgress: 0,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  distributionSuccess: false,
  totalReleases: 0,
  filters: {
    search: '',
    type: '',
    sortBy: 'releaseDate',
    sortOrder: 'desc',
  },
};

// Releases slice
const releasesSlice = createSlice({
  name: 'releases',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.distributionSuccess = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        type: '',
        sortBy: 'releaseDate',
        sortOrder: 'desc',
      };
    },
    clearUploadedCover: (state) => {
      state.uploadedCover = null;
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all releases
      .addCase(fetchReleases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReleases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.releases = action.payload.releases;
        state.totalReleases = action.payload.total;
        state.error = null;
      })
      .addCase(fetchReleases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch releases';
      })
      
      // Fetch release by ID
      .addCase(fetchReleaseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReleaseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRelease = action.payload;
        state.error = null;
      })
      .addCase(fetchReleaseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch release';
      })
      
      // Create release
      .addCase(createRelease.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createRelease.fulfilled, (state, action) => {
        state.isLoading = false;
        state.releases.unshift(action.payload);
        state.totalReleases += 1;
        state.error = null;
        state.createSuccess = true;
      })
      .addCase(createRelease.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create release';
        state.createSuccess = false;
      })
      
      // Update release
      .addCase(updateRelease.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateRelease.fulfilled, (state, action) => {
        state.isLoading = false;
        state.releases = state.releases.map(release => 
          release._id === action.payload._id ? action.payload : release
        );
        if (state.currentRelease && state.currentRelease._id === action.payload._id) {
          state.currentRelease = action.payload;
        }
        state.error = null;
        state.updateSuccess = true;
      })
      .addCase(updateRelease.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update release';
        state.updateSuccess = false;
      })
      
      // Delete release
      .addCase(deleteRelease.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteRelease.fulfilled, (state, action) => {
        state.isLoading = false;
        state.releases = state.releases.filter(release => release._id !== action.payload);
        state.totalReleases -= 1;
        if (state.currentRelease && state.currentRelease._id === action.payload) {
          state.currentRelease = null;
        }
        state.error = null;
        state.deleteSuccess = true;
      })
      .addCase(deleteRelease.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete release';
        state.deleteSuccess = false;
      })
      
      // Upload release cover
      .addCase(uploadReleaseCover.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadReleaseCover.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadedCover = action.payload;
        state.error = null;
        state.uploadProgress = 100;
      })
      .addCase(uploadReleaseCover.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to upload cover';
        state.uploadProgress = 0;
      })
      
      // Add tracks to release
      .addCase(addTracksToRelease.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTracksToRelease.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentRelease && state.currentRelease._id === action.payload._id) {
          state.currentRelease = action.payload;
        }
        state.releases = state.releases.map(release => 
          release._id === action.payload._id ? action.payload : release
        );
        state.error = null;
      })
      .addCase(addTracksToRelease.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add tracks to release';
      })
      
      // Remove track from release
      .addCase(removeTrackFromRelease.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeTrackFromRelease.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentRelease && state.currentRelease._id === action.payload._id) {
          state.currentRelease = action.payload;
        }
        state.releases = state.releases.map(release => 
          release._id === action.payload._id ? action.payload : release
        );
        state.error = null;
      })
      .addCase(removeTrackFromRelease.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to remove track from release';
      })
      
      // Fetch release analytics
      .addCase(fetchReleaseAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReleaseAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics[action.payload.id] = action.payload.analytics;
        state.error = null;
      })
      .addCase(fetchReleaseAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch release analytics';
      })
      
      // Submit for distribution
      .addCase(submitForDistribution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.distributionSuccess = false;
      })
      .addCase(submitForDistribution.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentRelease && state.currentRelease._id === action.payload._id) {
          state.currentRelease = action.payload;
        }
        state.releases = state.releases.map(release => 
          release._id === action.payload._id ? action.payload : release
        );
        state.error = null;
        state.distributionSuccess = true;
      })
      .addCase(submitForDistribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to submit for distribution';
        state.distributionSuccess = false;
      })
      
      // Get distribution status
      .addCase(getDistributionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDistributionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.distributionStatus[action.payload.id] = action.payload.status;
        state.error = null;
      })
      .addCase(getDistributionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to get distribution status';
      });
  },
});

export const { 
  clearError, 
  resetSuccess, 
  setFilters, 
  resetFilters, 
  clearUploadedCover 
} = releasesSlice.actions;

export default releasesSlice.reducer;