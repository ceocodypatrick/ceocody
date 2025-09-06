import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import playerReducer from './slices/playerSlice';
import uiReducer from './slices/uiSlice';
import tracksReducer from './slices/tracksSlice';
import releasesReducer from './slices/releasesSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    ui: uiReducer,
    tracks: tracksReducer,
    releases: releasesReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['tracks/uploadTrackAudio/pending', 'tracks/uploadTrackCover/pending', 'releases/uploadReleaseCover/pending'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg.onProgress'],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
});