import React, { useState, useCallback, useEffect, useRef, FC, PropsWithChildren, Component, ErrorInfo, ReactNode, createContext, useReducer, useContext, useMemo, ChangeEvent, KeyboardEvent, forwardRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type, GenerateContentResponse, Chat, Schema } from "@google/genai";
import { marked } from 'https://esm.sh/marked@13.0.0';
import { useDropzone } from 'react-dropzone';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell as RechartsCell } from 'recharts';

// Third-party libraries are loaded from CDN in index.html
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

//================================================================
// TYPE DEFINITIONS
//================================================================
interface Audience {
  artistName: string;
  demographics: {
    ageRange: string;
    genderDistribution: { name: string; percentage: number }[];
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

interface Insight {
  title: string;
  description: string;
  actionable_advice: string;
}

interface MarketAnalysis {
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

interface ContentIdea {
  platform: string;
  idea: string;
  format: string;
  potential_impact: string;
}

interface ContentPlan {
  content_pillars: string[];
  content_ideas: ContentIdea[];
  posting_schedule: {
    platform: string;
    frequency: string;
    best_time_to_post: string;
  }[];
}

interface PressRelease {
  headline: string;
  subheadline: string;
  body: string;
  boilerplate: string;
  contact_info: string;
}

interface FinancialPlan {
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

interface SummitScoreData {
  score: number;
  explanation: string;
  areas_for_improvement: string[];
}

interface RoyaltySplit {
    id: number;
    songTitle: string;
    collaborators: {
        name: string;
        contribution: string;
        percentage: number;
    }[];
    isFinalized: boolean;
}

interface MasterProposal {
    title: string;
    executive_summary: string;
    sections: {
        title: string;
        content: string;
    }[];
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ReputationMention {
    uri: string;
    title: string;
}

interface ReputationData {
    summary: string;
    themes: string[];
    mentions: ReputationMention[];
}

interface ReleaseTask {
    text: string;
    completed: boolean;
}

interface ReleaseTaskGroup {
    category: string;
    items: ReleaseTask[];
}

interface ReleaseTimeframe {
    title: string;
    groups: ReleaseTaskGroup[];
}

interface ReleasePlan {
    artistName: string;
    releaseTitle: string;
    releaseDate: string; // ISO string
    timeframes: ReleaseTimeframe[];
}

interface SuggestedReply {
    category: string;
    text: string;
}

interface FanMailAnalysis {
    sentiment: { name: string, value: number }[];
    keyThemes: string[];
    suggestedReplies: SuggestedReply[];
    contentIdeas: string[];
}

interface VenueInfo {
    name: string;
    location: string;
    capacity?: string;
    contact?: string;
    reasoning: string;
}

interface Setlist {
    songs: string[];
    notes: string;
}

interface MerchIdea {
    item: string;
    description: string;
}

interface TourPlan {
    venues: VenueInfo[];
    setlist: Setlist;
    merchandise: MerchIdea[];
}

interface AIGeneratedImage {
    prompt: string;
    aspectRatio: string;
    url: string;
}

interface LyricIdeaSet {
    titles: string[];
    concepts: { title: string; description: string; }[];
    progression: string;
}

interface SocialPost {
    platform: 'Instagram' | 'Twitter' | 'TikTok';
    content: string;
    hashtags: string[];
}

interface MerchConcept {
    item: string;
    description: string;
    design_prompt: string;
}

interface AppNotification {
    id: number;
    message: string;
    type: 'success' | 'error';
}

interface DealMemoAnalysis {
    summary: string;
    key_terms: { term: string; explanation: string; }[];
    red_flags: string[];
}

interface BrandKit {
    brand_statement: string;
    color_palettes: { name: string; colors: string[]; }[];
    font_pairings: { headline: string; body: string; }[];
    logo_prompts: string[];
}

interface AudioTranscription {
    text: string;
    fileName: string;
}

interface ArtistBio {
    short: string;
    medium: string;
    long: string;
}

interface SyncPitch {
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

interface Guide {
    id: string;
    title: string;
    description: string;
    unlocksWith: keyof DashboardData | 'initial';
    icon: ReactNode;
    content?: string; // Pre-loaded for static guides
    cta?: {
        text: string;
        buttonText: string;
        url: string;
    }
}

interface Contact {
    id: number;
    name: string;
    role: string;
    company: string;
    email?: string;
    notes?: string;
}

interface ArtworkAnalysis {
    analysisA: string;
    analysisB: string;
    recommendation: string;
    winner: 'A' | 'B' | 'None';
    imageA_url: string; // Store the URL of the analyzed image
    imageB_url: string;
}

interface DashboardData {
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

type LoadingStates = { [K in keyof DashboardData | 'chat' | 'guide' | 'royaltySplitSuggestion']?: boolean };
type ErrorStates = { [K in keyof DashboardData | 'chat' | 'guide' | 'royaltySplitSuggestion']?: string | null };

//================================================================
// ICONS
//================================================================
const IconWrapper: FC<PropsWithChildren<{ className?: string }>> = ({ children, className = "h-6 w-6" }) => <div className={className}>{children}</div>;
const ArrowDownTrayIcon = () => <IconWrapper className="h-5 w-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg></IconWrapper>;
const BookOpenIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg></IconWrapper>;
const CalendarDaysIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg></IconWrapper>;
const ChartBarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg></IconWrapper>;
const ChartTrendingUpIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625V3.375" /></svg></IconWrapper>;
const ChatBubbleOvalLeftEllipsisIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.372c-1.131.113-2.056.63-2.785 1.275a2.11 2.11 0 01-2.999 0l-2.785-1.275a2.11 2.11 0 00-2.999 0l-3.722-.372C3.847 17.097 3 16.136 3 15v-4.286c0-.97.616-1.813 1.5-2.097l5.51-1.653a2.25 2.25 0 012.002 0l5.51 1.653z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg></IconWrapper>;
const ClipboardDocumentCheckIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></IconWrapper>;
const ClipboardIcon = () => <IconWrapper className="h-4 w-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg></IconWrapper>;
const ClipboardListIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></IconWrapper>;
const CurrencyDollarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982.553-.413 1.282-.62 2.003-.62.72 0 1.43.207 2 .62.98.728 2.245.244 2.52-1.014a1.125 1.125 0 00-1.342-1.342c-1.352-.903-3.053-.903-4.404 0-1.352.903-1.352 2.374 0 3.277" /></svg></IconWrapper>;
const DocumentDuplicateIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375V9.375m0 9.375a3.375 3.375 0 01-3.375 3.375H9.375a3.375 3.375 0 01-3.375-3.375m7.5 10.375a3.375 3.375 0 003.375-3.375V9.375" /></svg></IconWrapper>;
const DocumentTextIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></IconWrapper>;
const EnvelopeIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></IconWrapper>;
const FilmIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v6m0 0l-2.25 1.313M3 7.5l2.25-1.313M3 7.5v6m0 0l2.25 1.313M12 4.5v15m0 0l-3.75-2.162M12 19.5l3.75-2.162M12 19.5l-7.5-4.33v-6.34L12 4.5l7.5 4.33v6.34L12 19.5z" /></svg></IconWrapper>;
const FireIcon = () => <IconWrapper className="text-orange-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.04-1.04A8.25 8.25 0 0112 3c1.228 0 2.38.34 3.362.914l-2.02 2.02zM18 12a6 6 0 11-12 0 6 6 0 0112 0z" /></svg></IconWrapper>;
const GiftIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></IconWrapper>;
const IdentificationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></IconWrapper>;
const LightBulbIcon = () => <IconWrapper className="text-yellow-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-1.5c1.5-1.5 1.5-3.75 0-5.25S13.5 3.75 12 3.75s-3 1.5-3 3.75c0 .75.25 1.5.75 2.25 1.25 1.5 2.25 2.25 2.25 3.75zm-3 4.5h6" /></svg></IconWrapper>;
const LockClosedIcon = () => <IconWrapper className="h-5 w-5"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></IconWrapper>;
const MapIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0 0v2.25m0-2.25h1.5m-1.5 0H5.25m11.25-8.25v2.25m0-2.25h-1.5m1.5 0h.008v.008h-.008v-.008zm-3.75 0h.008v.008h-.008v-.008zm-3.75 0h.008v.008h-.008v-.008zM12 21a8.25 8.25 0 008.25-8.25c0-4.995-4.57-9.568-8.25-9.568S3.75 7.755 3.75 12.75A8.25 8.25 0 0012 21z" /></svg></IconWrapper>;
const MicrophoneIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 013-3 3 3 0 013 3v8.25a3 3 0 01-3 3z" /></svg></IconWrapper>;
const MountainIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg></IconWrapper>;
const MusicalNoteIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 0019.5 5.25v-.003" /></svg></IconWrapper>;
const NewspaperIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-13.5c-.621 0-1.125-.504-1.125-1.125v-9.75c0 .621.504-1.125 1.125-1.125H6.75" /></svg></IconWrapper>;
const PaperAirplaneIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg></IconWrapper>;
const PencilSquareIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg></IconWrapper>;
const ScaleIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.71-5.685-1.942m-2.62-10.726C5.175 5.487 4.175 5.661 3.165 5.82c-.483.174-.711.703-.59 1.202L5.2 17.747c1.545 1.232 3.553 1.942 5.685 1.942.82 0 1.63-.12 2.4-.36l.004-.002z" /></svg></IconWrapper>;
const ShareIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" /></svg></IconWrapper>;
const SparklesIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l.41-1.42a.5.5 0 01.98 0l.41 1.42a2.5 2.5 0 001.91 1.91l1.42.41a.5.5 0 010 .98l-1.42.41a2.5 2.5 0 00-1.91 1.91l-.41 1.42a.5.5 0 01-.98 0l-.41-1.42a2.5 2.5 0 00-1.91-1.91l-1.42-.41a.5.5 0 010-.98l1.42.41a2.5 2.5 0 001.91-1.91z" /></svg></IconWrapper>;
const UserCheckIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h-3m-1.5-4.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" /></svg></IconWrapper>;
const UserGroupIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM10.5 15a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm10.5-9.75h-5.625c-.621 0-1.125.504-1.125 1.125v1.125c0 .621.504 1.125 1.125 1.125h5.625c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125z" /></svg></IconWrapper>;
const UsersIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg></IconWrapper>;

//================================================================
// COMPONENTS
//================================================================

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error("Boundary caught error:", error, info); }
  render() {
    if (this.state.hasError) return this.props.fallback || <div className="p-4 text-red-500 bg-red-50 rounded">Something went wrong.</div>;
    return this.props.children;
  }
}

//----------------------------------------------------------------
// Market Analysis View
//----------------------------------------------------------------
const MarketAnalysisView: FC<{
  data: MarketAnalysis | undefined;
  isLoading: boolean;
  onAnalyze: (artist: string) => void;
}> = ({ data, isLoading, onAnalyze }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Trending Suggestions List
  const TRENDING_SUGGESTIONS = [
    "Taylor Swift", "The Weeknd", "Bad Bunny", "Drake", "Beyoncé",
    "Harry Styles", "Dua Lipa", "Billie Eilish", "Kendrick Lamar",
    "SZA", "Olivia Rodrigo", "Ariana Grande", "Travis Scott", "Post Malone",
    "Pop", "Hip Hop", "R&B", "K-Pop", "Latin", "Rock", "Electronic",
    "Afrobeats", "Indie", "Alternative", "Country"
  ];

  const handleExportPDF = async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert("PDF libraries not loaded.");
      return;
    }
    const element = document.getElementById('market-analysis-content');
    if (!element) return;
    
    try {
      const canvas = await window.html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('market-analysis.pdf');
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = TRENDING_SUGGESTIONS.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Optional: Auto-trigger analyze
    // onAnalyze(suggestion); 
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Market Analysis</h2>
          <p className="text-gray-400">Deep dive into artist positioning, SWOT, and competitors.</p>
        </div>
         <button 
            onClick={handleExportPDF}
            disabled={!data}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!data ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white transition-colors'}`}
          >
            <ArrowDownTrayIcon />
            Export PDF
          </button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] shadow-lg relative z-20" ref={suggestionRef}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter artist name or genre (e.g. Taylor Swift, Pop)..."
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => {
                 setIsInputFocused(true);
                 if (searchTerm) setShowSuggestions(true);
              }}
            />
            
            {/* Auto-suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d2d2d] border border-[#3c3c3c] rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-[#3c3c3c] text-gray-300 cursor-pointer transition-colors border-b border-[#3c3c3c] last:border-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                        <ChartTrendingUpIcon />
                        {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onAnalyze(searchTerm)}
            disabled={isLoading || !searchTerm}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
        {!showSuggestions && (
           <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-400">
             <span>Trending:</span>
             {TRENDING_SUGGESTIONS.slice(0, 5).map(t => (
               <button key={t} onClick={() => setSearchTerm(t)} className="hover:text-green-400 transition-colors underline decoration-dotted">{t}</button>
             ))}
           </div>
        )}
      </div>

      {data && (
        <div id="market-analysis-content" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#1e1e1e] p-4 rounded-xl">
          {/* SWOT Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] border-l-4 border-l-green-500">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <ChartBarIcon /> Strengths
              </h3>
              <ul className="space-y-2">
                {data.swot.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] border-l-4 border-l-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <ArrowDownTrayIcon /> Weaknesses
              </h3>
              <ul className="space-y-2">
                {data.swot.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-red-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <LightBulbIcon /> Opportunities
              </h3>
              <ul className="space-y-2">
                {data.swot.opportunities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] border-l-4 border-l-yellow-500">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <FireIcon /> Threats
              </h3>
              <ul className="space-y-2">
                {data.swot.threats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-yellow-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <UsersIcon /> Competitor Landscape
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.competitors.map((comp, idx) => (
                <div key={idx} className="bg-[#1e1e1e] p-5 rounded-lg border border-[#3c3c3c] hover:border-gray-500 transition-colors">
                  <h4 className="font-bold text-lg text-white mb-3">{comp.name}</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-green-400 font-semibold block mb-1">Strength:</span>
                      <p className="text-gray-400 leading-relaxed">{comp.strengths}</p>
                    </div>
                    <div>
                      <span className="text-red-400 font-semibold block mb-1">Weakness:</span>
                      <p className="text-gray-400 leading-relaxed">{comp.weaknesses}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trends & Target Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ChartTrendingUpIcon /> Market Trends
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.market_trends.map((trend, i) => (
                  <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-800">
                    {trend}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShareIcon /> Target Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.target_platforms.map((platform, i) => (
                  <span key={i} className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-800">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//----------------------------------------------------------------
// Audience Insights View
//----------------------------------------------------------------
// Colors for charts
const COLORS = ['#A78BFA', '#F472B6', '#34D399', '#60A5FA', '#FBBF24'];

const AudienceInsightsView: FC<{
  data: Audience | undefined;
  isLoading: boolean;
  onAnalyze: (artist: string) => void;
}> = ({ data, isLoading, onAnalyze }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const TRENDING_SUGGESTIONS = [
    "Taylor Swift", "The Weeknd", "Bad Bunny", "Drake", "Beyoncé",
    "Harry Styles", "Dua Lipa", "Billie Eilish", "Kendrick Lamar",
    "SZA", "Olivia Rodrigo", "Ariana Grande", "Travis Scott", "Post Malone",
    "Pop", "Hip Hop", "R&B", "K-Pop", "Latin", "Rock", "Electronic",
    "Afrobeats", "Indie", "Alternative", "Country"
  ];

  const handleExportPDF = async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert("PDF libraries not loaded.");
      return;
    }
    const element = document.getElementById('audience-insights-content');
    if (!element) return;
    
    try {
      const canvas = await window.html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('audience-insights.pdf');
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = TRENDING_SUGGESTIONS.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Optional: Auto-trigger analyze
    // onAnalyze(suggestion); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Audience Insights</h2>
          <p className="text-gray-400">Understand demographics, psychographics, and behavior.</p>
        </div>
        <button 
            onClick={handleExportPDF}
            disabled={!data}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!data ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white transition-colors'}`}
          >
            <ArrowDownTrayIcon />
            Export PDF
          </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] shadow-lg relative z-20" ref={suggestionRef}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter artist name (e.g. Taylor Swift)..."
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => { if (searchTerm) setShowSuggestions(true); }}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d2d2d] border border-[#3c3c3c] rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-[#3c3c3c] text-gray-300 cursor-pointer transition-colors border-b border-[#3c3c3c] last:border-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                        <ChartTrendingUpIcon />
                        {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onAnalyze(searchTerm)}
            disabled={isLoading || !searchTerm}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>

      {data && (
        <div id="audience-insights-content" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Demographics */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#252526] p-4 rounded-xl border border-[#3c3c3c]">
                 <div className="flex items-center gap-2 text-green-400 mb-2 font-semibold"><UserCheckIcon /> Age Range</div>
                 <div className="text-2xl font-bold text-white">{data.demographics.ageRange}</div>
              </div>
              
              {/* Gender Chart */}
              <div className="bg-[#252526] p-4 rounded-xl border border-[#3c3c3c] flex flex-col">
                 <div className="flex items-center gap-2 text-purple-400 mb-2 font-semibold"><UsersIcon /> Gender Distribution</div>
                 <div className="flex-1 min-h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.demographics.genderDistribution}
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="percentage"
                        >
                          {data.demographics.genderDistribution.map((entry, index) => (
                            <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`${value}%`]} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-center gap-3 text-xs mt-2 flex-wrap">
                    {data.demographics.genderDistribution.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-gray-400">{entry.name}</span>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#252526] p-4 rounded-xl border border-[#3c3c3c]">
                 <div className="flex items-center gap-2 text-blue-400 mb-2 font-semibold"><ChatBubbleOvalLeftEllipsisIcon /> Language</div>
                 <div className="text-2xl font-bold text-white">{data.demographics.primaryLanguage}</div>
              </div>
               <div className="bg-[#252526] p-4 rounded-xl border border-[#3c3c3c]">
                 <div className="flex items-center gap-2 text-orange-400 mb-2 font-semibold"><MapIcon /> Top Countries</div>
                 <div className="flex flex-wrap gap-1">
                   {data.demographics.topCountries.map((c, i) => <span key={i} className="text-sm bg-orange-900/30 text-orange-200 px-2 py-1 rounded">{c}</span>)}
                 </div>
              </div>
           </div>

           {/* Psychographics & Online Behavior */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><LightBulbIcon /> Psychographics</h3>
                 
                 <div className="mb-4">
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.psychographics.interests.map((item, i) => (
                            <span key={i} className="bg-yellow-900/20 text-yellow-200 px-3 py-1 rounded-full text-sm border border-yellow-800/50">{item}</span>
                        ))}
                    </div>
                 </div>

                 <div className="mb-4">
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Values</h4>
                     <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {data.psychographics.values.map((v, i) => <li key={i}>{v}</li>)}
                     </ul>
                 </div>
                 
                 <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Personality</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.psychographics.personalityTraits.map((item, i) => (
                            <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">{item}</span>
                        ))}
                    </div>
                 </div>
              </div>

              <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ShareIcon /> Online Behavior</h3>
                 
                 <div className="mb-4">
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Social Media</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.onlineBehavior.socialMediaUsage.map((item, i) => (
                            <span key={i} className="bg-blue-900/20 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-800/50">{item}</span>
                        ))}
                    </div>
                 </div>

                 <div className="mb-4">
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Content Preferences</h4>
                    <ul className="space-y-2">
                        {data.onlineBehavior.preferredContent.map((item, i) => (
                             <li key={i} className="flex items-center gap-2 text-gray-300">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                {item}
                             </li>
                        ))}
                    </ul>
                 </div>
                 
                 <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Shopping Habits</h4>
                    <p className="text-gray-300 italic">"{data.onlineBehavior.onlineShopping}"</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

//----------------------------------------------------------------
// Content Strategy View
//----------------------------------------------------------------
const ContentStrategyView: FC<{
  data: ContentPlan | undefined;
  isLoading: boolean;
  onAnalyze: (artist: string) => void;
}> = ({ data, isLoading, onAnalyze }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const TRENDING_SUGGESTIONS = [
    "Taylor Swift", "The Weeknd", "Bad Bunny", "Drake", "Beyoncé",
    "Harry Styles", "Dua Lipa", "Billie Eilish", "Kendrick Lamar",
    "SZA", "Olivia Rodrigo", "Ariana Grande", "Travis Scott", "Post Malone",
    "Pop", "Hip Hop", "R&B", "K-Pop", "Latin", "Rock", "Electronic",
    "Afrobeats", "Indie", "Alternative", "Country"
  ];

  const handleExportPDF = async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert("PDF libraries not loaded.");
      return;
    }
    const element = document.getElementById('content-strategy-content');
    if (!element) return;
    
    try {
      const canvas = await window.html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('content-strategy.pdf');
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = TRENDING_SUGGESTIONS.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Content Strategy</h2>
          <p className="text-gray-400">Generate creative content pillars, ideas, and posting schedules.</p>
        </div>
        <button 
            onClick={handleExportPDF}
            disabled={!data}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!data ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white transition-colors'}`}
          >
            <ArrowDownTrayIcon />
            Export PDF
          </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] shadow-lg relative z-20" ref={suggestionRef}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter artist name (e.g. Taylor Swift)..."
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => { if (searchTerm) setShowSuggestions(true); }}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d2d2d] border border-[#3c3c3c] rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-[#3c3c3c] text-gray-300 cursor-pointer transition-colors border-b border-[#3c3c3c] last:border-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                        <ChartTrendingUpIcon />
                        {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onAnalyze(searchTerm)}
            disabled={isLoading || !searchTerm}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {data && (
        <div id="content-strategy-content" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Content Pillars */}
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><IdentificationIcon /> Content Pillars</h3>
                <div className="flex gap-3 flex-wrap">
                    {data.content_pillars.map((pillar, index) => (
                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-800 text-green-100 rounded-full text-sm font-medium shadow-sm">
                            {pillar}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Ideas */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><LightBulbIcon /> Content Ideas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.content_ideas.map((idea, index) => (
                        <div key={index} className="bg-[#252526] p-5 rounded-xl border border-[#3c3c3c] hover:border-gray-500 transition-colors flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/20 px-2 py-1 rounded">{idea.platform}</span>
                                <span className={`text-xs px-2 py-1 rounded border ${
                                    idea.potential_impact.toLowerCase().includes('high') ? 'bg-green-900/20 text-green-400 border-green-800' : 
                                    idea.potential_impact.toLowerCase().includes('medium') ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800' : 'bg-gray-800 text-gray-400 border-gray-700'
                                }`}>{idea.potential_impact} Impact</span>
                            </div>
                            <h4 className="font-bold text-white mb-2">{idea.format}</h4>
                            <p className="text-gray-400 text-sm flex-grow">{idea.idea}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Posting Schedule */}
            <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CalendarDaysIcon /> Posting Schedule</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#3c3c3c]">
                                <th className="p-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Platform</th>
                                <th className="p-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Frequency</th>
                                <th className="p-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Best Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3c3c3c]">
                            {data.posting_schedule.map((schedule, index) => (
                                <tr key={index} className="hover:bg-[#2a2a2a] transition-colors">
                                    <td className="p-4 text-white font-medium">{schedule.platform}</td>
                                    <td className="p-4 text-gray-300">{schedule.frequency}</td>
                                    <td className="p-4 text-gray-300">{schedule.best_time_to_post}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

//----------------------------------------------------------------
// Financial Plan View
//----------------------------------------------------------------
const FinancialPlanView: FC<{
  data: FinancialPlan | undefined;
  isLoading: boolean;
  onAnalyze: (artist: string) => void;
}> = ({ data, isLoading, onAnalyze }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const TRENDING_SUGGESTIONS = [
    "Taylor Swift", "The Weeknd", "Bad Bunny", "Drake", "Beyoncé",
    "Harry Styles", "Dua Lipa", "Billie Eilish", "Kendrick Lamar",
    "SZA", "Olivia Rodrigo", "Ariana Grande", "Travis Scott", "Post Malone",
    "Pop", "Hip Hop", "R&B", "K-Pop", "Latin", "Rock", "Electronic",
    "Afrobeats", "Indie", "Alternative", "Country"
  ];

  const handleExportPDF = async () => {
    if (!window.jspdf || !window.html2canvas) {
      alert("PDF libraries not loaded.");
      return;
    }
    const element = document.getElementById('financial-plan-content');
    if (!element) return;
    
    try {
      const canvas = await window.html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('financial-plan.pdf');
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = TRENDING_SUGGESTIONS.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Financial Plan</h2>
          <p className="text-gray-400">Analyze revenue streams, allocate budget, and set financial goals.</p>
        </div>
        <button 
            onClick={handleExportPDF}
            disabled={!data}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${!data ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white transition-colors'}`}
          >
            <ArrowDownTrayIcon />
            Export PDF
          </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c] shadow-lg relative z-20" ref={suggestionRef}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter artist name (e.g. Taylor Swift)..."
              className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => { if (searchTerm) setShowSuggestions(true); }}
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d2d2d] border border-[#3c3c3c] rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-[#3c3c3c] text-gray-300 cursor-pointer transition-colors border-b border-[#3c3c3c] last:border-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                        <ChartTrendingUpIcon />
                        {suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onAnalyze(searchTerm)}
            disabled={isLoading || !searchTerm}
            className="bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {data && (
        <div id="financial-plan-content" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Revenue Streams */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CurrencyDollarIcon /> Revenue Streams</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.revenue_streams.map((stream, index) => (
                        <div key={index} className="bg-[#252526] p-5 rounded-xl border border-[#3c3c3c] flex flex-col hover:border-green-500/50 transition-colors">
                            <h4 className="font-bold text-lg text-green-400 mb-3">{stream.stream}</h4>
                            <div className="space-y-3 flex-grow">
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Short Term</span>
                                    <p className="text-gray-300 text-sm mt-1">{stream.short_term_potential}</p>
                                </div>
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Long Term</span>
                                    <p className="text-gray-300 text-sm mt-1">{stream.long_term_potential}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Budget Allocation & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Budget Allocation */}
                <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ChartBarIcon /> Budget Allocation</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-1/2 h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.budget_allocation}
                                        dataKey="percentage"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    >
                                        {data.budget_allocation.map((entry, index) => (
                                            <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => [`${value}%`]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            {data.budget_allocation.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="text-white font-medium">{item.category}</span>
                                        </div>
                                        <span className="text-green-400 font-bold">{item.percentage}%</span>
                                    </div>
                                    <p className="text-xs text-gray-500 pl-5">{item.notes}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Financial Goals */}
                <div className="bg-[#252526] p-6 rounded-xl border border-[#3c3c3c]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><SparklesIcon /> Financial Goals</h3>
                    <ul className="space-y-4">
                        {data.financial_goals.map((goal, index) => (
                            <li key={index} className="flex items-start gap-3 bg-[#1e1e1e] p-4 rounded-lg border border-[#3c3c3c]">
                                <div className="mt-1 min-w-[24px] flex justify-center">
                                    <div className="w-6 h-6 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center text-green-400 text-xs font-bold">
                                        {index + 1}
                                    </div>
                                </div>
                                <span className="text-gray-300">{goal}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};


//----------------------------------------------------------------
// MAIN APP COMPONENT
//----------------------------------------------------------------
const App = () => {
  const [activeView, setActiveView] = useState<keyof DashboardData>('marketAnalysis'); // Default to Market Analysis for this demo
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState<LoadingStates>({});
  
  // Initialize AI
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  // Handlers
  const handleMarketAnalysis = async (artist: string) => {
    setLoading(prev => ({ ...prev, marketAnalysis: true }));
    try {
      const prompt = `Perform a comprehensive market analysis for the music artist "${artist}". 
      Include a detailed SWOT analysis, identify 3-5 key competitors with their strengths/weaknesses, list current market trends relevant to this artist, and identify the best target platforms for their growth.
      
      Return the response in JSON format.`;

      const schema: Schema = {
        type: Type.OBJECT,
        properties: {
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                strengths: { type: Type.STRING },
                weaknesses: { type: Type.STRING },
              }
            }
          },
          market_trends: { type: Type.ARRAY, items: { type: Type.STRING } },
          target_platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      };

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: schema
        }
      });

      const responseText = result.text;
      if (!responseText) throw new Error("No response text received");
      
      const analysisData = JSON.parse(responseText) as MarketAnalysis;
      
      setDashboardData(prev => ({ ...prev, marketAnalysis: analysisData }));
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to generate market analysis. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, marketAnalysis: false }));
    }
  };

  const handleAudienceAnalysis = async (artist: string) => {
    setLoading(prev => ({ ...prev, audience: true }));
    try {
      const prompt = `Generate detailed audience insights for the music artist "${artist}". 
      Include demographics (age range, gender distribution with percentages, top 3 countries, primary language), 
      psychographics (interests, values, personality traits), 
      and online behavior (social media usage, preferred content types, online shopping habits).
      
      Return the response in JSON format.`;

      const schema: Schema = {
        type: Type.OBJECT,
        properties: {
          artistName: { type: Type.STRING },
          demographics: {
            type: Type.OBJECT,
            properties: {
              ageRange: { type: Type.STRING },
              genderDistribution: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    percentage: { type: Type.NUMBER },
                  }
                }
              },
              topCountries: { type: Type.ARRAY, items: { type: Type.STRING } },
              primaryLanguage: { type: Type.STRING },
            }
          },
          psychographics: {
            type: Type.OBJECT,
            properties: {
              interests: { type: Type.ARRAY, items: { type: Type.STRING } },
              values: { type: Type.ARRAY, items: { type: Type.STRING } },
              personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          },
          onlineBehavior: {
            type: Type.OBJECT,
            properties: {
              socialMediaUsage: { type: Type.ARRAY, items: { type: Type.STRING } },
              preferredContent: { type: Type.ARRAY, items: { type: Type.STRING } },
              onlineShopping: { type: Type.STRING },
            }
          }
        }
      };

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: schema
        }
      });

      const responseText = result.text;
      if (!responseText) throw new Error("No response text received");
      
      const audienceData = JSON.parse(responseText) as Audience;
      
      setDashboardData(prev => ({ ...prev, audience: audienceData }));
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to generate audience insights. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, audience: false }));
    }
  };

  const handleContentStrategy = async (artist: string) => {
    setLoading(prev => ({ ...prev, contentPlan: true }));
    try {
      const prompt = `Develop a comprehensive content strategy for the music artist "${artist}".
      1. Identify 3-5 core Content Pillars (themes).
      2. Provide 5 creative Content Ideas, specifying the platform (Instagram, TikTok, YouTube, etc.), the idea summary, the format (Reel, Carousel, Story, Short), and potential impact level.
      3. Create a Posting Schedule for key platforms (Instagram, TikTok, YouTube), including frequency and best times to post.
      
      Return the response in JSON format.`;

      const schema: Schema = {
        type: Type.OBJECT,
        properties: {
          content_pillars: { type: Type.ARRAY, items: { type: Type.STRING } },
          content_ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                idea: { type: Type.STRING },
                format: { type: Type.STRING },
                potential_impact: { type: Type.STRING },
              }
            }
          },
          posting_schedule: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    platform: { type: Type.STRING },
                    frequency: { type: Type.STRING },
                    best_time_to_post: { type: Type.STRING },
                }
            }
          },
        }
      };

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: schema
        }
      });

      const responseText = result.text;
      if (!responseText) throw new Error("No response text received");
      
      const contentData = JSON.parse(responseText) as ContentPlan;
      
      setDashboardData(prev => ({ ...prev, contentPlan: contentData }));
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to generate content strategy. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, contentPlan: false }));
    }
  };

  const handleFinancialPlan = async (artist: string) => {
    setLoading(prev => ({ ...prev, financialPlan: true }));
    try {
      const prompt = `Create a financial plan for music artist "${artist}".
      1. List potential Revenue Streams (e.g., Streaming, Touring, Merch) with descriptions for short-term and long-term potential.
      2. Suggest a Budget Allocation for a standard release campaign (percentages should roughly sum to 100), including categories like Marketing, Production, PR, etc., with explanatory notes.
      3. List 3-5 specific Financial Goals.
      
      Return the response in JSON format.`;

      const schema: Schema = {
        type: Type.OBJECT,
        properties: {
          revenue_streams: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stream: { type: Type.STRING },
                short_term_potential: { type: Type.STRING },
                long_term_potential: { type: Type.STRING },
              }
            }
          },
          budget_allocation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                percentage: { type: Type.NUMBER },
                notes: { type: Type.STRING },
              }
            }
          },
          financial_goals: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
      };

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: schema
        }
      });

      const responseText = result.text;
      if (!responseText) throw new Error("No response text received");
      
      const financialData = JSON.parse(responseText) as FinancialPlan;
      
      setDashboardData(prev => ({ ...prev, financialPlan: financialData }));
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to generate financial plan. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, financialPlan: false }));
    }
  };

  // Simple Sidebar Navigation
  const NavItem = ({ view, icon, label }: { view: keyof DashboardData, icon: ReactNode, label: string }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeView === view ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#1e1e1e] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#252526] border-r border-[#3c3c3c] flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-[#3c3c3c]">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MusicalNoteIcon />
            <span>Career Co-Pilot</span>
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavItem view="marketAnalysis" icon={<ChartBarIcon />} label="Market Analysis" />
          <NavItem view="audience" icon={<UserGroupIcon />} label="Audience Insights" />
          <NavItem view="contentPlan" icon={<CalendarDaysIcon />} label="Content Strategy" />
          <NavItem view="financialPlan" icon={<CurrencyDollarIcon />} label="Financials" />
          {/* Add more nav items as needed */}
        </nav>
        <div className="p-4 border-t border-[#3c3c3c] text-xs text-gray-500 text-center">
            Powered by Gemini 2.5 Flash
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#1e1e1e] relative">
         <div className="max-w-6xl mx-auto p-8">
            <ErrorBoundary>
              {activeView === 'marketAnalysis' && (
                <MarketAnalysisView 
                  data={dashboardData.marketAnalysis} 
                  isLoading={loading.marketAnalysis || false} 
                  onAnalyze={handleMarketAnalysis} 
                />
              )}
              {activeView === 'audience' && (
                <AudienceInsightsView 
                  data={dashboardData.audience} 
                  isLoading={loading.audience || false} 
                  onAnalyze={handleAudienceAnalysis} 
                />
              )}
              {activeView === 'contentPlan' && (
                <ContentStrategyView 
                  data={dashboardData.contentPlan} 
                  isLoading={loading.contentPlan || false} 
                  onAnalyze={handleContentStrategy} 
                />
              )}
              {activeView === 'financialPlan' && (
                <FinancialPlanView 
                  data={dashboardData.financialPlan} 
                  isLoading={loading.financialPlan || false} 
                  onAnalyze={handleFinancialPlan} 
                />
              )}
              {activeView !== 'marketAnalysis' && activeView !== 'audience' && activeView !== 'contentPlan' && activeView !== 'financialPlan' && (
                <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                    <div className="text-6xl mb-4 opacity-20"><LockClosedIcon /></div>
                    <h3 className="text-xl font-semibold">Module Not Implemented</h3>
                    <p>Select "Market Analysis", "Audience Insights", "Content Strategy", or "Financials" to see the demo.</p>
                </div>
              )}
            </ErrorBoundary>
         </div>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);