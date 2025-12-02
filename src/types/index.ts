// Core application types for Harmoni

// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills: string[];
  genres: string[];
  instruments: string[];
  role: UserRole;
  experience: ExperienceLevel;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  MUSICIAN = 'musician',
  PRODUCER = 'producer',
  COMPOSER = 'composer',
  DJ = 'dj',
  ENGINEER = 'engineer',
  ARTIST = 'artist',
  OTHER = 'other'
}

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional'
}

// Project related types
export interface Project {
  id: string;
  title: string;
  description: string;
  genre: string;
  mood: string;
  bpm?: number;
  key?: string;
  duration?: number;
  coverImage?: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  createdBy: string;
  collaborators: ProjectCollaborator[];
  files: ProjectFile[];
  comments: ProjectComment[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

export enum ProjectStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum ProjectVisibility {
  PRIVATE = 'private',
  COLLABORATORS = 'collaborators',
  PUBLIC = 'public',
  UNLISTED = 'unlisted'
}

export interface ProjectCollaborator {
  userId: string;
  role: CollaboratorRole;
  permissions: string[];
  joinedAt: Date;
  lastActive: Date;
}

export enum CollaboratorRole {
  OWNER = 'owner',
  PRODUCER = 'producer',
  COMPOSER = 'composer',
  MUSICIAN = 'musician',
  ENGINEER = 'engineer',
  VIEWER = 'viewer'
}

// File related types
export interface ProjectFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  url: string;
  duration?: number;
  metadata?: AudioMetadata;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  version: number;
  isLatest: boolean;
}

export enum FileType {
  AUDIO = 'audio',
  MIDI = 'midi',
  PROJECT = 'project',
  IMAGE = 'image',
  DOCUMENT = 'document',
  OTHER = 'other'
}

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  genre?: string;
  duration: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  format: string;
}

// Comment related types
export interface ProjectComment {
  id: string;
  projectId: string;
  fileId?: string;
  userId: string;
  content: string;
  timestamp: number; // For audio comments
  createdAt: Date;
  updatedAt: Date;
  replies: CommentReply[];
  isResolved: boolean;
}

export interface CommentReply {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

// AI Analysis types
export interface AIAnalysis {
  id: string;
  fileId: string;
  genre: string[];
  mood: string[];
  key: string;
  tempo: number;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  recommendations: string[];
  createdAt: Date;
}

// Collaboration types
export interface CollaborationRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  projectId?: string;
  message: string;
  status: RequestStatus;
  createdAt: Date;
  respondedAt?: Date;
}

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

// Message types
export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  type: MessageType;
  readAt?: Date;
  createdAt: Date;
}

export enum MessageType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  FILE = 'file',
  PROJECT_INVITE = 'project_invite'
}

// Audio Player types
export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  waveform?: number[];
  metadata?: AudioMetadata;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: AudioTrack[];
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// UI State types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentView: string;
  activeProject?: string;
  selectedFiles: string[];
  playingTrack?: string;
  volume: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  role: UserRole;
  acceptTerms: boolean;
}

export interface ProjectForm {
  title: string;
  description: string;
  genre: string;
  mood: string;
  visibility: ProjectVisibility;
  tags: string[];
  deadline?: Date;
}

// Audio Player Events
export interface AudioPlayerEvents {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
}

// Export all types for convenience
export type {
  User,
  Project,
  ProjectFile,
  ProjectComment,
  AIAnalysis,
  CollaborationRequest,
  Message,
  AudioTrack,
  Playlist,
  UIState,
  LoginForm,
  RegisterForm,
  ProjectForm,
  AudioPlayerEvents
};