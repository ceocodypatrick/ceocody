
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
    };
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
