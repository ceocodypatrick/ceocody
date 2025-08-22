
import React, { useState, useCallback, useEffect, useRef, FC, PropsWithChildren, Component, ErrorInfo, ReactNode, createContext, useReducer, useContext, useMemo, ChangeEvent, KeyboardEvent } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { marked } from 'https://esm.sh/marked@13.0.0';


// Note: In a real environment, you would install these dependencies.
// For this preview, we assume they are available.
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { useDropzone } from 'react-dropzone';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
    Recharts: any;
    // Add useDropzone to window for the preview environment
    useDropzone: (options: any) => {
      getRootProps: (props?: any) => any;
      getInputProps: (props?: any) => any;
      isDragActive: boolean;
    };
  }
}

// Mock imports for preview environment. The real functionality is included below.
const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell: RechartsCell } = window.Recharts || {
    ResponsiveContainer: ({ children }: PropsWithChildren<{}>) => <div style={{ width: '100%', height: 300 }}>{children}</div>,
    BarChart: ({ children, data }: {children: ReactNode, data: any[]}) => <div className="p-4 bg-gray-800 rounded-lg text-white">BarChart Placeholder for {data?.length} items</div>,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: ({ active, payload }: {active?: boolean, payload?: any[]}) => active && payload && payload.length ? <div className="bg-gray-700 p-2 rounded border border-gray-600">Tooltip</div> : null,
    Legend: () => <div className="text-sm">Legend</div>,
    PieChart: ({ children }: PropsWithChildren<{}>) => <div style={{width: '100%', height: '100%'}}>{children}</div>,
    Pie: ({data}: {data: any[]}) => <div className="p-4 bg-gray-800 rounded-lg text-white">PieChart Placeholder for {data?.length} items</div>,
    Cell: () => null,
};

const useDropzone = window.useDropzone || ((options: any) => {
    const onDrop = options.onDrop;
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && onDrop) {
            onDrop(Array.from(event.target.files));
        }
    };
    return { 
        getRootProps: (props = {}) => ({...props}), 
        getInputProps: (props = {}) => ({ ...props, type: 'file', onChange: handleFileChange, accept: options.accept, multiple: options.multiple }),
        isDragActive: false
    };
});
// html2canvas and jspdf will be accessed directly from the window object when needed.


//================================================================
// TYPE DEFINITIONS
//================================================================
interface Audience {
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
  };
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
const CurrencyDollarIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982.553-.413 1.282-.62 2.003-.62.72 0 1.43.207 2 .62.98.728 2.245.244 2.52-1.014a1.125 1.125 0 00-1.342-1.342c-1.352-.903-3.053-.903-4.404 0-1.352.903-1.352 2.374 0 3.277.553.413 1.282.62 2.003-.62.72 0 1.43-.207 2-.62.98.728 2.245.244 2.52-1.014a1.125 1.125 0 00-1.342-1.342c-1.352-.903-3.053-.903-4.404 0-1.352.903-1.352 2.374 0 3.277z" /></svg></IconWrapper>;
const DocumentDuplicateIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375V9.375m0 9.375a3.375 3.375 0 01-3.375 3.375H9.375a3.375 3.375 0 01-3.375-3.375m7.5 10.375a3.375 3.375 0 003.375-3.375V9.375" /></svg></IconWrapper>;
const DocumentTextIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></IconWrapper>;
const EnvelopeIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg></IconWrapper>;
const FilmIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v6m0 0l-2.25 1.313M3 7.5l2.25-1.313M3 7.5v6m0 0l2.25 1.313M12 4.5v15m0 0l-3.75-2.162M12 19.5l3.75-2.162M12 19.5l-7.5-4.33v-6.34L12 4.5l7.5 4.33v6.34L12 19.5z" /></svg></IconWrapper>;
const FireIcon = () => <IconWrapper className="text-green-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.04-1.04A8.25 8.25 0 0112 3c1.228 0 2.38.34 3.362.914l-2.02 2.02zM18 12a6 6 0 11-12 0 6 6 0 0112 0z" /></svg></IconWrapper>;
const GiftIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></IconWrapper>;
const IdentificationIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></IconWrapper>;
const LightBulbIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-1.5c1.5-1.5 1.5-3.75 0-5.25S13.5 3.75 12 3.75s-3 1.5-3 3.75c0 .75.25 1.5.75 2.25 1.25 1.5 2.25 2.25 2.25 3.75zm-3 4.5h6" /></svg></IconWrapper>;
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
const UsersIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598M12 14.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z" /></svg></IconWrapper>;
const XCircleIcon = () => <IconWrapper className="h-5 w-5 text-red-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></IconWrapper>;
const CheckCircleIcon = () => <IconWrapper className="h-5 w-5 text-green-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></IconWrapper>;
const PlusCircleIcon = () => <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></IconWrapper>;


//================================================================
// UTILITY FUNCTIONS
//================================================================
const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        // You can add a notification here if you want
        console.log("Copied to clipboard");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};


//================================================================
// ERROR BOUNDARY
//================================================================
class ErrorBoundary extends Component<PropsWithChildren<{}>, { hasError: boolean; error?: Error }> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900 text-white rounded-lg">
          <h2 className="text-xl font-bold">Something went wrong.</h2>
          <pre className="mt-2 whitespace-pre-wrap">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

//================================================================
// STATE MANAGEMENT (Context & Reducer)
//================================================================
interface AppState {
    apiKey?: string | null;
    dashboardData: DashboardData;
    chatHistory: ChatMessage[];
    loading: LoadingStates;
    errors: ErrorStates;
    notifications: AppNotification[];
    activeGuide: Guide | null;
}

type AppAction =
  | { type: 'SET_API_KEY'; payload: string | null }
  | { type: 'SET_LOADING'; payload: { key: keyof LoadingStates; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof ErrorStates; value: string | null } }
  | { type: 'SET_DATA'; payload: { key: keyof DashboardData; value: any } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_LAST_CHAT_MESSAGE'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppNotification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'SET_ACTIVE_GUIDE'; payload: Guide | null }
  | { type: 'UPDATE_RELEASE_TASK'; payload: { timeframeIndex: number; groupIndex: number; taskIndex: number; completed: boolean } }
  | { type: 'ADD_CONTACT'; payload: Omit<Contact, 'id'> }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_ROYALTY_SPLIT'; payload: Omit<RoyaltySplit, 'id' | 'isFinalized'> };


const initialState: AppState = {
    apiKey: null,
    dashboardData: {
        contacts: [],
        royaltySplits: [],
        artworkAnalysis: undefined,
    },
    chatHistory: [{ role: 'assistant', content: "Hello! I'm your Strategy Chatbot. How can I help you with your music career today?" }],
    loading: {},
    errors: {},
    notifications: [],
    activeGuide: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  geminiService: GeminiService;
} | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.payload.key]: action.payload.value } };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.payload.key]: action.payload.value } };
    case 'SET_DATA':
      return { ...state, dashboardData: { ...state.dashboardData, [action.payload.key]: action.payload.value } };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'UPDATE_LAST_CHAT_MESSAGE': {
        const newHistory = [...state.chatHistory];
        if (newHistory.length > 0) {
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage.role === 'assistant') {
                lastMessage.content += action.payload;
            }
        }
        return { ...state, chatHistory: newHistory };
    }
    case 'ADD_NOTIFICATION': {
        const newNotification = { ...action.payload, id: Date.now() };
        return { ...state, notifications: [...state.notifications, newNotification] };
    }
    case 'REMOVE_NOTIFICATION':
        return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'SET_ACTIVE_GUIDE':
        return { ...state, activeGuide: action.payload };
    case 'UPDATE_RELEASE_TASK': {
        const { timeframeIndex, groupIndex, taskIndex, completed } = action.payload;
        const newReleasePlan = JSON.parse(JSON.stringify(state.dashboardData.releasePlan));
        if (newReleasePlan) {
            newReleasePlan.timeframes[timeframeIndex].groups[groupIndex].items[taskIndex].completed = completed;
        }
        return { ...state, dashboardData: { ...state.dashboardData, releasePlan: newReleasePlan } };
    }
    case 'ADD_CONTACT': {
        const newContact: Contact = { ...action.payload, id: Date.now() };
        const contacts = state.dashboardData.contacts ? [...state.dashboardData.contacts, newContact] : [newContact];
        return { ...state, dashboardData: { ...state.dashboardData, contacts } };
    }
    case 'SET_CONTACTS': {
        return { ...state, dashboardData: { ...state.dashboardData, contacts: action.payload } };
    }
    case 'ADD_ROYALTY_SPLIT': {
        const newSplit: RoyaltySplit = { ...action.payload, id: Date.now(), isFinalized: true };
        const royaltySplits = state.dashboardData.royaltySplits ? [...state.dashboardData.royaltySplits, newSplit] : [newSplit];
        return { ...state, dashboardData: { ...state.dashboardData, royaltySplits } };
    }
    default:
      return state;
  }
};

const AppProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const geminiService = useMemo(() => new GeminiService(dispatch), []);

    useEffect(() => {
        // Pre-populate with some initial data for demonstration
        dispatch({ type: 'ADD_CONTACT', payload: { name: 'Jane Doe', role: 'Booking Agent', company: 'Major Talent Agency', email: 'jane@majortalent.com' } });
    }, []);

    return (
        <AppContext.Provider value={{ state, dispatch, geminiService }}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

//================================================================
// GEMINI API SERVICE
//================================================================
class GeminiService {
    private ai: GoogleGenAI | null = null;
    private chat: Chat | null = null;
    private dispatch: React.Dispatch<AppAction>;

    constructor(dispatch: React.Dispatch<AppAction>) {
        this.dispatch = dispatch;
        this.initialize();
    }
    
    private initialize() {
        try {
            if (process.env.API_KEY) {
                this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            }
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            this.dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Could not initialize AI service. Please check your API key.", type: 'error' } });
        }
    }

    private getAI(): GoogleGenAI {
        if (!this.ai) {
             this.initialize();
             if(!this.ai) {
                const errorMsg = "API Key not configured. Please set up your API key.";
                this.dispatch({type: 'SET_ERROR', payload: { key: 'audience', value: errorMsg}}); // use a generic key
                throw new Error(errorMsg);
             }
        }
        return this.ai;
    }

    private async generate<T>(
        key: keyof DashboardData | keyof LoadingStates,
        prompt: string,
        schema: any,
        storeInState: boolean = true
    ): Promise<T> {
        this.dispatch({ type: 'SET_LOADING', payload: { key, value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key, value: null } });

        try {
            const ai = this.getAI();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
            const data = JSON.parse(response.text) as T;
            if (storeInState && typeof key === 'string' && key in initialState.dashboardData) {
                 this.dispatch({ type: 'SET_DATA', payload: { key: key as keyof DashboardData, value: data } });
            }
            return data;
        } catch (error: any) {
            console.error(`Error generating ${String(key)}:`, error);
            this.dispatch({ type: 'SET_ERROR', payload: { key, value: error.message || 'An unknown error occurred.' } });
            throw error;
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: { key, value: false } });
        }
    }
    
    // ... other service methods
    async generateAudienceAnalysis(artistInfo: string): Promise<Audience> {
        const prompt = `Analyze the potential audience for a music artist with the following description: "${artistInfo}". Provide a detailed breakdown of demographics, psychographics, and online behavior. Your analysis should be comprehensive and actionable for marketing purposes.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                artistName: { type: Type.STRING },
                demographics: { type: Type.OBJECT, properties: { ageRange: {type: Type.STRING}, gender: {type: Type.STRING}, topCountries: {type: Type.ARRAY, items: {type: Type.STRING}}, primaryLanguage: {type: Type.STRING}}},
                psychographics: { type: Type.OBJECT, properties: { interests: {type: Type.ARRAY, items: {type: Type.STRING}}, values: {type: Type.ARRAY, items: {type: Type.STRING}}, personalityTraits: {type: Type.ARRAY, items: {type: Type.STRING}}}},
                onlineBehavior: { type: Type.OBJECT, properties: { socialMediaUsage: {type: Type.ARRAY, items: {type: Type.STRING}}, preferredContent: {type: Type.ARRAY, items: {type: Type.STRING}}, onlineShopping: {type: Type.STRING}}},
            }
        };
        return this.generate<Audience>('audience', prompt, schema);
    }
    
    async generateStrategicInsights(audience: Audience): Promise<Insight[]> {
        const prompt = `Based on this audience profile for ${audience.artistName}, generate 3-5 key strategic insights. Each insight should have a title, a short description, and a piece of actionable advice for the artist to grow their fanbase. Audience: ${JSON.stringify(audience)}`;
        const schema = {
             type: Type.ARRAY,
             items: {
                 type: Type.OBJECT,
                 properties: {
                     title: { type: Type.STRING },
                     description: { type: Type.STRING },
                     actionable_advice: { type: Type.STRING },
                 }
             }
        };
        return this.generate<Insight[]>('insights', prompt, schema);
    }
    
    async generateMarketAnalysis(artistInfo: string): Promise<MarketAnalysis> {
        const prompt = `Create a detailed market analysis for a music artist described as: "${artistInfo}". Include a SWOT analysis, identify 3-5 potential competitors with their strengths and weaknesses, list current market trends relevant to the artist, and suggest the best platforms for them to target.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                swot: { type: Type.OBJECT, properties: { strengths: {type: Type.ARRAY, items: {type: Type.STRING}}, weaknesses: {type: Type.ARRAY, items: {type: Type.STRING}}, opportunities: {type: Type.ARRAY, items: {type: Type.STRING}}, threats: {type: Type.ARRAY, items: {type: Type.STRING}}}},
                competitors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, strengths: {type: Type.STRING}, weaknesses: {type: Type.STRING}}}},
                market_trends: { type: Type.ARRAY, items: { type: Type.STRING }},
                target_platforms: { type: Type.ARRAY, items: { type: Type.STRING }},
            }
        };
        return this.generate<MarketAnalysis>('marketAnalysis', prompt, schema);
    }

    async generateContentPlan(artistInfo: string, audience: Audience, market: MarketAnalysis): Promise<ContentPlan> {
        const prompt = `Develop a content plan for ${audience.artistName}, an artist described as "${artistInfo}". The target audience is ${JSON.stringify(audience.demographics)}. The artist should focus on these platforms: ${market.target_platforms.join(', ')}. Define 3 content pillars, generate 5-7 specific content ideas with platform and format, and create a posting schedule.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                content_pillars: { type: Type.ARRAY, items: { type: Type.STRING } },
                content_ideas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: {type: Type.STRING}, idea: {type: Type.STRING}, format: {type: Type.STRING}, potential_impact: {type: Type.STRING}}}},
                posting_schedule: { type: Type.OBJECT, properties: { platform: {type: Type.STRING}, frequency: {type: Type.STRING}, best_time_to_post: {type: Type.STRING}}},
            }
        };
        return this.generate<ContentPlan>('contentPlan', prompt, schema);
    }
    
    async generatePressRelease(releaseInfo: string, artistBio: ArtistBio): Promise<PressRelease> {
        const prompt = `Write a professional press release for a music release with the following details: "${releaseInfo}". Use the artist's bio for context. The press release needs a catchy headline, a subheadline, a compelling body, the standard artist boilerplate, and contact information. Artist Bio: ${artistBio.medium}`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                body: { type: Type.STRING },
                boilerplate: { type: Type.STRING },
                contact_info: { type: Type.STRING },
            }
        };
        return this.generate<PressRelease>('pressRelease', prompt, schema);
    }
    
    async generateFinancialPlan(artistInfo: string, audience: Audience): Promise<FinancialPlan> {
        const prompt = `Create a high-level financial plan for an artist like "${artistInfo}" targeting an audience like "${JSON.stringify(audience.demographics)}". Identify 5-7 potential revenue streams with short-term and long-term potential. Suggest a budget allocation percentage across key categories (e.g., marketing, production, touring). Outline 3-5 key financial goals.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                revenue_streams: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stream: {type: Type.STRING}, short_term_potential: {type: Type.STRING}, long_term_potential: {type: Type.STRING}}}},
                budget_allocation: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: {type: Type.STRING}, percentage: {type: Type.NUMBER}, notes: {type: Type.STRING}}}},
                financial_goals: { type: Type.ARRAY, items: { type: Type.STRING }},
            }
        };
        return this.generate<FinancialPlan>('financialPlan', prompt, schema);
    }

    async getSummitScore(dashboardData: DashboardData): Promise<SummitScoreData> {
        const prompt = `Analyze the following artist dashboard data and calculate a "Summit Score" from 0 to 100. The score should reflect the artist's overall career readiness and strategic planning. A score of 100 means they have a comprehensive, professional plan across all areas. Provide a brief explanation for the score and list the top 3 areas for improvement. Data: ${JSON.stringify(dashboardData)}`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                areas_for_improvement: { type: Type.ARRAY, items: { type: Type.STRING }},
            }
        };
        return this.generate<SummitScoreData>('summitScore', prompt, schema);
    }
    
    async generateMasterProposal(dashboardData: DashboardData): Promise<MasterProposal> {
        const prompt = `Based on the complete dashboard data, generate a comprehensive master artist proposal. This document should be suitable to send to a potential manager, label, or investor. It needs a compelling executive summary and detailed sections covering audience, market position, content strategy, financial plan, and brand identity. Data: ${JSON.stringify(dashboardData)}`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                executive_summary: { type: Type.STRING },
                sections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}}}},
            }
        };
        return this.generate<MasterProposal>('masterProposal', prompt, schema);
    }
    
    async startChat(systemInstruction: string) {
        try {
            const ai = this.getAI();
            // Initialize chat only if it hasn't been initialized yet.
            if (!this.chat) {
                this.chat = ai.chats.create({
                  model: 'gemini-2.5-flash',
                  config: {
                    systemInstruction: systemInstruction,
                  },
                });
            }
        } catch (error: any) {
             console.error("Failed to initialize chat:", error);
             this.dispatch({ type: 'SET_ERROR', payload: { key: 'chat', value: 'Failed to initialize chat.' } });
        }
    }

    async sendMessage(message: string) {
        if (!this.chat) {
            this.dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Chat not initialized.", type: 'error' } });
            return;
        }

        this.dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'user', content: message } });
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'chat', value: true } });

        try {
            this.dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: "" } });
            const responseStream = await this.chat.sendMessageStream({ message });
            for await (const chunk of responseStream) {
                this.dispatch({ type: 'UPDATE_LAST_CHAT_MESSAGE', payload: chunk.text });
            }
        } catch (error: any) {
            console.error("Error sending chat message:", error);
            this.dispatch({ type: 'SET_ERROR', payload: { key: 'chat', value: error.message || 'An unknown error occurred.' } });
            this.dispatch({ type: 'UPDATE_LAST_CHAT_MESSAGE', payload: "**Error:** Could not get a response." });
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: { key: 'chat', value: false } });
        }
    }
    
     async analyzeReputation(artistName: string): Promise<ReputationData> {
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'reputationData', value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key: 'reputationData', value: null } });
        try {
            const ai = this.getAI();
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the public reputation of the artist "${artistName}". Summarize the general sentiment, identify key discussion themes, and provide links to recent, relevant articles or social media posts.`,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const summary = response.text;
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const mentions = groundingChunks.map((chunk: any) => ({
                uri: chunk.web?.uri || '#',
                title: chunk.web?.title || 'Untitled Source',
            }));

            // Follow-up call to extract themes
            const themeResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on this summary of ${artistName}'s reputation, what are the top 3-5 recurring themes? Summary: "${summary}"`,
                 config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            themes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                    },
                }
            });

            const { themes } = JSON.parse(themeResponse.text);

            const data: ReputationData = { summary, themes, mentions };
            this.dispatch({ type: 'SET_DATA', payload: { key: 'reputationData', value: data } });
            return data;
        } catch (error: any) {
            console.error('Error generating reputation data:', error);
            this.dispatch({ type: 'SET_ERROR', payload: { key: 'reputationData', value: error.message || 'An unknown error occurred.' } });
            throw error;
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: { key: 'reputationData', value: false } });
        }
    }

    async generateReleasePlan(artistName: string, releaseTitle: string, releaseDate: string): Promise<ReleasePlan> {
        const prompt = `Create a comprehensive release plan checklist for ${artistName}'s upcoming release "${releaseTitle}" scheduled for ${releaseDate}. The plan should be broken down into timeframes (e.g., "3 Months Out", "1 Month Out", "Release Week", "Post-Release"). Each timeframe should have categorized task groups (e.g., "Production", "Marketing", "Distribution") with specific, actionable checklist items.`;
        const taskSchema = { type: Type.OBJECT, properties: { text: { type: Type.STRING }, completed: { type: Type.BOOLEAN } } };
        const groupSchema = { type: Type.OBJECT, properties: { category: { type: Type.STRING }, items: { type: Type.ARRAY, items: taskSchema } } };
        const timeframeSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING }, groups: { type: Type.ARRAY, items: groupSchema } } };
        const schema = {
            type: Type.OBJECT,
            properties: {
                artistName: { type: Type.STRING },
                releaseTitle: { type: Type.STRING },
                releaseDate: { type: Type.STRING },
                timeframes: { type: Type.ARRAY, items: timeframeSchema }
            }
        };
        return this.generate<ReleasePlan>('releasePlan', prompt, schema);
    }
    
    async analyzeFanMail(messages: string[]): Promise<FanMailAnalysis> {
        const prompt = `Analyze this batch of fan mail/DMs. Provide a sentiment analysis (percentage positive, neutral, negative), identify key themes and topics fans are talking about, suggest 3 categories of templated replies (e.g., "Appreciation", "Answering Question"), and generate 3 content ideas based on what fans are saying. Messages: ${JSON.stringify(messages)}`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                sentiment: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
                keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedReplies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, text: { type: Type.STRING } } } },
                contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        };
        return this.generate<FanMailAnalysis>('fanMailAnalysis', prompt, schema);
    }

    async generateTourPlan(artistName: string, tourScale: string, targetRegion: string, audience: Audience): Promise<TourPlan> {
        const prompt = `Create a tour plan for ${artistName}. The tour is at a "${tourScale}" scale, targeting the "${targetRegion}" region. The target audience is ${JSON.stringify(audience.demographics)}. Suggest 5-7 suitable venues with location and reasoning. Create a sample 10-song setlist. Brainstorm 3-5 merchandise ideas that would appeal to the audience.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                venues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, location: { type: Type.STRING }, capacity: { type: Type.STRING }, contact: { type: Type.STRING }, reasoning: { type: Type.STRING } } } },
                setlist: { type: Type.OBJECT, properties: { songs: { type: Type.ARRAY, items: { type: Type.STRING } }, notes: { type: Type.STRING } } },
                merchandise: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, description: { type: Type.STRING } } } },
            }
        };
        return this.generate<TourPlan>('tourPlan', prompt, schema);
    }

    async generateImage(prompt: string, aspectRatio: string): Promise<AIGeneratedImage> {
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'aiGeneratedImage', value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key: 'aiGeneratedImage', value: null } });
        try {
            const ai = this.getAI();
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio as any,
                },
            });
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            const data: AIGeneratedImage = { prompt, aspectRatio, url: imageUrl };
            this.dispatch({ type: 'SET_DATA', payload: { key: 'aiGeneratedImage', value: data } });
            return data;
        } catch (error: any) {
            console.error('Error generating image:', error);
            this.dispatch({ type: 'SET_ERROR', payload: { key: 'aiGeneratedImage', value: error.message || 'An unknown error occurred.' } });
            throw error;
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: { key: 'aiGeneratedImage', value: false } });
        }
    }
    
    async generateLyricIdeas(theme: string, mood: string): Promise<LyricIdeaSet> {
        const prompt = `Generate lyric ideas for a song with the theme "${theme}" and mood "${mood}". Provide 5 potential song titles, 3 song concepts with brief descriptions, and a suggested lyrical progression (e.g., Verse 1 -> Chorus -> Verse 2 -> Bridge -> Chorus).`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                concepts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } },
                progression: { type: Type.STRING },
            }
        };
        return this.generate<LyricIdeaSet>('lyricIdeas', prompt, schema);
    }
    
    async generateSocialPosts(releaseInfo: string, platform: SocialPost['platform']): Promise<SocialPost[]> {
        const prompt = `Create 3 distinct social media posts for the platform "${platform}" to promote a release with these details: "${releaseInfo}". Each post should have unique content and a set of relevant hashtags.`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    platform: { type: Type.STRING },
                    content: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        };
        const posts = await this.generate<SocialPost[]>('socialPosts', prompt, schema);
        // Ensure the platform is correctly set, as the model might hallucinate it.
        return posts.map(p => ({ ...p, platform }));
    }

    async generateMerchConcepts(artistName: string, brandKit: BrandKit): Promise<MerchConcept[]> {
        const prompt = `For an artist named ${artistName} with this brand identity: "${brandKit.brand_statement}", brainstorm 3 creative merchandise concepts. For each concept, provide the item type, a brief description, and a detailed prompt for an AI image generator to create the design.`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING },
                    description: { type: Type.STRING },
                    design_prompt: { type: Type.STRING },
                }
            }
        };
        return this.generate<MerchConcept[]>('merchConcepts', prompt, schema);
    }
    
    async analyzeDealMemo(memoText: string): Promise<DealMemoAnalysis> {
        const prompt = `Analyze the following music industry deal memo. Provide a concise summary of the agreement, explain the key terms in simple language, and identify any potential red flags or points of negotiation for the artist. Memo Text: "${memoText}"`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                key_terms: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { term: { type: Type.STRING }, explanation: { type: Type.STRING } } } },
                red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        };
        return this.generate<DealMemoAnalysis>('dealMemoAnalysis', prompt, schema);
    }

    async generateBrandKit(artistInfo: string): Promise<BrandKit> {
        const prompt = `Generate a complete brand kit for a music artist described as: "${artistInfo}". Include a concise brand statement, two distinct color palettes (e.g., Primary, Secondary) with hex codes, two font pairings (headline and body), and three detailed prompts for an AI image generator to create different logo styles.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                brand_statement: { type: Type.STRING },
                color_palettes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, colors: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
                font_pairings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, body: { type: Type.STRING } } } },
                logo_prompts: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        };
        return this.generate<BrandKit>('brandKit', prompt, schema);
    }
    
    async transcribeAudio(base64Audio: string, mimeType: string, fileName: string): Promise<AudioTranscription> {
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'audioTranscription', value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key: 'audioTranscription', value: null } });

        try {
            const ai = this.getAI();
            const audioPart = {
                inlineData: {
                    mimeType,
                    data: base64Audio.split(',')[1],
                },
            };
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [{text: "Transcribe this audio file."}, audioPart] },
            });
            const data: AudioTranscription = { text: response.text, fileName };
            this.dispatch({ type: 'SET_DATA', payload: { key: 'audioTranscription', value: data } });
            return data;
        } catch (error: any) {
            console.error('Error transcribing audio:', error);
            this.dispatch({ type: 'SET_ERROR', payload: { key: 'audioTranscription', value: error.message || 'An unknown error occurred.' } });
            throw error;
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: { key: 'audioTranscription', value: false } });
        }
    }
    
    async generateArtistBio(artistInfo: string, dashboardData: DashboardData): Promise<ArtistBio> {
        const prompt = `Write three versions of a biography (short, medium, long) for a music artist described as: "${artistInfo}". Use the existing dashboard data for additional context if available. The tone should be professional and engaging. Context: ${JSON.stringify(dashboardData)}`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                short: { type: Type.STRING, description: "1-2 sentences, for social media profiles." },
                medium: { type: Type.STRING, description: "1 paragraph, for press releases or EPKs." },
                long: { type: Type.STRING, description: "3-4 paragraphs, for a website 'About' page." },
            }
        };
        return this.generate<ArtistBio>('artistBio', prompt, schema);
    }
    
    async parseContributionsAndSuggestSplits(songTitle: string, collaboratorNames: string[], contributionText: string): Promise<Omit<RoyaltySplit, 'id' | 'isFinalized'>> {
        const prompt = `You are an expert in music industry royalties. A song has been created with the title "${songTitle}".
    The collaborators are: ${collaboratorNames.join(', ')}.
    Their contributions are described as follows: "${contributionText}".

    Please analyze this information and create a fair and standard royalty split agreement.
    - Parse the contribution text to determine what each collaborator did.
    - Assign a percentage to each collaborator based on their contribution. The total must sum to 100.
    - Ensure every collaborator from the list is included in the final output. If their contribution isn't mentioned, assign them 0% and write "No specific contribution mentioned" in their contribution field.
    - Return a JSON object with the song title and a list of collaborators, each with their name, a description of their parsed contribution, and their suggested percentage.
    `;
        const schema = {
            type: Type.OBJECT,
            properties: {
                songTitle: { type: Type.STRING },
                collaborators: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            contribution: { type: Type.STRING },
                            percentage: { type: Type.NUMBER },
                        },
                        required: ["name", "contribution", "percentage"]
                    }
                }
            },
            required: ["songTitle", "collaborators"]
        };
        // Use a different key for loading/error state so it doesn't conflict with other tools
        return this.generate<Omit<RoyaltySplit, 'id' | 'isFinalized'>>('royaltySplitSuggestion', prompt, schema, false);
    }

    async generateSyncPitch(songDescription: string, showDescription: string): Promise<SyncPitch> {
        const prompt = `I want to pitch a song to a TV show.
        Song Description: "${songDescription}"
        Show Description: "${showDescription}"
        Based on this, suggest 3-5 real music supervisors (with their company) who would be a good fit and explain why. Then, write a concise, professional pitch email to one of them, including a subject line and body.`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                music_supervisors: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            company: { type: Type.STRING },
                            reasoning: { type: Type.STRING }
                        }
                    }
                },
                pitch_email: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING }
                    }
                }
            }
        };
        return this.generate<SyncPitch>('syncPitch', prompt, schema);
    }
    
    async analyzeArtwork(base64ImageA: string, mimeTypeA: string, base64ImageB: string, mimeTypeB: string, brandInfo: { artistName: string; brandStatement?: string; audience?: Audience }): Promise<ArtworkAnalysis> {
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'artworkAnalysis', value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key: 'artworkAnalysis', value: null } });

        try {
            const ai = this.getAI();
            const cleanBase64A = base64ImageA.split(',')[1];
            const cleanBase64B = base64ImageB.split(',')[1];

            const textPart = {
                text: `You are a music marketing and A&R expert specializing in visual branding. Analyze the two provided images (Image A and Image B) as potential cover art for an artist.

                Artist Name: ${brandInfo.artistName}
                ${brandInfo.brandStatement ? `Brand Statement: ${brandInfo.brandStatement}` : ''}
                ${brandInfo.audience ? `Target Audience: ${JSON.stringify(brandInfo.audience.demographics)}` : ''}

                Provide a detailed analysis for each image, considering visual impact, brand alignment, target audience appeal, and performance on streaming platforms (as a thumbnail). Based on your analysis, provide a final recommendation explaining which image is the stronger choice and why. Declare a clear winner ('A' or 'B'). If they are equally strong or weak, you can declare 'None'.`
            };
            const imageAPart = { inlineData: { mimeType: mimeTypeA, data: cleanBase64A } };
            const imageBPart = { inlineData: { mimeType: mimeTypeB, data: cleanBase64B } };

            const schema = {
                type: Type.OBJECT,
                properties: {
                    analysisA: { type: Type.STRING, description: "Detailed analysis of Image A." },
                    analysisB: { type: Type.STRING, description: "Detailed analysis of Image B." },
                    recommendation: { type: Type.STRING, description: "Final recommendation and reasoning." },
                    winner: { type: Type.STRING, description: "The winner: 'A', 'B', or 'None'." },
                },
                required: ["analysisA", "analysisB", "recommendation", "winner"],
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [textPart, imageAPart, imageBPart] },
                config: { responseMimeType: "application/json", responseSchema: schema },
            });
            
            const json = JSON.parse(response.text);
            const data = { ...json, imageA_url: base64ImageA, imageB_url: base64ImageB } as ArtworkAnalysis;
            this.dispatch({ type: 'SET_DATA', payload: { key: 'artworkAnalysis', value: data } });
            return data;

        } catch (error: any) {
            console.error('Error analyzing artwork:', error);
            this.dispatch({ type: 'SET_ERROR', payload: { key: 'artworkAnalysis', value: error.message || 'An unknown error occurred.' } });
            throw error;
        } finally {
            this.dispatch({ type: 'SET_LOADING', payload: { key: 'artworkAnalysis', value: false } });
        }
    }
}


//================================================================
// UI COMPONENTS
//================================================================

const Card: FC<PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
    <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 ${className}`}>
        {children}
    </div>
);

const Section: FC<PropsWithChildren<{ title: string, icon: ReactNode, id: string }>> = ({ title, icon, id, children }) => (
    <div id={id} className="mt-8">
        <h2 className="text-3xl font-bold mb-4 text-green-400 flex items-center gap-3">
            {icon} {title}
        </h2>
        <Card>{children}</Card>
    </div>
);


const LoadingSpinner: FC<{ size?: number }> = ({ size = 24 }) => (
    <svg className="animate-spin text-green-400" style={{ width: size, height: size }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ErrorMessage: FC<{ error: string | null | undefined }> = ({ error }) => {
    if (!error) return null;
    return <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg mt-4">{error}</div>;
};

const FormInput: FC<{ label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string, required?: boolean, name?: string }> =
    ({ label, value, onChange, placeholder, type = 'text', required = false, name }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            name={name}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        />
    </div>
);

const FormTextArea: FC<{ label: string, value: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string, rows?: number, required?: boolean, name?: string }> =
    ({ label, value, onChange, placeholder, rows = 4, required = false, name }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            name={name}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        />
    </div>
);

const ActionButton: FC<PropsWithChildren<{ onClick: (e?: any) => void, loading?: boolean, disabled?: boolean, className?: string }>> =
    ({ onClick, loading, children, disabled = false, className = '' }) => (
    <button
        onClick={onClick}
        disabled={loading || disabled}
        className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition ${className}`}
    >
        {loading ? <><LoadingSpinner size={20} /> Generating...</> : children}
    </button>
);

const MarkdownRenderer: FC<{ content: string, className?: string }> = ({ content, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const rawHtml = useMemo(() => marked.parse(content || ""), [content]);

  return (
    <div className={`relative prose prose-invert prose-sm sm:prose-base max-w-none prose-h1:text-green-400 prose-h2:text-green-500 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 ${className}`}>
        <button onClick={handleCopy} className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white transition rounded-lg bg-gray-700/50 hover:bg-gray-600/50">
            {copied ? <CheckCircleIcon /> : <ClipboardIcon />}
        </button>
        <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </div>
  );
};

// ... other components

const AudienceDisplay: FC<{ data: Audience }> = ({ data }) => (
  <div id="audience-display">
    <h3 className="text-2xl font-bold text-green-500 mb-4">{data.artistName}</h3>
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <h4 className="font-bold text-lg mb-2">Demographics</h4>
        <p><strong>Age:</strong> {data.demographics.ageRange}</p>
        <p><strong>Gender:</strong> {data.demographics.gender}</p>
        <p><strong>Top Countries:</strong> {data.demographics.topCountries.join(', ')}</p>
        <p><strong>Language:</strong> {data.demographics.primaryLanguage}</p>
      </Card>
      <Card>
        <h4 className="font-bold text-lg mb-2">Psychographics</h4>
        <p><strong>Interests:</strong> {data.psychographics.interests.join(', ')}</p>
        <p><strong>Values:</strong> {data.psychographics.values.join(', ')}</p>
      </Card>
      <Card className="md:col-span-2">
        <h4 className="font-bold text-lg mb-2">Online Behavior</h4>
        <p><strong>Social Media:</strong> {data.onlineBehavior.socialMediaUsage.join(', ')}</p>
        <p><strong>Preferred Content:</strong> {data.onlineBehavior.preferredContent.join(', ')}</p>
        <p><strong>Shopping:</strong> {data.onlineBehavior.onlineShopping}</p>
      </Card>
    </div>
  </div>
);

const InsightsDisplay: FC<{ data: Insight[] }> = ({ data }) => (
    <div id="insights-display" className="space-y-4">
        {data.map((insight, index) => (
            <Card key={index}>
                <h4 className="font-bold text-lg text-green-500">{insight.title}</h4>
                <p className="mt-1 text-gray-300">{insight.description}</p>
                <p className="mt-3 font-semibold text-gray-200">Actionable Advice:</p>
                <p className="text-gray-300">{insight.actionable_advice}</p>
            </Card>
        ))}
    </div>
);

const MarketAnalysisDisplay: FC<{ data: MarketAnalysis }> = ({ data }) => (
  <div id="market-analysis-display">
      <div className="grid md:grid-cols-2 gap-6">
          <Card>
              <h4 className="font-bold text-lg mb-2">SWOT Analysis</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong className="text-green-400">Strengths:</strong><ul className="list-disc pl-5"> {data.swot.strengths.map(s => <li key={s}>{s}</li>)}</ul></div>
                  <div><strong className="text-red-400">Weaknesses:</strong><ul className="list-disc pl-5"> {data.swot.weaknesses.map(w => <li key={w}>{w}</li>)}</ul></div>
                  <div><strong className="text-blue-400">Opportunities:</strong><ul className="list-disc pl-5"> {data.swot.opportunities.map(o => <li key={o}>{o}</li>)}</ul></div>
                  <div><strong className="text-yellow-400">Threats:</strong><ul className="list-disc pl-5"> {data.swot.threats.map(t => <li key={t}>{t}</li>)}</ul></div>
              </div>
          </Card>
           <Card>
              <h4 className="font-bold text-lg mb-2">Target Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {data.target_platforms.map(p => <span key={p} className="bg-gray-700 text-green-300 px-3 py-1 rounded-full text-sm">{p}</span>)}
              </div>
          </Card>
      </div>
       <Card className="mt-6">
          <h4 className="font-bold text-lg mb-2">Competitor Landscape</h4>
          <div className="space-y-4">
              {data.competitors.map(c => (
                  <div key={c.name} className="p-3 bg-gray-900/50 rounded-lg">
                      <h5 className="font-bold">{c.name}</h5>
                      <p><strong>Strengths:</strong> {c.strengths}</p>
                      <p><strong>Weaknesses:</strong> {c.weaknesses}</p>
                  </div>
              ))}
          </div>
      </Card>
  </div>
);

const ContentPlanDisplay: FC<{ data: ContentPlan }> = ({ data }) => (
    <div id="content-plan-display" className="space-y-6">
        <Card>
            <h4 className="font-bold text-lg mb-2">Content Pillars</h4>
            <div className="flex flex-wrap gap-3">
                {data.content_pillars.map(pillar => <span key={pillar} className="bg-gray-700 text-green-300 px-4 py-2 rounded-full">{pillar}</span>)}
            </div>
        </Card>
        <Card>
            <h4 className="font-bold text-lg mb-2">Content Ideas</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-600">
                        <tr><th className="p-2">Platform</th><th className="p-2">Idea</th><th className="p-2">Format</th><th className="p-2">Potential Impact</th></tr>
                    </thead>
                    <tbody>
                        {data.content_ideas.map((idea, i) => (
                            <tr key={i} className="border-b border-gray-700"><td className="p-2">{idea.platform}</td><td className="p-2">{idea.idea}</td><td className="p-2">{idea.format}</td><td className="p-2">{idea.potential_impact}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

const PressReleaseDisplay: FC<{ data: PressRelease }> = ({ data }) => (
    <div id="press-release-display">
        <MarkdownRenderer content={`# ${data.headline}\n\n## ${data.subheadline}\n\n${data.body}\n\n### Boilerplate\n${data.boilerplate}\n\n**Contact:**\n${data.contact_info}`} />
    </div>
);

const FinancialPlanDisplay: FC<{ data: FinancialPlan }> = ({ data }) => {
    const budgetData = data.budget_allocation.map(item => ({ name: item.category, value: item.percentage }));
    const COLORS = ['#22c55e', '#84cc16', '#eab308', '#3b82f6', '#8b5cf6'];

    return (
        <div id="financial-plan-display" className="grid md:grid-cols-2 gap-6">
            <Card>
                <h4 className="font-bold text-lg mb-2">Budget Allocation</h4>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={p => `${p.name} (${p.value}%)`}>
                                {budgetData.map((entry, index) => <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card>
                <h4 className="font-bold text-lg mb-2">Revenue Streams</h4>
                <ul className="space-y-2">
                    {data.revenue_streams.map(stream => <li key={stream.stream}><strong>{stream.stream}:</strong> {stream.short_term_potential} (Short Term) / {stream.long_term_potential} (Long Term)</li>)}
                </ul>
            </Card>
            <Card className="md:col-span-2">
                <h4 className="font-bold text-lg mb-2">Financial Goals</h4>
                <ul className="list-disc pl-5">
                    {data.financial_goals.map(goal => <li key={goal}>{goal}</li>)}
                </ul>
            </Card>
        </div>
    );
};

const MasterProposalDisplay: FC<{ data: MasterProposal }> = ({ data }) => (
    <div id="master-proposal-display">
        <MarkdownRenderer content={`# ${data.title}\n\n## Executive Summary\n${data.executive_summary}\n\n${data.sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n')}`} />
    </div>
);

const ReputationDisplay: FC<{ data: ReputationData }> = ({ data }) => (
    <div id="reputation-display" className="space-y-6">
        <Card>
            <h4 className="font-bold text-lg mb-2">Reputation Summary</h4>
            <p>{data.summary}</p>
        </Card>
        <Card>
            <h4 className="font-bold text-lg mb-2">Key Themes</h4>
            <div className="flex flex-wrap gap-2">
                {data.themes.map(theme => <span key={theme} className="bg-gray-700 text-green-300 px-3 py-1 rounded-full text-sm">{theme}</span>)}
            </div>
        </Card>
        <Card>
            <h4 className="font-bold text-lg mb-2">Recent Mentions</h4>
            <ul className="space-y-2">
                {data.mentions.map(mention => (
                    <li key={mention.uri}><a href={mention.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{mention.title}</a></li>
                ))}
            </ul>
        </Card>
    </div>
);

const ReleasePlanDisplay: FC<{ data: ReleasePlan }> = ({ data }) => {
    const { dispatch } = useAppContext();

    const handleToggleTask = (timeframeIndex: number, groupIndex: number, taskIndex: number, completed: boolean) => {
        dispatch({
            type: 'UPDATE_RELEASE_TASK',
            payload: { timeframeIndex, groupIndex, taskIndex, completed }
        });
    };

    return (
        <div id="release-plan-display" className="space-y-6">
            <h3 className="text-xl font-bold text-center">{data.artistName} - {data.releaseTitle} ({new Date(data.releaseDate).toLocaleDateString()})</h3>
            <div className="space-y-8">
                {data.timeframes.map((timeframe, tIndex) => (
                    <div key={tIndex}>
                        <h4 className="text-lg font-bold text-green-400 border-b-2 border-green-500 pb-2 mb-4">{timeframe.title}</h4>
                        <div className="space-y-4">
                            {timeframe.groups.map((group, gIndex) => (
                                <Card key={gIndex}>
                                    <h5 className="font-semibold text-gray-200">{group.category}</h5>
                                    <ul className="mt-2 space-y-2">
                                        {group.items.map((item, iIndex) => (
                                            <li key={iIndex} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={item.completed}
                                                    onChange={(e) => handleToggleTask(tIndex, gIndex, iIndex, e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-500 text-green-600 focus:ring-green-500 bg-gray-700"
                                                />
                                                <label className={`ml-3 ${item.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>{item.text}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FanMailDisplay: FC<{ data: FanMailAnalysis }> = ({ data }) => {
    const COLORS = ['#22c55e', '#facc15', '#ef4444']; // Green, Yellow, Red
    const sentimentData = data.sentiment;
    return (
        <div id="fan-mail-display" className="grid lg:grid-cols-2 gap-6">
            <Card>
                <h4 className="font-bold text-lg mb-2">Sentiment Analysis</h4>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                {sentimentData.map((entry, index) => <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card>
                <h4 className="font-bold text-lg mb-2">Key Themes</h4>
                <div className="flex flex-wrap gap-2">
                    {data.keyThemes.map(theme => <span key={theme} className="bg-gray-700 text-green-300 px-3 py-1 rounded-full text-sm">{theme}</span>)}
                </div>
            </Card>
            <Card className="lg:col-span-2">
                <h4 className="font-bold text-lg mb-2">Suggested Replies</h4>
                <div className="space-y-4">
                    {data.suggestedReplies.map(reply => (
                        <div key={reply.category} className="p-3 bg-gray-900/50 rounded-lg">
                            <h5 className="font-semibold">{reply.category}</h5>
                            <p className="text-sm text-gray-400 mt-1">{reply.text}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

const TourPlanDisplay: FC<{ data: TourPlan }> = ({ data }) => (
    <div id="tour-plan-display" className="space-y-6">
        <Card>
            <h4 className="font-bold text-lg mb-2">Suggested Venues</h4>
            <div className="space-y-3">
                {data.venues.map(venue => (
                    <div key={venue.name} className="p-3 bg-gray-900/50 rounded-lg">
                        <h5 className="font-semibold">{venue.name} - {venue.location}</h5>
                        <p className="text-sm text-gray-400">{venue.reasoning}</p>
                    </div>
                ))}
            </div>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <h4 className="font-bold text-lg mb-2">Sample Setlist</h4>
                <ol className="list-decimal list-inside text-gray-300">
                    {data.setlist.songs.map(song => <li key={song}>{song}</li>)}
                </ol>
                <p className="text-sm text-gray-400 mt-2">Notes: {data.setlist.notes}</p>
            </Card>
            <Card>
                <h4 className="font-bold text-lg mb-2">Merchandise Ideas</h4>
                <ul className="list-disc list-inside text-gray-300">
                    {data.merchandise.map(merch => <li key={merch.item}><strong>{merch.item}:</strong> {merch.description}</li>)}
                </ul>
            </Card>
        </div>
    </div>
);

const AIGeneratedImageDisplay: FC<{ data: AIGeneratedImage }> = ({ data }) => (
    <div id="ai-image-display">
        <img src={data.url} alt={data.prompt} className="rounded-lg w-full" />
        <p className="text-sm text-gray-400 mt-2"><strong>Prompt:</strong> {data.prompt}</p>
        <p className="text-sm text-gray-400"><strong>Aspect Ratio:</strong> {data.aspectRatio}</p>
    </div>
);

const LyricIdeasDisplay: FC<{ data: LyricIdeaSet }> = ({ data }) => (
    <div id="lyric-ideas-display" className="space-y-4">
        <Card>
            <h4 className="font-bold text-lg mb-2">Potential Titles</h4>
            <p className="text-gray-300">{data.titles.join(', ')}</p>
        </Card>
        <Card>
            <h4 className="font-bold text-lg mb-2">Song Concepts</h4>
            {data.concepts.map(c => (
                <div key={c.title} className="mt-2">
                    <h5 className="font-semibold">{c.title}</h5>
                    <p className="text-sm text-gray-400">{c.description}</p>
                </div>
            ))}
        </Card>
        <Card>
            <h4 className="font-bold text-lg mb-2">Lyrical Progression</h4>
            <p className="text-gray-300">{data.progression}</p>
        </Card>
    </div>
);

const SocialPostsDisplay: FC<{ data: SocialPost[], platform: SocialPost['platform'] }> = ({ data, platform }) => (
    <div id="social-posts-display" className="space-y-4">
        <h3 className="text-xl font-bold text-center">Generated Posts for {platform}</h3>
        {data.map((post, index) => (
            <Card key={index}>
                <MarkdownRenderer content={post.content} />
                <p className="text-sm text-indigo-300 mt-2">{post.hashtags.join(' ')}</p>
            </Card>
        ))}
    </div>
);

const MerchConceptsDisplay: FC<{ data: MerchConcept[] }> = ({ data }) => (
    <div id="merch-concepts-display" className="space-y-4">
        {data.map(concept => (
            <Card key={concept.item}>
                <h4 className="font-bold text-lg">{concept.item}</h4>
                <p className="text-gray-400">{concept.description}</p>
                <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-sm font-semibold text-green-400">Image Prompt:</p>
                    <p className="text-sm text-gray-300 font-mono">{concept.design_prompt}</p>
                </div>
            </Card>
        ))}
    </div>
);

const DealMemoDisplay: FC<{ data: DealMemoAnalysis }> = ({ data }) => (
    <div id="deal-memo-display" className="space-y-6">
        <Card>
            <h4 className="font-bold text-lg mb-2">Summary</h4>
            <p className="text-gray-300">{data.summary}</p>
        </Card>
        {data.red_flags.length > 0 && (
            <Card className="border-yellow-500">
                <h4 className="font-bold text-lg mb-2 text-yellow-400">Potential Red Flags</h4>
                <ul className="list-disc pl-5 text-yellow-300">
                    {data.red_flags.map(flag => <li key={flag}>{flag}</li>)}
                </ul>
            </Card>
        )}
        <Card>
            <h4 className="font-bold text-lg mb-2">Key Terms Explained</h4>
            <div className="space-y-3">
                {data.key_terms.map(term => (
                    <div key={term.term}>
                        <h5 className="font-semibold">{term.term}</h5>
                        <p className="text-sm text-gray-400">{term.explanation}</p>
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

const BrandKitDisplay: FC<{ data: BrandKit }> = ({ data }) => (
    <div id="brand-kit-display" className="space-y-6">
        <Card>
            <h4 className="font-bold text-lg mb-2">Brand Statement</h4>
            <p className="text-gray-300 italic">"{data.brand_statement}"</p>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <h4 className="font-bold text-lg mb-2">Color Palettes</h4>
                {data.color_palettes.map(palette => (
                    <div key={palette.name} className="mb-3">
                        <h5 className="font-semibold">{palette.name}</h5>
                        <div className="flex gap-2 mt-1">
                            {palette.colors.map(color => (
                                <div key={color} className="text-center">
                                    <div className="w-12 h-12 rounded" style={{ backgroundColor: color }}></div>
                                    <p className="text-xs mt-1">{color}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Card>
            <Card>
                <h4 className="font-bold text-lg mb-2">Font Pairings</h4>
                {data.font_pairings.map((font, i) => (
                    <div key={i} className="mb-3">
                        <p><span className="font-semibold">Headline:</span> {font.headline}</p>
                        <p><span className="font-semibold">Body:</span> {font.body}</p>
                    </div>
                ))}
            </Card>
        </div>
        <Card>
            <h4 className="font-bold text-lg mb-2">Logo Prompts</h4>
            <div className="space-y-3">
                {data.logo_prompts.map((prompt, i) => (
                    <div key={i} className="p-3 bg-gray-900/50 rounded-lg">
                        <p className="text-sm font-mono">{prompt}</p>
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

const AudioTranscriptionDisplay: FC<{ data: AudioTranscription }> = ({ data }) => (
    <div id="audio-transcription-display">
        <h4 className="font-bold text-lg mb-2">Transcription for: <span className="text-green-400">{data.fileName}</span></h4>
        <Card>
            <p className="whitespace-pre-wrap text-gray-300">{data.text}</p>
        </Card>
    </div>
);

const ArtistBioDisplay: FC<{ data: ArtistBio }> = ({ data }) => (
    <div id="artist-bio-display" className="space-y-6">
        <div>
            <h4 className="font-bold text-lg mb-2 text-green-400">Long Bio</h4>
            <MarkdownRenderer content={data.long} />
        </div>
        <div>
            <h4 className="font-bold text-lg mb-2 text-green-400">Medium Bio</h4>
            <MarkdownRenderer content={data.medium} />
        </div>
        <div>
            <h4 className="font-bold text-lg mb-2 text-green-400">Short Bio</h4>
            <MarkdownRenderer content={data.short} />
        </div>
    </div>
);

const SyncPitchDisplay: FC<{ data: SyncPitch, onAddContact: (contact: Omit<Contact, 'id'>) => void }> = ({ data, onAddContact }) => (
    <div id="sync-pitch-display" className="grid lg:grid-cols-2 gap-6">
        <Card>
            <h4 className="font-bold text-lg mb-2">Suggested Music Supervisors</h4>
            <div className="space-y-4">
                {data.music_supervisors.map(supervisor => (
                    <div key={supervisor.name} className="p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex justify-between items-start">
                             <div>
                                <h5 className="font-semibold">{supervisor.name} <span className="text-sm text-gray-400">- {supervisor.company}</span></h5>
                                <p className="text-sm text-gray-300 mt-1">{supervisor.reasoning}</p>
                            </div>
                            <button
                                onClick={() => onAddContact({ name: supervisor.name, role: 'Music Supervisor', company: supervisor.company })}
                                className="ml-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-2 rounded shrink-0"
                                title={`Add ${supervisor.name} to contacts`}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
        <Card>
            <h4 className="font-bold text-lg mb-2">Pitch Email</h4>
            <div className="p-3 bg-gray-900/50 rounded-lg">
                <p><strong>Subject:</strong> {data.pitch_email.subject}</p>
                <hr className="border-gray-600 my-2" />
                <p className="whitespace-pre-wrap">{data.pitch_email.body}</p>
            </div>
        </Card>
    </div>
);

const ContactsDisplay: FC<{ contacts: Contact[], onAddContact: (contact: Omit<Contact, 'id'>) => void }> = ({ contacts, onAddContact }) => {
    const [showForm, setShowForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', role: '', company: '', email: '', notes: '' });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewContact(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newContact.name && newContact.role) {
            onAddContact(newContact);
            setNewContact({ name: '', role: '', company: '', email: '', notes: '' });
            setShowForm(false);
        }
    };
    
    return (
        <Card>
            {contacts.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-600">
                            <tr>
                                <th className="p-2">Name</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Company</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(contact => (
                                <tr key={contact.id} className="border-b border-gray-700">
                                    <td className="p-2 font-semibold">{contact.name}</td>
                                    <td className="p-2">{contact.role}</td>
                                    <td className="p-2">{contact.company}</td>
                                    <td className="p-2 text-indigo-400">{contact.email}</td>
                                    <td className="p-2 text-gray-400">{contact.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm ? (
                <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-900/50 rounded-lg">
                    <h4 className="font-bold text-lg mb-2">Add New Contact</h4>
                     <div className="grid md:grid-cols-2 gap-4">
                        <FormInput label="Name" name="name" value={newContact.name} onChange={handleInputChange} placeholder="John Smith" required />
                        <FormInput label="Role" name="role" value={newContact.role} onChange={handleInputChange} placeholder="Promoter" required/>
                        <FormInput label="Company" name="company" value={newContact.company} onChange={handleInputChange} placeholder="Live Shows Inc." />
                        <FormInput label="Email" name="email" type="email" value={newContact.email} onChange={handleInputChange} placeholder="john@liveshows.com" />
                    </div>
                    <FormTextArea label="Notes" name="notes" value={newContact.notes} onChange={handleInputChange as any} placeholder="Met at conference..." />
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">Cancel</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">Save Contact</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setShowForm(true)} className="mt-4 w-full flex items-center justify-center gap-2 text-green-400 border-2 border-dashed border-gray-600 hover:border-green-500 hover:bg-green-900/20 p-4 rounded-lg transition">
                    <PlusCircleIcon /> Add Contact
                </button>
            )}
        </Card>
    );
};


const ArtworkAnalysisDisplay: FC<{ data: ArtworkAnalysis }> = ({ data }) => {
    const WinnerTag: FC<{ text: string }> = ({ text }) => (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">WINNER</span>
    );

    return (
        <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
                <h4 className="text-xl font-bold text-center text-gray-200">Image A</h4>
                <div className="relative">
                    <img src={data.imageA_url} alt="Artwork A" className="rounded-lg w-full" />
                    {data.winner === 'A' && <WinnerTag text="Winner" />}
                </div>
                <MarkdownRenderer content={data.analysisA} className="prose-sm" />
            </div>
            <div className="space-y-4">
                <h4 className="text-xl font-bold text-center text-gray-200">Image B</h4>
                <div className="relative">
                    <img src={data.imageB_url} alt="Artwork B" className="rounded-lg w-full" />
                    {data.winner === 'B' && <WinnerTag text="Winner" />}
                </div>
                <MarkdownRenderer content={data.analysisB} className="prose-sm" />
            </div>
            <div className="lg:col-span-2 mt-4">
                <Card className="bg-green-900/30 border-green-700">
                    <h4 className="text-xl font-bold text-green-400 mb-2">Recommendation</h4>
                    <MarkdownRenderer content={data.recommendation} />
                </Card>
            </div>
        </div>
    );
};


//================================================================
// TOOL COMPONENTS
//================================================================
const ToolCard: FC<PropsWithChildren<{ icon: ReactNode; title: string; description: string; unlocked: boolean; unlocksWith?: (keyof DashboardData)[] }>> =
    ({ icon, title, description, unlocked, unlocksWith = [], children }) => {
        const { state } = useAppContext();
        const missingDeps = unlocksWith.filter(dep => !state.dashboardData[dep]);

        return (
            <Card className="flex flex-col h-full">
                <div className="flex items-center gap-4">
                    <div className="text-green-400">{icon}</div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <p className="text-gray-400 text-sm mt-2 mb-4 flex-grow">{description}</p>
                {unlocked ? (
                    <div>{children}</div>
                ) : (
                    <div className="mt-auto pt-4 border-t border-gray-700 text-center">
                         <div className="flex items-center justify-center text-yellow-400 text-sm">
                            <LockClosedIcon />
                            <span className="ml-2">Requires: {missingDeps.join(', ')}</span>
                        </div>
                    </div>
                )}
            </Card>
        );
    };

const AudienceAnalysisTool: FC<{ onGenerate: (p: string) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [artistInfo, setArtistInfo] = useState('');
    return (
        <div>
            <FormTextArea label="Describe your music/band" value={artistInfo} onChange={(e) => setArtistInfo(e.target.value)} placeholder="e.g., A psychedelic rock band with influences from Tame Impala and Pink Floyd, focusing on introspective lyrics and lush soundscapes." />
            <ActionButton onClick={() => onGenerate(artistInfo)} loading={loading} disabled={!artistInfo}>
                <UserGroupIcon /> Analyze Audience
            </ActionButton>
        </div>
    );
};

const ArtistBioTool: FC<{ onGenerate: (p: string) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [artistInfo, setArtistInfo] = useState('');
    return (
        <div>
            <FormTextArea label="Provide key details for your bio" value={artistInfo} onChange={(e) => setArtistInfo(e.target.value)} placeholder="e.g., Band name, genre, key influences, members, origin story, recent achievements..." />
            <ActionButton onClick={() => onGenerate(artistInfo)} loading={loading} disabled={!artistInfo}>
                <IdentificationIcon /> Generate Bio
            </ActionButton>
        </div>
    );
};

const BrandKitTool: FC<{ onGenerate: (p: string) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [artistInfo, setArtistInfo] = useState('');
    return (
        <div>
            <FormTextArea label="Describe your brand's vibe" value={artistInfo} onChange={(e) => setArtistInfo(e.target.value)} placeholder="e.g., moody and atmospheric, high-energy and rebellious, vintage and nostalgic..." />
            <ActionButton onClick={() => onGenerate(artistInfo)} loading={loading} disabled={!artistInfo}>
                <SparklesIcon /> Create Brand Kit
            </ActionButton>
        </div>
    );
};

const LyricWriterTool: FC<{ onGenerate: (p: { theme: string; mood: string }) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [theme, setTheme] = useState('');
    const [mood, setMood] = useState('');
    return (
        <div>
            <FormInput label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g., Lost love, finding yourself, social justice" />
            <FormInput label="Mood" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="e.g., Melancholic, hopeful, angry" />
            <ActionButton onClick={() => onGenerate({ theme, mood })} loading={loading} disabled={!theme || !mood}>
                <PencilSquareIcon /> Generate Lyric Ideas
            </ActionButton>
        </div>
    );
};

const SocialPostTool: FC<{ onGenerate: (p: { releaseInfo: string; platform: SocialPost['platform'] }) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [releaseInfo, setReleaseInfo] = useState('');
    const [platform, setPlatform] = useState<SocialPost['platform']>('Instagram');
    return (
        <div>
            <FormTextArea label="What are you promoting?" value={releaseInfo} onChange={(e) => setReleaseInfo(e.target.value)} placeholder="e.g., New single 'Cosmic Drift' out on Friday!" />
            <div className="my-2">
                 <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                 <select value={platform} onChange={e => setPlatform(e.target.value as any)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
                    <option>Instagram</option>
                    <option>Twitter</option>
                    <option>TikTok</option>
                </select>
            </div>
            <ActionButton onClick={() => onGenerate({ releaseInfo, platform })} loading={loading} disabled={!releaseInfo}>
                <ShareIcon /> Generate Posts
            </ActionButton>
        </div>
    );
};


const PressReleaseTool: FC<{ onGenerate: (releaseInfo: string) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [releaseInfo, setReleaseInfo] = useState('');
    return (
        <div>
            <FormTextArea label="Key release details" value={releaseInfo} onChange={e => setReleaseInfo(e.target.value)} placeholder="e.g., Artist Name, Release Title, Release Date, a few sentences about the song/album." />
            <ActionButton onClick={() => onGenerate(releaseInfo)} loading={loading} disabled={!releaseInfo}>
                <NewspaperIcon /> Write Press Release
            </ActionButton>
        </div>
    );
};

const ReleasePlanTool: FC<{ onGenerate: (p: { artistName: string, releaseTitle: string, releaseDate: string }) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [artistName, setArtistName] = useState('');
    const [releaseTitle, setReleaseTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
    return (
        <div>
            <FormInput label="Artist Name" value={artistName} onChange={e => setArtistName(e.target.value)} placeholder="Your band name"/>
            <FormInput label="Release Title" value={releaseTitle} onChange={e => setReleaseTitle(e.target.value)} placeholder="Name of single/EP/album"/>
            <FormInput label="Release Date" type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
            <ActionButton onClick={() => onGenerate({ artistName, releaseTitle, releaseDate })} loading={loading} disabled={!artistName || !releaseTitle || !releaseDate}>
                <CalendarDaysIcon /> Build Release Plan
            </ActionButton>
        </div>
    );
};

const SyncPitchTool: FC<{ onGenerate: (p: { songDesc: string, showDesc: string }) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [songDesc, setSongDesc] = useState('');
    const [showDesc, setShowDesc] = useState('');
    return (
        <div>
            <FormTextArea label="Describe your song" value={songDesc} onChange={e => setSongDesc(e.target.value)} placeholder="e.g., 'Midnight Run' is an upbeat, 80s synth-pop track with a driving beat and hopeful lyrics about escaping a small town. (120 BPM, Key of C Major)" />
            <FormTextArea label="Describe the show/scene" value={showDesc} onChange={e => setShowDesc(e.target.value)} placeholder="e.g., A coming-of-age drama like 'Sex Education'. Looking for a song for a final scene where the main characters drive off to college." />
            <ActionButton onClick={() => onGenerate({ songDesc, showDesc })} loading={loading} disabled={!songDesc || !showDesc}>
                <FilmIcon /> Create Sync Pitch
            </ActionButton>
        </div>
    );
};

const ArtworkGeneratorTool: FC<{ onGenerate: (p: { prompt: string; aspectRatio: string; }) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    return (
        <div>
            <FormTextArea label="Describe the artwork you want" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., A robot holding a red skateboard, cinematic, dramatic lighting." />
            <div className="my-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                </select>
            </div>
            <ActionButton onClick={() => onGenerate({ prompt, aspectRatio })} loading={loading} disabled={!prompt}>
                <MountainIcon /> Generate Artwork
            </ActionButton>
        </div>
    );
};

const DealMemoAnalyzerTool: FC<{ onAnalyze: (memoText: string) => void, loading?: boolean }> = ({ onAnalyze, loading }) => {
    const [memoText, setMemoText] = useState('');
    return (
        <div>
            <FormTextArea label="Paste the deal memo text here" value={memoText} onChange={e => setMemoText(e.target.value)} placeholder="Copy and paste the full text of the deal memo or contract..." rows={8}/>
            <ActionButton onClick={() => onAnalyze(memoText)} loading={loading} disabled={!memoText}>
                <DocumentDuplicateIcon /> Analyze Memo
            </ActionButton>
        </div>
    );
};

const AudioTranscriberTool: FC<{ onTranscribe: (file: File) => void, loading?: boolean, error?: string | null }> = ({ onTranscribe, loading, error }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onTranscribe(acceptedFiles[0]);
        }
    }, [onTranscribe]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'audio/*': [] },
        multiple: false
    });

    return (
        <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${isDragActive ? 'border-green-500 bg-green-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
            <input {...getInputProps()} />
            {loading ? (
                 <div className="flex flex-col items-center justify-center gap-2"><LoadingSpinner /><span>Transcribing...</span></div>
            ) : isDragActive ? (
                <p>Drop the audio file here...</p>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                    <MicrophoneIcon />
                    <p>Drag 'n' drop an audio file here, or click to select</p>
                    <p className="text-xs text-gray-500">For voice memos, song ideas, interviews...</p>
                </div>
            )}
             <ErrorMessage error={error} />
        </div>
    );
};


const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
};

const ArtworkABTestTool: FC<{
    brandInfo: { artistName: string; brandStatement?: string; audience?: Audience };
    onAnalyze: (payload: { type: 'artworkAnalysis', data: any }) => void;
    loading?: boolean;
}> = ({ brandInfo, onAnalyze, loading }) => {
    const [imageA, setImageA] = useState<{ file: File, url: string } | null>(null);
    const [imageB, setImageB] = useState<{ file: File, url: string } | null>(null);

    const onDropA = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            fileToDataUrl(file).then(url => setImageA({ file, url }));
        }
    }, []);
    const onDropB = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            fileToDataUrl(file).then(url => setImageB({ file, url }));
        }
    }, []);

    const { getRootProps: getRootPropsA, getInputProps: getInputPropsA, isDragActive: isDragActiveA } = useDropzone({ onDrop: onDropA, accept: { 'image/*': [] }, multiple: false });
    const { getRootProps: getRootPropsB, getInputProps: getInputPropsB, isDragActive: isDragActiveB } = useDropzone({ onDrop: onDropB, accept: { 'image/*': [] }, multiple: false });

    const handleAnalyze = () => {
        if (imageA && imageB) {
            onAnalyze({
                type: 'artworkAnalysis',
                data: { imageA: imageA.file, imageB: imageB.file, brandInfo }
            });
        }
    };
    
    const DropzoneUI: FC<{ getRootProps: any, getInputProps: any, isDragActive: boolean, image: {url: string} | null, label: string }> = ({ getRootProps, getInputProps, isDragActive, image, label }) => (
        <div {...getRootProps()} className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer h-48 flex items-center justify-center transition ${isDragActive ? 'border-green-500 bg-green-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
            <input {...getInputProps()} />
            {image ? (
                <img src={image.url} alt={label} className="max-h-full max-w-full rounded" />
            ) : isDragActive ? (
                <p>Drop here...</p>
            ) : (
                <p>{label}</p>
            )}
        </div>
    );

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <DropzoneUI getRootProps={getRootPropsA} getInputProps={getInputPropsA} isDragActive={isDragActiveA} image={imageA} label="Upload Image A" />
                <DropzoneUI getRootProps={getRootPropsB} getInputProps={getInputPropsB} isDragActive={isDragActiveB} image={imageB} label="Upload Image B" />
            </div>
            <ActionButton onClick={handleAnalyze} loading={loading} disabled={!imageA || !imageB}>
                <ChartBarIcon /> Analyze Artwork
            </ActionButton>
        </div>
    );
};

const CreativeToolkit: FC<{ onGenerate: (payload: any) => void; state: AppState }> = ({ onGenerate, state }) => {
    const { dashboardData, loading, errors } = state;
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard icon={<IdentificationIcon />} title="Artist Bio" description="Generate short, medium, and long artist bios for different platforms." unlocked={true}>
                <ArtistBioTool onGenerate={(artistInfo) => onGenerate({ type: 'artistBio', data: artistInfo })} loading={loading.artistBio} />
            </ToolCard>
            <ToolCard icon={<SparklesIcon />} title="Brand Kit" description="Create a full brand identity, including colors, fonts, and logo ideas." unlocked={true}>
                <BrandKitTool onGenerate={(artistInfo) => onGenerate({ type: 'brandKit', data: artistInfo })} loading={loading.brandKit} />
            </ToolCard>
             <ToolCard icon={<PencilSquareIcon />} title="Lyric Writer" description="Get help with song titles, concepts, and structures when you have writer's block." unlocked={true}>
                <LyricWriterTool onGenerate={(data) => onGenerate({ type: 'lyricIdeas', data })} loading={loading.lyricIdeas} />
            </ToolCard>
            <ToolCard icon={<MountainIcon />} title="AI Artwork" description="Generate album art, logos, or social media graphics from a text prompt." unlocked={!!dashboardData.brandKit} unlocksWith={['brandKit']}>
                 <ArtworkGeneratorTool onGenerate={(data) => onGenerate({ type: 'aiGeneratedImage', data })} loading={loading.aiGeneratedImage} />
            </ToolCard>
             <ToolCard icon={<GiftIcon />} title="Merch Concepts" description="Brainstorm creative merchandise ideas that align with your brand." unlocked={!!dashboardData.brandKit} unlocksWith={['brandKit']}>
                <ActionButton onClick={() => onGenerate({ type: 'merchConcepts' })} loading={loading.merchConcepts}>
                    <GiftIcon /> Brainstorm Merch
                </ActionButton>
            </ToolCard>
            <ToolCard icon={<ShareIcon />} title="Social Posts" description="Create engaging social media posts to promote your latest release." unlocked={true}>
                <SocialPostTool onGenerate={(data) => onGenerate({ type: 'socialPosts', data })} loading={loading.socialPosts} />
            </ToolCard>
            <ToolCard icon={<FilmIcon />} title="Sync Pitch" description="Find music supervisors and write a pitch email to get your song placed in TV/film." unlocked={true}>
                <SyncPitchTool onGenerate={({ songDesc, showDesc }) => onGenerate({ type: 'syncPitch', data: { songDescription: songDesc, showDescription: showDesc }})} loading={loading.syncPitch} />
            </ToolCard>
            <ToolCard icon={<NewspaperIcon />} title="Press Release" description="Automatically write a professional press release for your new music." unlocked={!!dashboardData.artistBio} unlocksWith={['artistBio']}>
                <PressReleaseTool onGenerate={(releaseInfo) => onGenerate({ type: 'pressRelease', data: releaseInfo })} loading={loading.pressRelease} />
            </ToolCard>
            <ToolCard icon={<DocumentDuplicateIcon />} title="Deal Memo Analyzer" description="Paste in a contract or deal memo to get a summary and identify red flags." unlocked={true}>
                <DealMemoAnalyzerTool onAnalyze={(memoText) => onGenerate({ type: 'dealMemoAnalysis', data: memoText })} loading={loading.dealMemoAnalysis} />
            </ToolCard>
             <ToolCard icon={<MicrophoneIcon />} title="Audio Transcriber" description="Transcribe voice memos, interviews, or song ideas from an audio file." unlocked={true}>
                <AudioTranscriberTool
                    onTranscribe={async (file) => {
                        const base64 = await fileToBase64(file);
                        onGenerate({ type: 'audioTranscription', data: { base64, mimeType: file.type, fileName: file.name } })
                    }}
                    loading={loading.audioTranscription}
                    error={errors.audioTranscription}
                />
            </ToolCard>
            <ToolCard
                icon={<ChartBarIcon />}
                title="Artwork A/B Test"
                description="Get AI feedback on two artwork options to see which aligns better with your brand."
                unlocked={!!state.dashboardData.brandKit && !!state.dashboardData.audience}
                unlocksWith={['brandKit', 'audience']}
            >
                <ArtworkABTestTool
                    brandInfo={{
                        artistName: state.dashboardData.audience?.artistName || 'your band',
                        brandStatement: state.dashboardData.brandKit?.brand_statement,
                        audience: state.dashboardData.audience
                    }}
                    onAnalyze={onGenerate}
                    loading={state.loading.artworkAnalysis}
                />
            </ToolCard>
        </div>
    );
};


const SummitScore: FC<{ onGenerate: () => void; data?: SummitScoreData; loading?: boolean }> = ({ onGenerate, data, loading }) => (
    <div className="text-center p-6">
        <div className="relative inline-flex items-center justify-center">
            <svg className="w-40 h-40">
                <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                <circle
                    className="text-green-500"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={(2 * Math.PI * 70) * (1 - (data?.score || 0) / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
             <span className="absolute text-4xl font-bold text-white">{data?.score || <button onClick={onGenerate} className="text-sm bg-gray-600 p-2 rounded-full">Analyze</button>}</span>
        </div>
        {data && (
            <div className="mt-4">
                <p className="text-gray-300">{data.explanation}</p>
                <div className="mt-2 text-left">
                    <h4 className="font-bold text-center">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside inline-block text-center">
                        {data.areas_for_improvement.map(area => <li key={area}>{area}</li>)}
                    </ul>
                </div>
            </div>
        )}
         {loading && <div className="mt-2 flex justify-center"><LoadingSpinner/></div>}
    </div>
);

const ChatAssistant: FC<{systemInstruction: string}> = ({systemInstruction}) => {
    const { state, dispatch, geminiService } = useAppContext();
    const { chatHistory, loading, errors } = state;
    const [input, setInput] = useState('');
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        geminiService.startChat(systemInstruction);
    }, [geminiService, systemInstruction]);
    
    useEffect(() => {
        if (hasUserInteracted) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, hasUserInteracted]);

    const handleSend = () => {
        if (input.trim()) {
            if (!hasUserInteracted) {
                setHasUserInteracted(true);
            }
            geminiService.sendMessage(input);
            setInput('');
        }
    };
    
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-gray-800/50 rounded-lg">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-green-700' : 'bg-gray-700'}`}>
                           {msg.content ? <MarkdownRenderer content={msg.content} /> : <LoadingSpinner size={20} />}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                {errors.chat && <ErrorMessage error={errors.chat} />}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a follow-up question..."
                        disabled={loading.chat}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                    />
                    <button onClick={handleSend} disabled={loading.chat || !input} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white p-2 rounded-lg">
                        <PaperAirplaneIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const SmartAgreementManager: FC = () => {
    const { state, dispatch, geminiService } = useAppContext();
    const [step, setStep] = useState(0); // 0: idle, 1: title, 2: collabs, 3: contributions, 4: review/edit
    
    // Wizard state
    const [songTitle, setSongTitle] = useState('');
    const [collaboratorNames, setCollaboratorNames] = useState<string[]>(['']);
    const [contributionText, setContributionText] = useState('');
    const [agreementDraft, setAgreementDraft] = useState<Omit<RoyaltySplit, 'id' | 'isFinalized'> | null>(null);

    const loading = state.loading.royaltySplitSuggestion;

    const resetWizard = () => {
        setStep(0);
        setSongTitle('');
        setCollaboratorNames(['']);
        setContributionText('');
        setAgreementDraft(null);
    };

    const handleCollaboratorNameChange = (index: number, name: string) => {
        const newNames = [...collaboratorNames];
        newNames[index] = name;
        setCollaboratorNames(newNames);
    };

    const addCollaboratorName = () => setCollaboratorNames([...collaboratorNames, '']);
    const removeCollaboratorName = (index: number) => setCollaboratorNames(collaboratorNames.filter((_, i) => i !== index));

    const handleAnalyzeContributions = async () => {
        const filteredNames = collaboratorNames.filter(name => name.trim() !== '');
        if (!songTitle || filteredNames.length === 0 || !contributionText) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Please fill in all fields to get a suggestion.", type: 'error' } });
            return;
        }
        try {
            const result = await geminiService.parseContributionsAndSuggestSplits(songTitle, filteredNames, contributionText);
            setAgreementDraft(result);
            setStep(4);
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "AI has parsed contributions and suggested splits.", type: 'success' } });
        } catch (error) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Could not get AI suggestion.", type: 'error' } });
        }
    };

    const handleFinalize = () => {
        if (agreementDraft) {
            dispatch({ type: 'ADD_ROYALTY_SPLIT', payload: agreementDraft });
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Agreement for "${agreementDraft.songTitle}" logged to the chain!`, type: 'success' } });
            resetWizard();
        }
    };
    
    const handleDraftUpdate = (index: number, field: 'name' | 'contribution' | 'percentage', value: string | number) => {
        if (!agreementDraft) return;
        const newDraft = { ...agreementDraft };
        const newCollaborators = [...newDraft.collaborators];
        if (field === 'percentage') {
            const percentage = Number(value);
            newCollaborators[index].percentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
        } else {
            (newCollaborators[index] as any)[field] = String(value);
        }
        setAgreementDraft({ ...newDraft, collaborators: newCollaborators });
    };

    const totalPercentage = useMemo(() => {
        return agreementDraft?.collaborators.reduce((acc, c) => acc + (c.percentage || 0), 0) || 0;
    }, [agreementDraft]);

    const renderStep = () => {
        switch (step) {
            case 1: // Song Title
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Step 1: What's the song title?</h3>
                        <FormInput label="Song Title" value={songTitle} onChange={e => setSongTitle(e.target.value)} placeholder="e.g., Midnight Mirage" required />
                    </div>
                );
            case 2: // Collaborators
                return (
                     <div>
                        <h3 className="text-xl font-bold mb-4">Step 2: Who collaborated on this?</h3>
                        <div className="space-y-2">
                        {collaboratorNames.map((name, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" value={name} onChange={e => handleCollaboratorNameChange(index, e.target.value)} placeholder={`Collaborator ${index + 1} Name`} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500" />
                                <button onClick={() => removeCollaboratorName(index)} className="text-gray-500 hover:text-red-500 p-2"><XCircleIcon /></button>
                            </div>
                        ))}
                        </div>
                        <button onClick={addCollaboratorName} className="mt-2 text-sm text-green-400 flex items-center gap-2"><PlusCircleIcon /> Add another collaborator</button>
                    </div>
                );
            case 3: // Contributions
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Step 3: Describe what everyone did</h3>
                        <FormTextArea 
                            label="Contributions" 
                            value={contributionText} 
                            onChange={(e) => setContributionText(e.target.value)}
                            placeholder="Describe contributions in plain English. e.g., 'Sarah wrote the chorus lyrics and main guitar riff. Marcus produced the track and programmed the drums. Ben played bass.'"
                            rows={6}
                         />
                        <ActionButton onClick={handleAnalyzeContributions} loading={loading} disabled={!contributionText}>
                            <SparklesIcon /> Analyze & Suggest Splits
                        </ActionButton>
                    </div>
                );
            case 4: // Review & Finalize
                if (!agreementDraft) return <p>Something went wrong, please restart.</p>;
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Step 4: Review and Finalize Agreement</h3>
                        <h4 className="text-lg font-semibold text-green-400">{agreementDraft.songTitle}</h4>
                        <div className="space-y-4 my-4">
                        {agreementDraft.collaborators.map((c, index) => (
                             <div key={index} className="flex flex-col md:flex-row items-start gap-3 bg-gray-900/50 p-3 rounded-lg">
                                <div className="flex-grow w-full md:w-1/3"><FormInput label="Name" value={c.name} onChange={(e) => handleDraftUpdate(index, 'name', e.target.value)} /></div>
                                <div className="flex-grow w-full md:w-2/3"><FormTextArea label="Contribution" value={c.contribution} onChange={(e) => handleDraftUpdate(index, 'contribution', e.target.value)} rows={2}/></div>
                                <div className="w-24 shrink-0"><FormInput label="Split %" type="number" value={String(c.percentage)} onChange={(e) => handleDraftUpdate(index, 'percentage', e.target.value)} /></div>
                            </div>
                        ))}
                        </div>
                         <div className={`mt-2 p-3 rounded-lg flex justify-between items-center transition-colors ${totalPercentage === 100 ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                            <span className="font-bold text-lg">Total: {totalPercentage}%</span>
                            {totalPercentage !== 100 && <span className="text-sm text-yellow-300">Total must be 100% to finalize.</span>}
                            {totalPercentage === 100 && <span className="text-sm text-green-300">Ready to finalize!</span>}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div>
            {state.dashboardData.royaltySplits && state.dashboardData.royaltySplits.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-300">Finalized Agreements</h3>
                     <div className="space-y-3">
                        {state.dashboardData.royaltySplits.map(split => (
                            <div key={split.id} className="p-4 bg-gray-900/50 rounded-lg border border-green-700">
                                <p className="font-bold text-green-400">{split.songTitle}</p>
                                <div className="text-xs text-gray-400 mt-1">
                                    {split.collaborators.map(c => `${c.name} (${c.percentage}%)`).join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 0 ? (
                <button onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-2 text-green-400 border-2 border-dashed border-gray-600 hover:border-green-500 hover:bg-green-900/20 p-4 rounded-lg transition">
                    <PlusCircleIcon /> Create New Smart Agreement
                </button>
            ) : (
                <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    {renderStep()}
                    <ErrorMessage error={state.errors.royaltySplitSuggestion} />
                    <div className="mt-6 flex gap-4 justify-between">
                        <div>
                            {step > 1 && <button onClick={() => step === 4 ? setStep(3) : setStep(step - 1)} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">Back</button>}
                        </div>
                        <div className="flex gap-4">
                             {step < 3 && <button onClick={() => setStep(step + 1)} disabled={step === 1 && !songTitle || step === 2 && collaboratorNames.every(n => n === '')} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 font-bold py-2 px-4 rounded-lg">Next</button>}
                             {step === 4 && <ActionButton onClick={handleFinalize} disabled={totalPercentage !== 100}><LockClosedIcon /> Finalize & Log</ActionButton>}
                             <button onClick={resetWizard} className="font-bold py-2 px-4">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

//================================================================
// MAIN APP COMPONENT
//================================================================
const App = () => {
  const { state, dispatch, geminiService } = useAppContext();
  const { dashboardData, loading, errors, activeGuide } = state;
  const proposalRef = useRef(null);

  const handleGenerate = useCallback(async (payload: { type: keyof DashboardData | 'royaltySplitSuggestion', data?: any }) => {
      try {
        switch (payload.type) {
            case 'audience':
                await geminiService.generateAudienceAnalysis(payload.data);
                break;
            case 'insights':
                if (dashboardData.audience) await geminiService.generateStrategicInsights(dashboardData.audience);
                break;
            case 'marketAnalysis':
                 if (dashboardData.audience) await geminiService.generateMarketAnalysis(dashboardData.audience.artistName);
                 break;
            case 'contentPlan':
                if(dashboardData.audience && dashboardData.marketAnalysis) await geminiService.generateContentPlan(dashboardData.audience.artistName, dashboardData.audience, dashboardData.marketAnalysis);
                break;
            case 'pressRelease':
                if(dashboardData.artistBio) await geminiService.generatePressRelease(payload.data, dashboardData.artistBio);
                break;
            case 'financialPlan':
                 if (dashboardData.audience) await geminiService.generateFinancialPlan(dashboardData.audience.artistName, dashboardData.audience);
                 break;
            case 'summitScore':
                 await geminiService.getSummitScore(dashboardData);
                 break;
             case 'masterProposal':
                 await geminiService.generateMasterProposal(dashboardData);
                 break;
            case 'reputationData':
                 if (dashboardData.audience) await geminiService.analyzeReputation(dashboardData.audience.artistName);
                 break;
            case 'releasePlan':
                await geminiService.generateReleasePlan(payload.data.artistName, payload.data.releaseTitle, payload.data.releaseDate);
                break;
             case 'fanMailAnalysis':
                await geminiService.analyzeFanMail(payload.data);
                break;
            case 'tourPlan':
                 if(dashboardData.audience) await geminiService.generateTourPlan(dashboardData.audience.artistName, payload.data.tourScale, payload.data.targetRegion, dashboardData.audience);
                 break;
            case 'aiGeneratedImage':
                await geminiService.generateImage(payload.data.prompt, payload.data.aspectRatio);
                break;
            case 'lyricIdeas':
                await geminiService.generateLyricIdeas(payload.data.theme, payload.data.mood);
                break;
            case 'socialPosts':
                 await geminiService.generateSocialPosts(payload.data.releaseInfo, payload.data.platform);
                 break;
            case 'merchConcepts':
                 if(dashboardData.brandKit) await geminiService.generateMerchConcepts(dashboardData.audience?.artistName || 'My Band', dashboardData.brandKit);
                 break;
            case 'dealMemoAnalysis':
                await geminiService.analyzeDealMemo(payload.data);
                break;
            case 'brandKit':
                await geminiService.generateBrandKit(payload.data);
                break;
            case 'audioTranscription':
                await geminiService.transcribeAudio(payload.data.base64, payload.data.mimeType, payload.data.fileName);
                break;
            case 'artistBio':
                await geminiService.generateArtistBio(payload.data, dashboardData);
                break;
            case 'syncPitch':
                await geminiService.generateSyncPitch(payload.data.songDescription, payload.data.showDescription);
                break;
            case 'artworkAnalysis':
                const { imageA, imageB, brandInfo } = payload.data;
                const [base64A, base64B] = await Promise.all([
                    fileToBase64(imageA),
                    fileToBase64(imageB)
                ]);
                await geminiService.analyzeArtwork(base64A, imageA.type, base64B, imageB.type, brandInfo);
                break;
            default:
                console.warn("Unknown generation type:", payload.type);
        }
      } catch (e) {
        console.error("Generation failed:", e);
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Failed to generate ${payload.type}.`, type: 'error' } });
      }
  }, [geminiService, dashboardData, dispatch]);

  const handleAddContact = useCallback((contact: Omit<Contact, 'id'>) => {
      const exists = state.dashboardData.contacts?.some(c => c.name.toLowerCase() === contact.name.toLowerCase() && c.company.toLowerCase() === contact.company.toLowerCase());
      if (!exists) {
          dispatch({ type: 'ADD_CONTACT', payload: contact });
          dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `${contact.name} added to contacts.`, type: 'success' } });
      } else {
          dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `${contact.name} is already in your contacts.`, type: 'error' } });
      }
  }, [dispatch, state.dashboardData.contacts]);

  const handleExportPDF = () => {
    const element = proposalRef.current;
    if (element && window.html2canvas && window.jspdf) {
        window.html2canvas(element, { backgroundColor: '#1f2937' }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("master-proposal.pdf");
        });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Artist Career Co-Pilot
            </h1>
            <p className="mt-4 text-lg text-gray-400">Your AI-powered partner for music career strategy and growth.</p>
          </header>

          <main>
              {/* Core Strategy Section */}
              <Section title="Core Strategy" icon={<ChartTrendingUpIcon />} id="core-strategy">
                 <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold mb-4">1. Define Your Audience</h3>
                        <ToolCard icon={<UserGroupIcon />} title="Audience Analysis" description="Define your target audience based on your music's genre, themes, and influences." unlocked={true}>
                           <AudienceAnalysisTool onGenerate={(artistInfo) => handleGenerate({type: 'audience', data: artistInfo})} loading={loading.audience} />
                        </ToolCard>
                        <ErrorMessage error={errors.audience} />
                         {dashboardData.audience && <div className="mt-4"><AudienceDisplay data={dashboardData.audience} /></div>}
                    </div>
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold mb-4">Career Score</h3>
                        <Card>
                          <SummitScore onGenerate={() => handleGenerate({ type: 'summitScore' })} data={dashboardData.summitScore} loading={loading.summitScore} />
                        </Card>
                    </div>
                </div>
              </Section>

              {/* Verified Creative Chain */}
              <Section title="Verified Creative Chain" icon={<ScaleIcon />} id="creative-chain">
                  <p className="text-center text-gray-400 mb-4">Establish clear, indisputable ownership from the moment of creation. Create and log royalty split agreements to build a foundation of trust and transparency for your career.</p>
                  <SmartAgreementManager />
              </Section>
              
              {/* Creative Toolkit Section */}
              <Section title="Creative Toolkit" icon={<LightBulbIcon />} id="creative-toolkit">
                  <CreativeToolkit onGenerate={handleGenerate} state={state} />
                  <ErrorMessage error={Object.values(errors).find(e => e)} />
                  {dashboardData.artistBio && <div className="mt-6"><ArtistBioDisplay data={dashboardData.artistBio} /></div>}
                  {dashboardData.brandKit && <div className="mt-6"><BrandKitDisplay data={dashboardData.brandKit} /></div>}
                  {dashboardData.lyricIdeas && <div className="mt-6"><LyricIdeasDisplay data={dashboardData.lyricIdeas} /></div>}
                  {dashboardData.aiGeneratedImage && <div className="mt-6"><AIGeneratedImageDisplay data={dashboardData.aiGeneratedImage} /></div>}
                  {dashboardData.merchConcepts && <div className="mt-6"><MerchConceptsDisplay data={dashboardData.merchConcepts} /></div>}
                  {dashboardData.socialPosts && <div className="mt-6"><SocialPostsDisplay data={dashboardData.socialPosts} platform={dashboardData.socialPosts[0].platform} /></div>}
                   {dashboardData.syncPitch && <div className="mt-6"><SyncPitchDisplay data={dashboardData.syncPitch} onAddContact={handleAddContact} /></div>}
                  {dashboardData.pressRelease && <div className="mt-6"><PressReleaseDisplay data={dashboardData.pressRelease} /></div>}
                  {dashboardData.dealMemoAnalysis && <div className="mt-6"><DealMemoDisplay data={dashboardData.dealMemoAnalysis} /></div>}
                  {dashboardData.audioTranscription && <div className="mt-6"><AudioTranscriptionDisplay data={dashboardData.audioTranscription} /></div>}
                  {dashboardData.artworkAnalysis && <div className="mt-6"><ArtworkAnalysisDisplay data={dashboardData.artworkAnalysis} /></div>}
              </Section>

              {/* Contacts CRM Section */}
              <Section title="Industry Contacts CRM" icon={<IdentificationIcon />} id="contacts-crm">
                <ContactsDisplay contacts={dashboardData.contacts || []} onAddContact={handleAddContact} />
              </Section>
              
              {/* Planning & Execution Section */}
              <Section title="Planning & Execution" icon={<ClipboardDocumentCheckIcon />} id="planning-execution">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ToolCard icon={<CalendarDaysIcon />} title="Release Plan" description="Generate a detailed, step-by-step release checklist for your next single, EP, or album." unlocked={true}>
                      <ReleasePlanTool onGenerate={(data) => handleGenerate({type: 'releasePlan', data})} loading={loading.releasePlan} />
                  </ToolCard>
                  <ToolCard icon={<ChartBarIcon />} title="Market Analysis" description="Get a SWOT analysis, competitor breakdown, and platform recommendations." unlocked={!!dashboardData.audience} unlocksWith={['audience']}>
                     <ActionButton onClick={() => handleGenerate({type: 'marketAnalysis'})} loading={loading.marketAnalysis}>
                        <ChartBarIcon /> Analyze Market
                    </ActionButton>
                  </ToolCard>
                  <ToolCard icon={<CurrencyDollarIcon />} title="Financial Plan" description="Outline revenue streams, budget allocations, and financial goals." unlocked={!!dashboardData.audience} unlocksWith={['audience']}>
                     <ActionButton onClick={() => handleGenerate({type: 'financialPlan'})} loading={loading.financialPlan}>
                        <CurrencyDollarIcon /> Create Financial Plan
                     </ActionButton>
                  </ToolCard>
                </div>
                 <ErrorMessage error={errors.releasePlan || errors.marketAnalysis || errors.financialPlan} />
                 {dashboardData.releasePlan && <div className="mt-6"><ReleasePlanDisplay data={dashboardData.releasePlan} /></div>}
                 {dashboardData.marketAnalysis && <div className="mt-6"><MarketAnalysisDisplay data={dashboardData.marketAnalysis} /></div>}
                 {dashboardData.financialPlan && <div className="mt-6"><FinancialPlanDisplay data={dashboardData.financialPlan} /></div>}
              </Section>
              
              {/* Fan Engagement Section */}
              <Section title="Fan Engagement" icon={<UsersIcon />} id="fan-engagement">
                 <div className="grid md:grid-cols-2 gap-6">
                      <ToolCard icon={<EnvelopeIcon />} title="Fan Mail Analyzer" description="Analyze fan messages to understand sentiment, find themes, and get content ideas." unlocked={true}>
                         <FanMailAnalyzerTool onAnalyze={(messages) => handleGenerate({type: 'fanMailAnalysis', data: [messages]})} loading={loading.fanMailAnalysis} />
                      </ToolCard>
                      <ToolCard icon={<MapIcon />} title="Tour Planner" description="Plan your next tour with venue suggestions, a sample setlist, and merch ideas." unlocked={!!dashboardData.audience} unlocksWith={['audience']}>
                        <TourPlannerTool onGenerate={(data) => handleGenerate({type: 'tourPlan', data})} loading={loading.tourPlan} />
                      </ToolCard>
                 </div>
                 <ErrorMessage error={errors.fanMailAnalysis || errors.tourPlan} />
                 {dashboardData.fanMailAnalysis && <div className="mt-6"><FanMailDisplay data={dashboardData.fanMailAnalysis} /></div>}
                 {dashboardData.tourPlan && <div className="mt-6"><TourPlanDisplay data={dashboardData.tourPlan} /></div>}
              </Section>

              {/* Master Proposal Section */}
              <Section title="Master Proposal" icon={<DocumentTextIcon />} id="master-proposal">
                    <p className="text-center text-gray-400 mb-4">Once you've completed the sections above, generate a master proposal to share with potential managers, labels, or investors.</p>
                    <ActionButton onClick={() => handleGenerate({type: 'masterProposal'})} loading={loading.masterProposal} disabled={!dashboardData.audience || !dashboardData.marketAnalysis}>
                        <SparklesIcon /> Generate Master Proposal
                    </ActionButton>
                    <ErrorMessage error={errors.masterProposal} />
                    {dashboardData.masterProposal && (
                        <div className="mt-6">
                            <div className="flex justify-end mb-4">
                               <button onClick={handleExportPDF} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition">
                                   <ArrowDownTrayIcon /> Export as PDF
                               </button>
                            </div>
                            <div ref={proposalRef} className="p-8 bg-gray-900 rounded-lg">
                                <MasterProposalDisplay data={dashboardData.masterProposal} />
                            </div>
                        </div>
                    )}
              </Section>

              {/* Chat Assistant */}
              <Section title="Strategy Chatbot" icon={<ChatBubbleOvalLeftEllipsisIcon />} id="chatbot">
                <ChatAssistant systemInstruction="You are a helpful assistant for musicians. Your goal is to provide concise, actionable advice based on the user's career data. Be encouraging and creative." />
              </Section>

          </main>
        </div>
        <NotificationCenter />
      </div>
    </ErrorBoundary>
  );
};


// Helper components that were previously defined inside other components
// to avoid re-declaration issues in the single-file setup.

const FanMailAnalyzerTool: FC<{ onAnalyze: (messages: string) => void, loading?: boolean }> = ({ onAnalyze, loading }) => {
    const [messages, setMessages] = useState('');
    return (
        <div>
            <FormTextArea label="Paste fan mail/DMs (one per line)" value={messages} onChange={e => setMessages(e.target.value)} placeholder="e.g., I love your new song!\nWhen are you touring next?" rows={6}/>
            <ActionButton onClick={() => onAnalyze(messages)} loading={loading} disabled={!messages}>
                <EnvelopeIcon /> Analyze Messages
            </ActionButton>
        </div>
    );
};

const TourPlannerTool: FC<{ onGenerate: (data: {tourScale: string, targetRegion: string}) => void, loading?: boolean }> = ({ onGenerate, loading }) => {
    const [tourScale, setTourScale] = useState('Small Club');
    const [targetRegion, setTargetRegion] = useState('US West Coast');
    return (
        <div>
            <div className="mb-2">
                 <label className="block text-sm font-medium text-gray-300 mb-1">Tour Scale</label>
                 <select value={tourScale} onChange={e => setTourScale(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
                    <option>DIY / House Show</option>
                    <option>Small Club</option>
                    <option>Theater</option>
                     <option>Arena</option>
                </select>
            </div>
             <FormInput label="Target Region" value={targetRegion} onChange={e => setTargetRegion(e.target.value)} placeholder="e.g., Midwest USA, UK, Germany" />
            <ActionButton onClick={() => onGenerate({ tourScale, targetRegion })} loading={loading} disabled={!tourScale || !targetRegion}>
                <MapIcon /> Plan Tour
            </ActionButton>
        </div>
    );
};

const NotificationCenter: FC = () => {
    const { state, dispatch } = useAppContext();
    const { notifications } = state;

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 w-80 space-y-3 z-50">
            {notifications.map(n => (
                <Notification
                    key={n.id}
                    id={n.id}
                    message={n.message}
                    type={n.type}
                    onDismiss={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: n.id })}
                />
            ))}
        </div>
    );
};

const Notification: FC<AppNotification & { onDismiss: () => void }> = ({ id, message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-800/80 border-red-600' : 'bg-green-800/80 border-green-600';
    const Icon = isError ? XCircleIcon : CheckCircleIcon;

    return (
        <div className={`flex items-center gap-4 p-3 rounded-lg border backdrop-blur-md shadow-lg ${bgColor}`}>
            <div className="shrink-0"><Icon /></div>
            <p className="flex-grow text-sm text-gray-200">{message}</p>
            <button onClick={onDismiss} className="shrink-0 text-gray-400 hover:text-white">&times;</button>
        </div>
    );
};

//================================================================
// RENDER APP
//================================================================
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AppProvider>
        <App />
    </AppProvider>
  </React.StrictMode>
);