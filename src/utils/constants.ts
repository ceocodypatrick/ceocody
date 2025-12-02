// Application constants for Harmoni

// Music genres
export const MUSIC_GENRES = [
  'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country',
  'Folk', 'Blues', 'Reggae', 'Metal', 'Punk', 'Indie', 'Alternative', 'Dance',
  'Soul', 'Funk', 'World', 'Ambient', 'Techno', 'House', 'Dubstep', 'Trance',
  'Gospel', 'Latin', 'Afrobeats', 'K-Pop', 'Disco', 'New Wave', 'Synthwave'
] as const;

// Music moods
export const MUSIC_MOODS = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Dark', 'Bright', 'Melancholic', 'Uplifting',
  'Aggressive', 'Peaceful', 'Dramatic', 'Playful', 'Mysterious', 'Romantic',
  'Intense', 'Relaxed', 'Anthemic', 'Intimate', 'Powerful', 'Subtle'
] as const;

// Musical instruments
export const MUSICAL_INSTRUMENTS = [
  // Strings
  'Guitar', 'Electric Guitar', 'Bass Guitar', 'Violin', 'Cello', 'Double Bass',
  'Ukulele', 'Mandolin', 'Banjo', 'Harp',
  
  // Piano & Keys
  'Piano', 'Electric Piano', 'Organ', 'Synthesizer', 'Keyboards', 'MIDI Controller',
  
  // Drums & Percussion
  'Drums', 'Electronic Drums', 'Percussion', 'Congas', 'Bongos', 'Tabla',
  'Djembe', 'Cajon', 'Timbales', 'Maracas',
  
  // Brass
  'Trumpet', 'Trombone', 'French Horn', 'Tuba', 'Saxophone', 'Flugelhorn',
  
  // Woodwinds
  'Flute', 'Clarinet', 'Oboe', 'Bassoon', 'Piccolo', 'Recorder', 'Harmonica',
  
  // Ethnic/Traditional
  'Sitar', 'Tabla', 'Didgeridoo', 'Bagpipes', 'Koto', 'Erhu', 'Kalimba',
  'Pan Flute', 'Talking Drum', 'Berimbau',
  
  // Electronic
  'Turntables', 'DJ Controller', 'Sampler', 'Drum Machine', 'Groovebox',
  'Sequencer', 'MIDI Keyboard', 'Audio Interface',
  
  // Voice
  'Vocals', 'Backing Vocals', 'Choir', 'Beatboxing', 'Vocal Percussion'
] as const;

// Music keys
export const MUSICAL_KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'
] as const;

// BPM ranges by genre
export const BPM_RANGES = {
  'Ambient': { min: 60, max: 90 },
  'Chillout': { min: 80, max: 110 },
  'Hip Hop': { min: 70, max: 110 },
  'House': { min: 115, max: 135 },
  'Techno': { min: 120, max: 140 },
  'Trance': { min: 130, max: 150 },
  'Dubstep': { min: 130, max: 150 },
  'DnB': { min: 160, max: 180 },
  'Rock': { min: 80, max: 160 },
  'Pop': { min: 100, max: 130 },
  'Jazz': { min: 60, max: 200 },
  'Classical': { min: 40, max: 180 },
  'Electronic': { min: 90, max: 140 }
} as const;

// Audio formats
export const AUDIO_FORMATS = [
  'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff'
] as const;

// Supported file types
export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg', // mp3
  'audio/wav', // wav
  'audio/flac', // flac
  'audio/aac', // aac
  'audio/ogg', // ogg
  'audio/mp4', // m4a
  'audio/x-aiff', // aiff
  'audio/x-ms-wma' // wma
] as const;

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  AUDIO: 500 * 1024 * 1024, // 500MB
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
  PROJECT: 100 * 1024 * 1024 // 100MB
} as const;

// Pagination
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  USERS: {
    PROFILE: '/api/users/profile',
    SEARCH: '/api/users/search',
    FOLLOWERS: '/api/users/followers',
    FOLLOWING: '/api/users/following'
  },
  PROJECTS: {
    LIST: '/api/projects',
    CREATE: '/api/projects',
    GET: '/api/projects/:id',
    UPDATE: '/api/projects/:id',
    DELETE: '/api/projects/:id',
    COLLABORATE: '/api/projects/:id/collaborate',
    FILES: '/api/projects/:id/files'
  },
  FILES: {
    UPLOAD: '/api/files/upload',
    ANALYZE: '/api/files/:id/analyze',
    WAVEFORM: '/api/files/:id/waveform'
  },
  AI: {
    ANALYZE: '/api/ai/analyze',
    RECOMMEND: '/api/ai/recommend',
    GENERATE: '/api/ai/generate'
  },
  MESSAGES: {
    LIST: '/api/messages',
    SEND: '/api/messages/send',
    MARK_READ: '/api/messages/:id/read'
  }
} as const;

// Color palette
export const COLORS = {
  PRIMARY: {
    50: '#f0f4ff',
    100: '#e0e8ff',
    500: '#6366f1',
    600: '#4f46e5',
    900: '#1e1b4b'
  },
  ACCENT: {
    ROSE: '#f43f5e',
    EMERALD: '#10b981',
    AMBER: '#f59e0b',
    CYAN: '#06b6d4',
    PURPLE: '#a855f7',
    PINK: '#ec4899'
  },
  GRAY: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
} as const;

// Audio player constants
export const AUDIO_PLAYER = {
  MIN_VOLUME: 0,
  MAX_VOLUME: 1,
  DEFAULT_VOLUME: 0.7,
  SEEK_STEP: 5, // seconds
  PLAYBACK_RATES: [0.5, 0.75, 1, 1.25, 1.5, 2] as const
} as const;

// Regex patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PROJECT_TITLE: /^[a-zA-Z0-9\s\-_]{1,100}$/
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  INVALID_USERNAME: 'Username must be 3-20 characters with letters, numbers and underscores only',
  PASSWORD_MISMATCH: 'Passwords do not match',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'File type not supported',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_DELETED: 'Project deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  MESSAGE_SENT: 'Message sent successfully',
  COLLABORATION_ACCEPTED: 'Collaboration request accepted',
  COLLABORATION_REJECTED: 'Collaboration request rejected'
} as const;

// Feature flags
export const FEATURES = {
  AI_ANALYSIS: true,
  COLLABORATION: true,
  MESSAGING: true,
  PROJECT_TEMPLATES: false,
  ADVANCED_AUDIO: false,
  MONETIZATION: false,
  LIVE_SESSIONS: false
} as const;

// Default values
export const DEFAULTS = {
  PROJECT_COVER: '/images/default-project-cover.jpg',
  USER_AVATAR: '/images/default-avatar.jpg',
  PLAYLIST_COVER: '/images/default-playlist-cover.jpg'
} as const;

// Export all constants
export * from './constants';