import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  currentView: 'home',
  notifications: [],
  modals: {
    upload: false,
    createRelease: false,
    editProfile: false,
    support: false,
  },
  theme: 'light',
  loading: {
    tracks: false,
    artists: false,
    releases: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLoading: (state, action) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  toggleSidebar,
  setCurrentView,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  toggleTheme,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;