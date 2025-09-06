import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tracksService } from '../api';

// Async thunks
export const fetchTracks = createAsyncThunk(
  'tracks/fetchTracks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await tracksService.getAllTracks(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTrackById = createAsyncThunk(
  'tracks/fetchTrackById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tracksService.getTrackById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createTrack = createAsyncThunk(
  'tracks/createTrack',
  async (trackData, { rejectWithValue }) => {
    try {
      const response = await tracksService.createTrack(trackData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateTrack = createAsyncThunk(
  'tracks/updateTrack',
  async ({ id, trackData }, { rejectWithValue }) => {
    try {
      const response = await tracksService.updateTrack(id, trackData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteTrack = createAsyncThunk(
  'tracks/deleteTrack',
  async (id, { rejectWithValue }) => {
    try {
      await tracksService.deleteTrack(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const uploadTrackAudio = createAsyncThunk(
  'tracks/uploadTrackAudio',
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const response = await tracksService.uploadTrackAudio(file, onProgress);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const uploadTrackCover = createAsyncThunk(
  'tracks/uploadTrackCover',
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const response = await tracksService.uploadTrackCover(file, onProgress);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const fetchTrackAnalytics = createAsyncThunk(
  'tracks/fetchTrackAnalytics',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await tracksService.getTrackAnalytics(id, params);
      return { id, analytics: response };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Initial state
const initialState = {
  tracks: [],
  currentTrack: null,
  uploadedAudio: null,
  uploadedCover: null,
  analytics: {},
  isLoading: false,
  error: null,
  uploadProgress: 0,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  totalTracks: 0,
  filters: {
    search: '',
    genre: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Tracks slice
const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        genre: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
    clearUploadedFiles: (state) => {
      state.uploadedAudio = null;
      state.uploadedCover = null;
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tracks
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = action.payload.tracks;
        state.totalTracks = action.payload.total;
        state.error = null;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch tracks';
      })
      
      // Fetch track by ID
      .addCase(fetchTrackById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrackById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTrack = action.payload;
        state.error = null;
      })
      .addCase(fetchTrackById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch track';
      })
      
      // Create track
      .addCase(createTrack.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks.unshift(action.payload);
        state.totalTracks += 1;
        state.error = null;
        state.createSuccess = true;
      })
      .addCase(createTrack.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create track';
        state.createSuccess = false;
      })
      
      // Update track
      .addCase(updateTrack.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateTrack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = state.tracks.map(track => 
          track._id === action.payload._id ? action.payload : track
        );
        if (state.currentTrack && state.currentTrack._id === action.payload._id) {
          state.currentTrack = action.payload;
        }
        state.error = null;
        state.updateSuccess = true;
      })
      .addCase(updateTrack.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update track';
        state.updateSuccess = false;
      })
      
      // Delete track
      .addCase(deleteTrack.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tracks = state.tracks.filter(track => track._id !== action.payload);
        state.totalTracks -= 1;
        if (state.currentTrack && state.currentTrack._id === action.payload) {
          state.currentTrack = null;
        }
        state.error = null;
        state.deleteSuccess = true;
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete track';
        state.deleteSuccess = false;
      })
      
      // Upload track audio
      .addCase(uploadTrackAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadTrackAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadedAudio = action.payload;
        state.error = null;
        state.uploadProgress = 100;
      })
      .addCase(uploadTrackAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to upload audio';
        state.uploadProgress = 0;
      })
      
      // Upload track cover
      .addCase(uploadTrackCover.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadTrackCover.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadedCover = action.payload;
        state.error = null;
      })
      .addCase(uploadTrackCover.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to upload cover';
      })
      
      // Fetch track analytics
      .addCase(fetchTrackAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrackAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analytics[action.payload.id] = action.payload.analytics;
        state.error = null;
      })
      .addCase(fetchTrackAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch track analytics';
      });
  },
});

export const { 
  clearError, 
  resetSuccess, 
  setFilters, 
  resetFilters, 
  clearUploadedFiles 
} = tracksSlice.actions;

export default tracksSlice.reducer;