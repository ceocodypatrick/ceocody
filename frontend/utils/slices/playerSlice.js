import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  repeat: 'off', // 'off', 'all', 'one'
  shuffle: false,
  history: [],
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.progress = 0;
      
      // Add to history if it's a new track
      if (state.currentTrack && state.currentTrack.id !== action.payload.id) {
        state.history = [
          ...state.history.filter(track => track.id !== action.payload.id),
          action.payload
        ].slice(-20); // Keep last 20 tracks
      }
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter(track => track.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    playNext: (state) => {
      if (state.queue.length > 0) {
        state.currentTrack = state.queue[0];
        state.queue = state.queue.slice(1);
        state.isPlaying = true;
        state.progress = 0;
      } else {
        state.isPlaying = false;
      }
    },
    toggleRepeat: (state) => {
      const modes = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeat);
      state.repeat = modes[(currentIndex + 1) % modes.length];
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
  },
});

export const {
  setCurrentTrack,
  togglePlayPause,
  play,
  pause,
  setVolume,
  setProgress,
  setDuration,
  addToQueue,
  removeFromQueue,
  clearQueue,
  playNext,
  toggleRepeat,
  toggleShuffle,
} = playerSlice.actions;

export default playerSlice.reducer;