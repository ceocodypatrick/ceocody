import React, { FC, useState, useCallback } from 'react';
import {
  IdentificationIcon,
  SparklesIcon,
  PencilSquareIcon,
  MountainIcon,
  GiftIcon,
  ShareIcon,
  FilmIcon,
  NewspaperIcon,
  DocumentDuplicateIcon,
  MicrophoneIcon,
  ChartBarIcon
} from './icons';
import { FormInput, FormTextArea, ActionButton, ToolCard, LoadingSpinner, ErrorMessage } from './ui';
import type { DashboardData, LoadingStates, ErrorStates } from './types';
import { fileToBase64 } from './utils';

const useDropzone = window.useDropzone || ((options: any) => {
  const onDrop = options.onDrop;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && onDrop) {
      onDrop(Array.from(event.target.files));
    }
  };
  return {
    getRootProps: (props = {}) => ({ ...props }),
    getInputProps: (props = {}) => ({ ...props, type: 'file', onChange: handleFileChange, accept: options.accept, multiple: options.multiple }),
    isDragActive: false,
  };
});

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ArtistBioTool: FC<{ onGenerate: (p: string) => void; loading?: boolean }> = ({ onGenerate, loading }) => {
  const [artistInfo, setArtistInfo] = useState('');
  return (
    <div>
      <FormTextArea label="Describe your artist story and current momentum" value={artistInfo} onChange={(e) => setArtistInfo(e.target.value)} placeholder="e.g., I'm an indie-pop artist blending organic instruments with electro-pop beats. I've built a strong local following in Chicago and recently opened for Laufey." rows={5} />
      <ActionButton onClick={() => onGenerate(artistInfo)} loading={loading} disabled={!artistInfo}>
        <IdentificationIcon /> Generate Bios
      </ActionButton>
    </div>
  );
};

const BrandKitTool: FC<{ onGenerate: (info: string) => void; loading?: boolean }> = ({ onGenerate, loading }) => {
  const [info, setInfo] = useState('');
  return (
    <div>
      <FormTextArea label="Describe your sonic palette, target audience, and vibe" value={info} onChange={(e) => setInfo(e.target.value)} placeholder="e.g., Dreamy R&B sound, inspired by Solange and Snoh Aalegra. Fans are 20-something creatives in coastal cities who love reflective lyrics." rows={5} />
      <ActionButton onClick={() => onGenerate(info)} loading={loading} disabled={!info}>
        <SparklesIcon /> Build Brand Kit
      </ActionButton>
    </div>
  );
};

const LyricWriterTool: FC<{ onGenerate: (data: { theme: string; mood: string }) => void; loading?: boolean }> = ({ onGenerate, loading }) => {
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

const SocialPostTool: FC<{ onGenerate: (data: { releaseInfo: string; platform: 'Instagram' | 'Twitter' | 'TikTok' }) => void; loading?: boolean }> = ({ onGenerate, loading }) => {
  const [releaseInfo, setReleaseInfo] = useState('');
  const [platform, setPlatform] = useState<'Instagram' | 'Twitter' | 'TikTok'>('Instagram');
  return (
    <div>
      <FormTextArea label="What are you promoting?" value={releaseInfo} onChange={(e) => setReleaseInfo(e.target.value)} placeholder="e.g., New single 'Neon Fever' dropping next Friday. Produced by me, cinematic and upbeat." rows={4} />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as any)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
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

const PressReleaseTool: FC<{ onGenerate: (releaseInfo: string) => void; loading?: boolean }> = ({ onGenerate, loading }) => {
  const [releaseInfo, setReleaseInfo] = useState('');
  return (
    <div>
      <FormTextArea label="Key release details" value={releaseInfo} onChange={(e) => setReleaseInfo(e.target.value)} placeholder="e.g., Artist Name, Release Title, Release Date, a few sentences about the song/album." />
      <ActionButton onClick={() => onGenerate(releaseInfo)} loading={loading} disabled={!releaseInfo}>
        <NewspaperIcon /> Write Press Release
      </ActionButton>
    </div>
  );
};

const SyncPitchTool: FC<{ onGenerate: (p: { songDesc: string; showDesc: string }) => void; loading?: boolean }> = ({ onGenerate, loading }) => {
  const [songDesc, setSongDesc] = useState('');
  const [showDesc, setShowDesc] = useState('');
  return (
    <div>
      <FormTextArea label="Describe your song" value={songDesc} onChange={(e) => setSongDesc(e.target.value)} placeholder="e.g., 'Midnight Run' is an upbeat, 80s synth-pop track with a driving beat and hopeful lyrics about escaping a small town. (120 BPM, Key of C Major)" />
      <FormTextArea label="Describe the show/scene" value={showDesc} onChange={(e) => setShowDesc(e.target.value)} placeholder="e.g., A coming-of-age drama like 'Sex Education'. Looking for a song for a final scene where the main characters drive off to college." />
      <ActionButton onClick={() => onGenerate({ songDesc, showDesc })} loading={loading} disabled={!songDesc || !showDesc}>
        <FilmIcon /> Create Sync Pitch
      </ActionButton>
    </div>
  );
};

const ArtworkGeneratorTool: FC<{ onGenerate: (p: { prompt: string; aspectRatio: string }) => void; loading?: boolean }> = ({ onGenerate, loading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  return (
    <div>
      <FormTextArea label="Describe the artwork you want" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A robot holding a red skateboard, cinematic, dramatic lighting." />
      <div className="my-2">
        <label className="block text-sm font-medium text-gray-300 mb-1">Aspect Ratio</label>
        <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
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

const DealMemoAnalyzerTool: FC<{ onAnalyze: (memoText: string) => void; loading?: boolean }> = ({ onAnalyze, loading }) => {
  const [memoText, setMemoText] = useState('');
  return (
    <div>
      <FormTextArea label="Paste the deal memo text here" value={memoText} onChange={(e) => setMemoText(e.target.value)} placeholder="Copy and paste the full text of the deal memo or contract..." rows={8} />
      <ActionButton onClick={() => onAnalyze(memoText)} loading={loading} disabled={!memoText}>
        <DocumentDuplicateIcon /> Analyze Memo
      </ActionButton>
    </div>
  );
};

const AudioTranscriberTool: FC<{ onTranscribe: (file: File) => void; loading?: boolean; error?: string | null }> = ({ onTranscribe, loading, error }) => {
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

const ArtworkABTestTool: FC<{
  brandInfo: { artistName: string; brandStatement?: string; audience?: Audience };
  onAnalyze: (payload: { type: 'artworkAnalysis'; data: any }) => void;
  loading?: boolean;
}> = ({ brandInfo, onAnalyze, loading }) => {
  const [imageA, setImageA] = useState<{ file: File; url: string } | null>(null);
  const [imageB, setImageB] = useState<{ file: File; url: string } | null>(null);

  const onDropA = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      fileToDataUrl(file).then((url) => setImageA({ file, url }));
    }
  }, []);
  const onDropB = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      fileToDataUrl(file).then((url) => setImageB({ file, url }));
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

  const DropzoneUI: FC<{ getRootProps: any; getInputProps: any; isDragActive: boolean; image: { url: string } | null; label: string }> = ({ getRootProps, getInputProps, isDragActive, image, label }) => (
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

type Audience = DashboardData['audience'];

type CreativeToolkitProps = {
  onGenerate: (payload: any) => void;
  state: {
    dashboardData: DashboardData;
    loading: LoadingStates;
    errors: ErrorStates;
  };
};

const CreativeToolkit: FC<CreativeToolkitProps> = ({ onGenerate, state }) => {
  const { dashboardData, loading, errors } = state;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard icon={<IdentificationIcon />} title="Artist Bio" description="Generate short, medium, and long artist bios for different platforms." isUnlocked={true}>
        <ArtistBioTool onGenerate={(artistInfo) => onGenerate({ type: 'artistBio', data: artistInfo })} loading={loading.artistBio} />
      </ToolCard>
      <ToolCard icon={<SparklesIcon />} title="Brand Kit" description="Create a full brand identity, including colors, fonts, and logo ideas." isUnlocked={true}>
        <BrandKitTool onGenerate={(artistInfo) => onGenerate({ type: 'brandKit', data: artistInfo })} loading={loading.brandKit} />
      </ToolCard>
      <ToolCard icon={<PencilSquareIcon />} title="Lyric Writer" description="Get help with song titles, concepts, and structures when you have writer's block." isUnlocked={true}>
        <LyricWriterTool onGenerate={(data) => onGenerate({ type: 'lyricIdeas', data })} loading={loading.lyricIdeas} />
      </ToolCard>
      <ToolCard icon={<MountainIcon />} title="AI Artwork" description="Generate album art, logos, or social media graphics from a text prompt." isUnlocked={!!dashboardData.brandKit} missingDeps={!dashboardData.brandKit ? ['brandKit'] : undefined}>
        <ArtworkGeneratorTool onGenerate={(data) => onGenerate({ type: 'aiGeneratedImage', data })} loading={loading.aiGeneratedImage} />
      </ToolCard>
      <ToolCard icon={<GiftIcon />} title="Merch Concepts" description="Brainstorm creative merchandise ideas that align with your brand." isUnlocked={!!dashboardData.brandKit} missingDeps={!dashboardData.brandKit ? ['brandKit'] : undefined}>
        <ActionButton onClick={() => onGenerate({ type: 'merchConcepts' })} loading={loading.merchConcepts}>
          <GiftIcon /> Brainstorm Merch
        </ActionButton>
      </ToolCard>
      <ToolCard icon={<ShareIcon />} title="Social Posts" description="Create engaging social media posts to promote your latest release." isUnlocked={true}>
        <SocialPostTool onGenerate={(data) => onGenerate({ type: 'socialPosts', data })} loading={loading.socialPosts} />
      </ToolCard>
      <ToolCard icon={<FilmIcon />} title="Sync Pitch" description="Find music supervisors and write a pitch email to get your song placed in TV/film." isUnlocked={true}>
        <SyncPitchTool onGenerate={({ songDesc, showDesc }) => onGenerate({ type: 'syncPitch', data: { songDescription: songDesc, showDescription: showDesc } })} loading={loading.syncPitch} />
      </ToolCard>
      <ToolCard icon={<NewspaperIcon />} title="Press Release" description="Automatically write a professional press release for your new music." isUnlocked={!!dashboardData.artistBio} missingDeps={!dashboardData.artistBio ? ['artistBio'] : undefined}>
        <PressReleaseTool onGenerate={(releaseInfo) => onGenerate({ type: 'pressRelease', data: releaseInfo })} loading={loading.pressRelease} />
      </ToolCard>
      <ToolCard icon={<DocumentDuplicateIcon />} title="Deal Memo Analyzer" description="Paste in a contract or deal memo to get a summary and identify red flags." isUnlocked={true}>
        <DealMemoAnalyzerTool onAnalyze={(memoText) => onGenerate({ type: 'dealMemoAnalysis', data: memoText })} loading={loading.dealMemoAnalysis} />
      </ToolCard>
      <ToolCard icon={<MicrophoneIcon />} title="Audio Transcriber" description="Transcribe voice memos, interviews, or song ideas from an audio file." isUnlocked={true}>
        <AudioTranscriberTool
          onTranscribe={async (file) => {
            const base64 = await fileToBase64(file);
            onGenerate({ type: 'audioTranscription', data: { base64, mimeType: file.type, fileName: file.name } });
          }}
          loading={loading.audioTranscription}
          error={errors.audioTranscription}
        />
      </ToolCard>
      <ToolCard
        icon={<ChartBarIcon />}
        title="Artwork A/B Test"
        description="Get AI feedback on two artwork options to see which aligns better with your brand."
        isUnlocked={!!state.dashboardData.brandKit && !!state.dashboardData.audience}
        missingDeps={
          !state.dashboardData.brandKit || !state.dashboardData.audience
            ? ['brandKit', 'audience'].filter((key) => !state.dashboardData[key as keyof DashboardData])
            : undefined
        }
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

export default CreativeToolkit;
