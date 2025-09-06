import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../api';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      const response = await authService.uploadAvatar(file, onProgress);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.logout();
    return null;
  }
);

// Initial state
const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  isLoading: false,
  error: null,
  profileUpdateSuccess: false,
  passwordChangeSuccess: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.profileUpdateSuccess = false;
      state.passwordChangeSuccess = false;
    },
    // Keep the original actions for backward compatibility
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    updateProfileAction: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch user data';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.profileUpdateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        state.profileUpdateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update profile';
        state.profileUpdateSuccess = false;
      })
      
      // Upload avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.avatar = action.payload.avatarUrl;
        }
        state.error = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to upload avatar';
      })
      
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.passwordChangeSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to change password';
        state.passwordChangeSuccess = false;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { 
  clearError, 
  resetSuccess, 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateProfileAction 
} = authSlice.actions;

export default authSlice.reducer;