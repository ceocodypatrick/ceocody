export interface Audience {
  artistName: string;
  demographics: {
    ageRange: string;
    gender: string;
    topCountries: string[];
    primaryLanguage: string;
  };
  psychographics: {
    interests: string[];
    values: string[];
    personalityTraits: string[];
  };
  onlineBehavior: {
    socialMediaUsage: string[];
    preferredContent: string[];
    onlineShopping: string;
  };
}

export interface Insight {
  title: string;
  description: string;
  actionable_advice: string;
}

export interface MarketAnalysis {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitors: {
    name: string;
    strengths: string;
    weaknesses: string;
  }[];
  market_trends: string[];
  target_platforms: string[];
}

export interface ContentIdea {
  platform: string;
  idea: string;
  format: string;
  potential_impact: string;
}

export interface ContentPlan {
  content_pillars: string[];
  content_ideas: ContentIdea[];
  posting_schedule: {
    platform: string;
    frequency: string;
    best_time_to_post: string;
  };
}

export interface PressRelease {
  headline: string;
  subheadline: string;
  body: string;
  boilerplate: string;
  contact_info: string;
}

export interface FinancialPlan {
  revenue_streams: {
    stream: string;
    short_term_potential: string;
    long_term_potential: string;
  }[];
  budget_allocation: {
    category: string;
    percentage: number;
    notes: string;
  }[];
  financial_goals: string[];
}

export interface SummitScoreData {
  score: number;
  explanation: string;
  areas_for_improvement: string[];
}

export interface RoyaltySplit {
  id: number;
  songTitle: string;
  collaborators: {
    name: string;
    contribution: string;
    percentage: number;
  }[];
  isFinalized: boolean;
}

export interface MasterProposal {
  title: string;
  executive_summary: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ReputationMention {
  uri: string;
  title: string;
}

export interface ReputationData {
  summary: string;
  themes: string[];
  mentions: ReputationMention[];
}

export interface ReleaseTask {
  text: string;
  completed: boolean;
}

export interface ReleaseTaskGroup {
  category: string;
  items: ReleaseTask[];
}

export interface ReleaseTimeframe {
  title: string;
  groups: ReleaseTaskGroup[];
}

export interface ReleasePlan {
  artistName: string;
  releaseTitle: string;
  releaseDate: string;
  timeframes: ReleaseTimeframe[];
}

export interface SuggestedReply {
  category: string;
  text: string;
}

export interface FanMailAnalysis {
  sentiment: { name: string; value: number }[];
  keyThemes: string[];
  suggestedReplies: SuggestedReply[];
  contentIdeas: string[];
}

export interface VenueInfo {
  name: string;
  location: string;
  capacity?: string;
  contact?: string;
  reasoning: string;
}

export interface Setlist {
  songs: string[];
  notes: string;
}

export interface MerchIdea {
  item: string;
  description: string;
}

export interface TourPlan {
  venues: VenueInfo[];
  setlist: Setlist;
  merchandise: MerchIdea[];
}

export interface AIGeneratedImage {
  prompt: string;
  aspectRatio: string;
  url: string;
}

export interface LyricIdeaSet {
  titles: string[];
  concepts: { title: string; description: string }[];
  progression: string;
}

export interface SocialPost {
  platform: 'Instagram' | 'Twitter' | 'TikTok';
  content: string;
  hashtags: string[];
}

export interface MerchConcept {
  item: string;
  description: string;
  design_prompt: string;
}

export interface AppNotification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface DealMemoAnalysis {
  summary: string;
  key_terms: { term: string; explanation: string }[];
  red_flags: string[];
}

export interface BrandKit {
  brand_statement: string;
  color_palettes: { name: string; colors: string[] }[];
  font_pairings: { headline: string; body: string }[];
  logo_prompts: string[];
}

export interface AudioTranscription {
  text: string;
  fileName: string;
}

export interface ArtistBio {
  short: string;
  medium: string;
  long: string;
}

export interface SyncPitch {
  music_supervisors: {
    name: string;
    company: string;
    reasoning: string;
  }[];
  pitch_email: {
    subject: string;
    body: string;
  };
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  unlocksWith: keyof DashboardData | 'initial';
  icon: React.ReactNode;
  content?: string;
  cta?: {
    text: string;
    buttonText: string;
    url: string;
  };
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  company: string;
  email?: string;
  notes?: string;
}

export interface ArtworkAnalysis {
  analysisA: string;
  analysisB: string;
  recommendation: string;
  winner: 'A' | 'B' | 'None';
  imageA_url: string;
  imageB_url: string;
}

export interface DashboardData {
  audience?: Audience;
  insights?: Insight[];
  marketAnalysis?: MarketAnalysis;
  contentPlan?: ContentPlan;
  pressRelease?: PressRelease;
  financialPlan?: FinancialPlan;
  summitScore?: SummitScoreData;
  masterProposal?: MasterProposal;
  reputationData?: ReputationData;
  releasePlan?: ReleasePlan;
  fanMailAnalysis?: FanMailAnalysis;
  tourPlan?: TourPlan;
  aiGeneratedImage?: AIGeneratedImage;
  lyricIdeas?: LyricIdeaSet;
  socialPosts?: SocialPost[];
  merchConcepts?: MerchConcept[];
  dealMemoAnalysis?: DealMemoAnalysis;
  brandKit?: BrandKit;
  audioTranscription?: AudioTranscription;
  artistBio?: ArtistBio;
  royaltySplits?: RoyaltySplit[];
  syncPitch?: SyncPitch;
  contacts?: Contact[];
  artworkAnalysis?: ArtworkAnalysis;
}

export type LoadingStates = {
  [K in keyof DashboardData | 'chat' | 'guide' | 'royaltySplitSuggestion']?: boolean;
};

export type ErrorStates = {
  [K in keyof DashboardData | 'chat' | 'guide' | 'royaltySplitSuggestion']?: string | null;
};

