import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { generateMasterProposal } from '~/services/geminiService.ts';
import type { MasterProposal, ActiveTool } from '~/types.ts';
import { Loader } from '~/components/Loader.tsx';
import { ToolTabs } from '~/components/ToolTabs.tsx';
import { Header } from '~/components/Header.tsx';

// Lazy load all tool components for better initial load performance
const AudienceInput = lazy(() => import('~/components/AudienceInput.tsx'));
const MasterProposalDisplay = lazy(() => import('~/components/MasterProposalDisplay.tsx'));
const DataDashboard = lazy(() => import('~/components/DataDashboard.tsx'));
const SmartLinkCreator = lazy(() => import('~/components/SmartLinkCreator.tsx'));
const RoyaltyCalculator = lazy(() => import('~/components/RoyaltyCalculator.tsx'));
const CreditHunter = lazy(() => import('~/components/CreditHunter.tsx'));
const SummitScore = lazy(() => import('~/components/SummitScore.tsx'));
const ContractCreator = lazy(() => import('~/components/ContractCreator.tsx'));
const LyricsTranscriber = lazy(() => import('~/components/LyricsTranscriber.tsx'));
const PRToolkit = lazy(() => import('~/components/PRToolkit.tsx'));
const ContentPlanner = lazy(() => import('~/components/ContentPlanner.tsx'));
const VisualCreator = lazy(() => import('~/components/VisualCreator.tsx'));
const MarketAnalyst = lazy(() => import('~/components/MarketAnalyst.tsx'));
const FinancialPlanner = lazy(() => import('~/components/FinancialPlanner.tsx'));
const PlaylistPitcher = lazy(() => import('~/components/PlaylistPitcher.tsx'));
const SongPreviewer = lazy(() => import('~/components/SongPreviewer.tsx'));

const App = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>(() => {
    try {
      const savedTool = localStorage.getItem('activeTool') as ActiveTool;
      return savedTool || 'songpreviewer';
    } catch {
      return 'songpreviewer';
    }
  });
  
  const [artistUrl, setArtistUrl] = useState<string>('');
  const [proposalResult, setProposalResult] = useState<MasterProposal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('checkedItems');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  useEffect(() => {
    localStorage.setItem('activeTool', activeTool);
  }, [activeTool]);

  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);
  
  const handleCheckItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleAnalysis = useCallback(async () => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    if (!artistUrl.trim() || !urlPattern.test(artistUrl)) {
      setError("Please enter a valid artist URL (e.g., Spotify, Instagram, TikTok).");
      return;
    }
    setIsLoading(true);
    setError(null);
    setProposalResult(null);

    const [result, generationError] = await generateMasterProposal(artistUrl);
    
    setIsLoading(false);
    if (generationError) {
      setError(generationError.message);
    } else {
      setProposalResult(result);
    }
  }, [artistUrl]);

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <DataDashboard />;
      case 'audit':
        return (
          <>
            <Header 
              title="AI STRATEGIC PROPOSAL GENERATOR"
              subtitle="Harness AI to conduct a comprehensive artist audit and generate a complete strategic marketing proposal."
            />
            <AudienceInput
              value={artistUrl}
              onChange={(e) => setArtistUrl(e.target.value)}
              onSubmit={handleAnalysis}
              isLoading={isLoading}
            />
            {error && (
              <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {isLoading && <Loader />}
            {proposalResult && !isLoading && (
              <div className="mt-8 animate-fade-in">
                <MasterProposalDisplay 
                  proposal={proposalResult}
                  checkedItems={checkedItems}
                  onCheckItem={handleCheckItem}
                />
              </div>
            )}
          </>
        );
      case 'smartlink':
        return <SmartLinkCreator />;
      case 'calculator':
        return <RoyaltyCalculator />;
      case 'credithunter':
        return <CreditHunter />;
      case 'summitscore':
        return <SummitScore />;
      case 'contracts':
        return <ContractCreator />;
      case 'transcriber':
        return <LyricsTranscriber />;
      case 'prtoolkit':
        return <PRToolkit />;
      case 'contentplanner':
        return <ContentPlanner />;
      case 'visuals':
        return <VisualCreator />;
      case 'marketanalyst':
        return <MarketAnalyst />;
      case 'financials':
        return <FinancialPlanner />;
       case 'playlistpitcher':
        return <PlaylistPitcher />;
       case 'songpreviewer':
        return <SongPreviewer />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111111] text-gray-300 font-sans">
        <ToolTabs 
            activeTool={activeTool} 
            setActiveTool={setActiveTool} 
            setError={setError} 
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto h-screen">
            <Suspense fallback={<Loader />}>
                {renderTool()}
            </Suspense>
        </main>
    </div>
  );
};

export default App;