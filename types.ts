

export type ActiveTool = 'dashboard' | 'audit' | 'smartlink' | 'calculator' | 'credithunter' | 'summitscore' | 'contracts' | 'transcriber' | 'prtoolkit' | 'contentplanner' | 'visuals' | 'marketanalyst' | 'financials' | 'playlistpitcher' | 'songpreviewer';

export interface AgeRange {
  range: string;
  percentage: number;
}

export interface GenderDistribution {
  label: string;
  percentage: number;
}

// Types for Smart Link Creator
export type Platform =
  | 'Spotify'
  | 'Apple Music'
  | 'YouTube'
  | 'Instagram'
  | 'TikTok'
  | 'Twitter'
  | 'SoundCloud'
  | 'Bandcamp'
  | 'Website'
  | 'Merch'
  | 'Other';

export interface ArtistLink {
  platform: Platform;
  url: string;
}

export interface SmartLinkData {
  artistName: string;
  profilePictureUrl: string;
  bio: string;
  links: ArtistLink[];
}

// Types for Credit Hunter
export interface CreditEntry {
  platform: string;
  role: string;
  creditedName: string;
  sourceUrl: string;
}

export interface CreditReport {
  trackTitle: string;
  artistName: string;
  isrc: string | null;
  credits: CreditEntry[];
}

// Types for Contract Creator
export interface Collaborator {
  name: string;
  role: string;
  split: number;
}

export interface ContractData {
  type: 'Songwriter Split Sheet' | 'Producer Agreement' | 'Feature Artist Agreement';
  projectName: string;
  collaborators: Collaborator[];
  recoupableExpenses: string;
  additionalTerms: string;
}

// Types for Lyrics Transcriber
export interface LyricsLine {
  startTime: number;
  endTime: number;
  text: string;
}

export interface TranscriptionResult {
  lines: LyricsLine[];
}

// Types for Content Planner
export interface PlatformBestPractice {
  title: string;
  description: string;
}

export interface CalendarPost {
    timing: 'Morning' | 'Afternoon' | 'Evening';
    platform: 'TikTok' | 'Instagram' | 'YouTube';
    description: string;
}

export interface CalendarDay {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    theme: string;
    posts: CalendarPost[];
}

export interface ContentCampaign {
  strategy: string;
  ideas: ContentIdea[];
  bestPractices: PlatformBestPractice[];
  weeklyCalendar: CalendarDay[];
}

export interface ContentIdea {
  title: string;
  description: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  format: string;
  viralPotential: 'Medium' | 'High' | 'Very High';
  details: string[];
}

// Types for AI Visual Creator
export interface VisualConceptResult {
  title: string;
  description: string;
  colorPalette: string[];
  motionElements: string[];
  script?: { shot: number; description: string; overlayText: string; }[];
  backgroundImageBase64: string;
}

// Types for AI Market Analyst
export interface TrendingArtist {
  name: string;
  reason: string;
}

export interface MarketAnalysisResult {
  marketSummary: string;
  trendingArtists: TrendingArtist[];
  keyPlatforms: string[];
  contentStrategies: string[];
  audienceProfile: string[];
}

// Types for AI Financial Planner
export interface RevenueForecast {
  month: string;
  revenue: number;
}

export interface RevenueSource {
  name: string;
  value: number;
}

export interface RoyaltySourceEntry {
  song: string;
  platform: string;
  earnings: number;
}

export interface AdvanceOffer {
  amount: number;
  recoupRate: number;
  note: string;
}

export interface FinancialReport {
  forecast: RevenueForecast[];
  sources: RevenueSource[];
  sampleRoyaltyDashboard: RoyaltySourceEntry[];
  advanceOffer: AdvanceOffer;
}

// Types for AI Data Dashboard
export interface KeyMetric {
    metric: string;
    value: string;
}

export interface HistoricalDataPoint {
    month: string;
    listeners: number;
}

export interface PlaylistPlacement {
    playlistName: string;
    curator: string;
    dateAdded: string;
}

export interface ArtistAnalyticsReport {
    keyMetrics: KeyMetric[];
    historicalPerformance: HistoricalDataPoint[];
    audienceDemographics: AgeRange[];
    playlistPlacements: PlaylistPlacement[];
}

// Types for AI Playlist Pitcher
export interface PlaylistPitchTarget {
    playlistName: string;
    curator: string;
    platform: 'Spotify' | 'Apple Music' | 'Other';
    followerCount: string;
    matchAnalysis: string;
    submissionContact: string | null;
}

export interface PlaylistPitchReport {
    targets: PlaylistPitchTarget[];
}

// Types for Summit Score
export interface SummitScoreResult {
  score: number;
  summary: string;
  engagementAnalysis: {
    rate: number;
    benchmark: number;
    diagnosis: string;
  };
  contentAnalysis: {
    mix: { name: string; value: number }[];
    diagnosis: string;
  };
  roadmapToRecovery: {
    title: string;
    description: string;
  }[];
}

// Types for AI Song Previewer
export interface SongPreviewResult {
    title: string;
    summary: string;
    moodAndGenre: string[];
    instrumentation: string[];
    viralityScore: number;
    viralityAnalysis: string;
    platformFit: { platform: string; reason: string; }[];
    targetAudience: string[];
    coverArtBase64: string;
}

// Types for the Master Proposal
export type StrategicPillar = "Content Transformation" | "Strategic Release Cadence" | "Community Building" | "Targeted Digital Offensive" | "Cultural Placement & Brand Elevation" | "Foundation";

export interface ArtistProfile {
    coreIdentity: string;
    currentAudience: string;
    targetPersonas: { name: string, description: string }[];
}

export interface ContentPillar {
    pillarName: string;
    description: string;
    examples: string[];
}

export interface KpiSet {
    category: string; // e.g., "Digital Infrastructure & Branding"
    indicators: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  pillar: StrategicPillar;
}

export interface ReleasePhase {
  title: string;
  tasks: ChecklistItem[];
}

export interface BudgetItem {
    item: string;
    cost: number;
    notes: string;
}

export interface ReleasePlan {
  phases: ReleasePhase[];
  budget: BudgetItem[];
}

export interface MasterProposal {
    executiveSummary: string;
    artistProfile: ArtistProfile;
    campaignGoals: string[];
    coreNarrative: string;
    contentPillars: ContentPillar[];
    releasePlan: ReleasePlan;
    kpis: KpiSet[];
    sources: any[];
}