
import React, { useState, useCallback, useEffect, useRef, FC, PropsWithChildren, Component, ErrorInfo, ReactNode, createContext, useReducer, useContext, useMemo, ChangeEvent, KeyboardEvent, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import type {
  Audience,
  Insight,
  MarketAnalysis,
  ContentPlan,
  PressRelease,
  FinancialPlan,
  SummitScoreData,
  RoyaltySplit,
  MasterProposal,
  ChatMessage,
  ReputationData,
  ReleasePlan,
  FanMailAnalysis,
  TourPlan,
  AIGeneratedImage,
  LyricIdeaSet,
  SocialPost,
  MerchConcept,
  DealMemoAnalysis,
  BrandKit,
  AudioTranscription,
  ArtistBio,
  SyncPitch,
  Guide,
  Contact,
  ArtworkAnalysis,
  DashboardData,
  LoadingStates,
  ErrorStates,
  AppNotification
} from './types';
import {
  ArrowDownTrayIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChartTrendingUpIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  ClipboardListIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  FilmIcon,
  FireIcon,
  GiftIcon,
  IdentificationIcon,
  LightBulbIcon,
  LockClosedIcon,
  MapIcon,
  MicrophoneIcon,
  MountainIcon,
  MusicalNoteIcon,
  NewspaperIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  ScaleIcon,
  ShareIcon,
  SparklesIcon,
  UserCheckIcon,
  UserGroupIcon,
  UsersIcon,
  XCircleIcon,
  CheckCircleIcon,
  PlusCircleIcon
} from './icons';
import {
  Card,
  Section,
  LoadingSpinner,
  ErrorMessage,
  FormInput,
  FormTextArea,
  ActionButton,
  ToolCard
} from './ui';
import { fileToBase64 } from './utils';

type GoogleGenAIImport = typeof import('@google/genai');
type GoogleGenAIClient = import('@google/genai').GoogleGenAI;
type ChatSession = import('@google/genai').Chat;
type SchemaHelper = GoogleGenAIImport['Type'];

let genAiModulePromise: Promise<GoogleGenAIImport> | null = null;
const loadGenAiModule = () => {
    if (!genAiModulePromise) {
        genAiModulePromise = import('@google/genai');
    }
    return genAiModulePromise;
};

type MarkedModule = typeof import('marked');
let markedModulePromise: Promise<MarkedModule> | null = null;
const loadMarkedModule = () => {
    if (!markedModulePromise) {
        markedModulePromise = import('marked');
    }
    return markedModulePromise;
};

const CreativeToolkitLazy = React.lazy(() => import('./creative-toolkit'));


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

// html2canvas and jspdf will be accessed directly from the window object when needed.


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
        if (state.chatHistory.length === 0) {
            return state;
        }
        const lastMessage = state.chatHistory[state.chatHistory.length - 1];
        if (lastMessage.role !== 'assistant') {
            return state;
        }

        // Create a new array and a new object for the last message to avoid state mutation.
        const newHistory = [...state.chatHistory];
        const updatedLastMessage = {
            ...lastMessage,
            content: lastMessage.content + action.payload
        };
        newHistory[newHistory.length - 1] = updatedLastMessage;
        
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
    private ai: GoogleGenAIClient | null = null;
    private chat: ChatSession | null = null;
    private typeHelper: SchemaHelper | null = null;
    private initializationPromise: Promise<void> | null = null;
    private dispatch: React.Dispatch<AppAction>;

    constructor(dispatch: React.Dispatch<AppAction>) {
        this.dispatch = dispatch;
    }

    private ensureInitialized() {
        if (!this.initializationPromise) {
            this.initializationPromise = (async () => {
                try {
                    const module = await loadGenAiModule();
                    this.typeHelper = module.Type;
                    if (process.env.API_KEY) {
                        this.ai = new module.GoogleGenAI({ apiKey: process.env.API_KEY });
                    }
                } catch (error) {
                    console.error("Failed to initialize GoogleGenAI:", error);
                    this.dispatch({
                        type: 'ADD_NOTIFICATION',
                        payload: { message: "Could not initialize AI service. Please check your API key.", type: 'error' }
                    });
                    throw error;
                }
            })();
        }
        return this.initializationPromise;
    }

    private async getAI(): Promise<GoogleGenAIClient> {
        await this.ensureInitialized();
        if (!this.ai) {
            const errorMsg = "API Key not configured. Please set up your API key.";
            this.dispatch({ type: 'SET_ERROR', payload: { key: 'audience', value: errorMsg } });
            throw new Error(errorMsg);
        }
        return this.ai;
    }

    private async getSchemaHelper(): Promise<SchemaHelper> {
        await this.ensureInitialized();
        if (!this.typeHelper) {
            throw new Error('Schema helper not initialized');
        }
        return this.typeHelper;
    }

    private async generate<T>(
        key: keyof DashboardData | keyof LoadingStates,
        prompt: string,
        schemaBuilder: (Type: SchemaHelper) => any,
        storeInState: boolean = true
    ): Promise<T> {
        this.dispatch({ type: 'SET_LOADING', payload: { key, value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key, value: null } });

        try {
            const ai = await this.getAI();
            const Type = await this.getSchemaHelper();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schemaBuilder(Type),
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
        return this.generate<Audience>('audience', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                artistName: { type: Type.STRING },
                demographics: { type: Type.OBJECT, properties: { ageRange: {type: Type.STRING}, gender: {type: Type.STRING}, topCountries: {type: Type.ARRAY, items: {type: Type.STRING}}, primaryLanguage: {type: Type.STRING}}},
                psychographics: { type: Type.OBJECT, properties: { interests: {type: Type.ARRAY, items: {type: Type.STRING}}, values: {type: Type.ARRAY, items: {type: Type.STRING}}, personalityTraits: {type: Type.ARRAY, items: {type: Type.STRING}}}},
                onlineBehavior: { type: Type.OBJECT, properties: { socialMediaUsage: {type: Type.ARRAY, items: {type: Type.STRING}}, preferredContent: {type: Type.ARRAY, items: {type: Type.STRING}}, onlineShopping: {type: Type.STRING}}},
            }
        }));
    }
    
    async generateStrategicInsights(audience: Audience): Promise<Insight[]> {
        const prompt = `Based on this audience profile for ${audience.artistName}, generate 3-5 key strategic insights. Each insight should have a title, a short description, and a piece of actionable advice for the artist to grow their fanbase. Audience: ${JSON.stringify(audience)}`;
        return this.generate<Insight[]>('insights', prompt, (Type) => ({
             type: Type.ARRAY,
             items: {
                 type: Type.OBJECT,
                 properties: {
                     title: { type: Type.STRING },
                     description: { type: Type.STRING },
                     actionable_advice: { type: Type.STRING },
                 }
             }
        }));
    }
    
    async generateMarketAnalysis(artistInfo: string): Promise<MarketAnalysis> {
        const prompt = `Create a detailed market analysis for a music artist described as: "${artistInfo}". Include a SWOT analysis, identify 3-5 potential competitors with their strengths and weaknesses, list current market trends relevant to the artist, and suggest the best platforms for them to target.`;
        return this.generate<MarketAnalysis>('marketAnalysis', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                swot: { type: Type.OBJECT, properties: { strengths: {type: Type.ARRAY, items: {type: Type.STRING}}, weaknesses: {type: Type.ARRAY, items: {type: Type.STRING}}, opportunities: {type: Type.ARRAY, items: {type: Type.STRING}}, threats: {type: Type.ARRAY, items: {type: Type.STRING}}}},
                competitors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type: Type.STRING}, strengths: {type: Type.STRING}, weaknesses: {type: Type.STRING}}}},
                market_trends: { type: Type.ARRAY, items: { type: Type.STRING }},
                target_platforms: { type: Type.ARRAY, items: { type: Type.STRING }},
            }
        }));
    }

    async generateContentPlan(artistInfo: string, audience: Audience, market: MarketAnalysis): Promise<ContentPlan> {
        const prompt = `Develop a content plan for ${audience.artistName}, an artist described as "${artistInfo}". The target audience is ${JSON.stringify(audience.demographics)}. The artist should focus on these platforms: ${market.target_platforms.join(', ')}. Define 3 content pillars, generate 5-7 specific content ideas with platform and format, and create a posting schedule.`;
        return this.generate<ContentPlan>('contentPlan', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                content_pillars: { type: Type.ARRAY, items: { type: Type.STRING } },
                content_ideas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { platform: {type: Type.STRING}, idea: {type: Type.STRING}, format: {type: Type.STRING}, potential_impact: {type: Type.STRING}}}},
                posting_schedule: { type: Type.OBJECT, properties: { platform: {type: Type.STRING}, frequency: {type: Type.STRING}, best_time_to_post: {type: Type.STRING}}},
            }
        }));
    }
    
    async generatePressRelease(releaseInfo: string, artistBio: ArtistBio): Promise<PressRelease> {
        const prompt = `Write a professional press release for a music release with the following details: "${releaseInfo}". Use the artist's bio for context. The press release needs a catchy headline, a subheadline, a compelling body, the standard artist boilerplate, and contact information. Artist Bio: ${artistBio.medium}`;
        return this.generate<PressRelease>('pressRelease', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                body: { type: Type.STRING },
                boilerplate: { type: Type.STRING },
                contact_info: { type: Type.STRING },
            }
        }));
    }
    
    async generateFinancialPlan(artistInfo: string, audience: Audience): Promise<FinancialPlan> {
        const prompt = `Create a high-level financial plan for an artist like "${artistInfo}" targeting an audience like "${JSON.stringify(audience.demographics)}". Identify 5-7 potential revenue streams with short-term and long-term potential. Suggest a budget allocation percentage across key categories (e.g., marketing, production, touring). Outline 3-5 key financial goals.`;
        return this.generate<FinancialPlan>('financialPlan', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                revenue_streams: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stream: {type: Type.STRING}, short_term_potential: {type: Type.STRING}, long_term_potential: {type: Type.STRING}}}},
                budget_allocation: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: {type: Type.STRING}, percentage: {type: Type.NUMBER}, notes: {type: Type.STRING}}}},
                financial_goals: { type: Type.ARRAY, items: { type: Type.STRING }},
            }
        }));
    }

    async getSummitScore(dashboardData: DashboardData): Promise<SummitScoreData> {
        const prompt = `Analyze the following artist dashboard data and calculate a "Summit Score" from 0 to 100. The score should reflect the artist's overall career readiness and strategic planning. A score of 100 means they have a comprehensive, professional plan across all areas. Provide a brief explanation for the score and list the top 3 areas for improvement. Data: ${JSON.stringify(dashboardData)}`;
        return this.generate<SummitScoreData>('summitScore', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                areas_for_improvement: { type: Type.ARRAY, items: { type: Type.STRING }},
            }
        }));
    }
    
    async generateMasterProposal(dashboardData: DashboardData): Promise<MasterProposal> {
        const prompt = `Based on the complete dashboard data, generate a comprehensive master artist proposal. This document should be suitable to send to a potential manager, label, or investor. It needs a compelling executive summary and detailed sections covering audience, market position, content strategy, financial plan, and brand identity. Data: ${JSON.stringify(dashboardData)}`;
        return this.generate<MasterProposal>('masterProposal', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                executive_summary: { type: Type.STRING },
                sections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, content: {type: Type.STRING}}}},
            }
        }));
    }
    
    async startChat(systemInstruction: string) {
        try {
            const ai = await this.getAI();
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
            const ai = await this.getAI();
            const Type = await this.getSchemaHelper();
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
        return this.generate<ReleasePlan>('releasePlan', prompt, (Type) => {
            const taskSchema = { type: Type.OBJECT, properties: { text: { type: Type.STRING }, completed: { type: Type.BOOLEAN } } };
            const groupSchema = { type: Type.OBJECT, properties: { category: { type: Type.STRING }, items: { type: Type.ARRAY, items: taskSchema } } };
            const timeframeSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING }, groups: { type: Type.ARRAY, items: groupSchema } } };
            return {
                type: Type.OBJECT,
                properties: {
                    artistName: { type: Type.STRING },
                    releaseTitle: { type: Type.STRING },
                    releaseDate: { type: Type.STRING },
                    timeframes: { type: Type.ARRAY, items: timeframeSchema }
                }
            };
        });
    }
    
    async analyzeFanMail(messages: string[]): Promise<FanMailAnalysis> {
        const prompt = `Analyze this batch of fan mail/DMs. Provide a sentiment analysis (percentage positive, neutral, negative), identify key themes and topics fans are talking about, suggest 3 categories of templated replies (e.g., "Appreciation", "Answering Question"), and generate 3 content ideas based on what fans are saying. Messages: ${JSON.stringify(messages)}`;
        return this.generate<FanMailAnalysis>('fanMailAnalysis', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                sentiment: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
                keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedReplies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, text: { type: Type.STRING } } } },
                contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        }));
    }

    async generateTourPlan(artistName: string, tourScale: string, targetRegion: string, audience: Audience): Promise<TourPlan> {
        const prompt = `Create a tour plan for ${artistName}. The tour is at a "${tourScale}" scale, targeting the "${targetRegion}" region. The target audience is ${JSON.stringify(audience.demographics)}. Suggest 5-7 suitable venues with location and reasoning. Create a sample 10-song setlist. Brainstorm 3-5 merchandise ideas that would appeal to the audience.`;
        return this.generate<TourPlan>('tourPlan', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                venues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, location: { type: Type.STRING }, capacity: { type: Type.STRING }, contact: { type: Type.STRING }, reasoning: { type: Type.STRING } } } },
                setlist: { type: Type.OBJECT, properties: { songs: { type: Type.ARRAY, items: { type: Type.STRING } }, notes: { type: Type.STRING } } },
                merchandise: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, description: { type: Type.STRING } } } },
            }
        }));
    }

    async generateImage(prompt: string, aspectRatio: string): Promise<AIGeneratedImage> {
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'aiGeneratedImage', value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key: 'aiGeneratedImage', value: null } });
        try {
            const ai = await this.getAI();
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
        return this.generate<LyricIdeaSet>('lyricIdeas', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                titles: { type: Type.ARRAY, items: { type: Type.STRING } },
                concepts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } } } },
                progression: { type: Type.STRING },
            }
        }));
    }
    
    async generateSocialPosts(releaseInfo: string, platform: SocialPost['platform']): Promise<SocialPost[]> {
        const prompt = `Create 3 distinct social media posts for the platform "${platform}" to promote a release with these details: "${releaseInfo}". Each post should have unique content and a set of relevant hashtags.`;
        const posts = await this.generate<SocialPost[]>('socialPosts', prompt, (Type) => ({
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    platform: { type: Type.STRING },
                    content: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }));
        // Ensure the platform is correctly set, as the model might hallucinate it.
        return posts.map(p => ({ ...p, platform }));
    }

    async generateMerchConcepts(artistName: string, brandKit: BrandKit): Promise<MerchConcept[]> {
        const prompt = `For an artist named ${artistName} with this brand identity: "${brandKit.brand_statement}", brainstorm 3 creative merchandise concepts. For each concept, provide the item type, a brief description, and a detailed prompt for an AI image generator to create the design.`;
        return this.generate<MerchConcept[]>('merchConcepts', prompt, (Type) => ({
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING },
                    description: { type: Type.STRING },
                    design_prompt: { type: Type.STRING },
                }
            }
        }));
    }
    
    async analyzeDealMemo(memoText: string): Promise<DealMemoAnalysis> {
        const prompt = `Analyze the following music industry deal memo. Provide a concise summary of the agreement, explain the key terms in simple language, and identify any potential red flags or points of negotiation for the artist. Memo Text: "${memoText}"`;
        return this.generate<DealMemoAnalysis>('dealMemoAnalysis', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                key_terms: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { term: { type: Type.STRING }, explanation: { type: Type.STRING } } } },
                red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        }));
    }

    async generateBrandKit(artistInfo: string): Promise<BrandKit> {
        const prompt = `Generate a complete brand kit for a music artist described as: "${artistInfo}". Include a concise brand statement, two distinct color palettes (e.g., Primary, Secondary) with hex codes, two font pairings (headline and body), and three detailed prompts for an AI image generator to create different logo styles.`;
        return this.generate<BrandKit>('brandKit', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                brand_statement: { type: Type.STRING },
                color_palettes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, colors: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
                font_pairings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, body: { type: Type.STRING } } } },
                logo_prompts: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        }));
    }
    
    async transcribeAudio(base64Audio: string, mimeType: string, fileName: string): Promise<AudioTranscription> {
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'audioTranscription', value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key: 'audioTranscription', value: null } });

        try {
            const ai = await this.getAI();
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
        return this.generate<ArtistBio>('artistBio', prompt, (Type) => ({
            type: Type.OBJECT,
            properties: {
                short: { type: Type.STRING, description: "1-2 sentences, for social media profiles." },
                medium: { type: Type.STRING, description: "1 paragraph, for press releases or EPKs." },
                long: { type: Type.STRING, description: "3-4 paragraphs, for a website 'About' page." },
            }
        }));
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
        // Use a different key for loading/error state so it doesn't conflict with other tools
        return this.generate<Omit<RoyaltySplit, 'id' | 'isFinalized'>>('royaltySplitSuggestion', prompt, (Type) => ({
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
        }), false);
    }

    async generateSyncPitch(songDescription: string, showDescription: string): Promise<SyncPitch> {
        const prompt = `I want to pitch a song to a TV show.
        Song Description: "${songDescription}"
        Show Description: "${showDescription}"
        Based on this, suggest 3-5 real music supervisors (with their company) who would be a good fit and explain why. Then, write a concise, professional pitch email to one of them, including a subject line and body.`;
        return this.generate<SyncPitch>('syncPitch', prompt, (Type) => ({
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
        }));
    }
    
    async analyzeArtwork(base64ImageA: string, mimeTypeA: string, base64ImageB: string, mimeTypeB: string, brandInfo: { artistName: string; brandStatement?: string; audience?: Audience }): Promise<ArtworkAnalysis> {
        this.dispatch({ type: 'SET_LOADING', payload: { key: 'artworkAnalysis', value: true } });
        this.dispatch({ type: 'SET_ERROR', payload: { key: 'artworkAnalysis', value: null } });

        try {
            const ai = await this.getAI();
            const Type = await this.getSchemaHelper();
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
  const [parser, setParser] = useState<MarkedModule['marked'] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadMarkedModule()
      .then(mod => {
        if (mounted) {
          setParser(mod.marked);
        }
      })
      .catch(error => {
        console.error('Failed to load markdown parser', error);
        if (mounted) {
          setLoadError('Unable to render preview');
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopy = () => {
    copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const rawHtml = useMemo(() => parser?.parse(content || "") ?? null, [parser, content]);

  return (
    <div className={`relative prose prose-invert prose-sm sm:prose-base max-w-none prose-h1:text-green-400 prose-h2:text-green-500 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 ${className}`}>
        <button onClick={handleCopy} className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white transition rounded-lg bg-gray-700/50 hover:bg-gray-600/50" aria-label="Copy markdown">
            {copied ? <CheckCircleIcon /> : <ClipboardIcon />}
        </button>
        {rawHtml ? (
            <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
        ) : (
            <div className="text-sm text-gray-400">
                {loadError ? <span>{loadError}</span> : <pre className="whitespace-pre-wrap font-sans">{content}</pre>}
            </div>
        )}
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

//================================================================
// MAIN APP COMPONENT
//================================================================
const App = () => {
  const { state, dispatch, geminiService } = useAppContext();
  const { dashboardData, loading, errors, activeGuide } = state;
  const proposalRef = useRef(null);

  const requirementStatus = useCallback(
    (...keys: (keyof DashboardData)[]) => {
      const missing = keys.filter((key) => !dashboardData[key]);
      return { isUnlocked: missing.length === 0, missingDeps: missing };
    },
    [dashboardData]
  );

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
                        <ToolCard icon={<UserGroupIcon />} title="Audience Analysis" description="Define your target audience based on your music's genre, themes, and influences." isUnlocked={true}>
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
                  <Suspense fallback={<Card className="p-6 flex justify-center"><LoadingSpinner /></Card>}>
                      <CreativeToolkitLazy onGenerate={handleGenerate} state={state} />
                  </Suspense>
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
                  <ToolCard icon={<CalendarDaysIcon />} title="Release Plan" description="Generate a detailed, step-by-step release checklist for your next single, EP, or album." isUnlocked={true}>
                      <ReleasePlanTool onGenerate={(data) => handleGenerate({type: 'releasePlan', data})} loading={loading.releasePlan} />
                  </ToolCard>
                  <ToolCard icon={<ChartBarIcon />} title="Market Analysis" description="Get a SWOT analysis, competitor breakdown, and platform recommendations." {...requirementStatus('audience')}>
                     <ActionButton onClick={() => handleGenerate({type: 'marketAnalysis'})} loading={loading.marketAnalysis}>
                        <ChartBarIcon /> Analyze Market
                    </ActionButton>
                  </ToolCard>
                  <ToolCard icon={<CurrencyDollarIcon />} title="Financial Plan" description="Outline revenue streams, budget allocations, and financial goals." {...requirementStatus('audience')}>
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
                      <ToolCard icon={<EnvelopeIcon />} title="Fan Mail Analyzer" description="Analyze fan messages to understand sentiment, find themes, and get content ideas." isUnlocked={true}>
                         <FanMailAnalyzerTool onAnalyze={(messages) => handleGenerate({type: 'fanMailAnalysis', data: [messages]})} loading={loading.fanMailAnalysis} />
                      </ToolCard>
                      <ToolCard icon={<MapIcon />} title="Tour Planner" description="Plan your next tour with venue suggestions, a sample setlist, and merch ideas." {...requirementStatus('audience')}>
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