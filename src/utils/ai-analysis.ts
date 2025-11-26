import { EssentiaWASM } from 'essentia.js';

let essentiaInstance: any = null;

/**
 * Initializes EssentiaWASM globally to avoid redundant loading.
 * Must be called before any analysis.
 */
export async function initializeEssentia(): Promise<any> {
  if (!essentiaInstance) {
    try {
      const { Essentia } = await import('essentia.js');
      const EssentiaModule = await (Essentia as any)();
      essentiaInstance = new EssentiaModule(EssentiaModule);
      console.log('✅ Essentia.js initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Essentia.js:', error);
      throw new Error('Essentia.js failed to load. Check browser compatibility and network.');
    }
  }
  return essentiaInstance;
}

/**
 * Analyzes an audio buffer to extract music characteristics
 * @param audioBuffer - Web Audio API AudioBuffer
 * @returns Analysis results including BPM, key, genre, and mood
 */
export async function analyzeAudioBuffer(audioBuffer: AudioBuffer): Promise<AIAnalysisResult> {
  const essentia = await initializeEssentia();

  // Convert stereo to mono if needed
  const channelData = audioBuffer.numberOfChannels > 1 
    ? mergeStereoToMono(audioBuffer) 
    : audioBuffer.getChannelData(0);

  const audioSignal = Array.from(channelData);

  try {
    // Extract BPM (tempo)
    const rhythmResult = essentia.RhythmExtractor2013(audioSignal);
    const bpm = Math.round(rhythmResult.bpm);

    // Extract Key and Scale
    const keyResult = essentia.KeyExtractor(audioSignal);
    const key = formatKey(keyResult.key, keyResult.scale);

    // Extract basic audio features for genre/mood estimation
    const features = extractBasicFeatures(essentia, audioSignal);
    
    // Estimate genre based on audio characteristics
    const genre = estimateGenre(features);
    
    // Estimate mood based on audio characteristics
    const mood = estimateMood(features);

    return {
      bpm: bpm > 0 ? bpm : null,
      key,
      genre,
      mood,
      confidence: calculateConfidence(rhythmResult.confidence, keyResult.strength),
      analysisComplete: true,
      features,
    };
  } catch (error) {
    console.error('❌ AI analysis failed:', error);
    return {
      bpm: null,
      key: null,
      genre: null,
      mood: null,
      confidence: 0,
      analysisComplete: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
      features: null,
    };
  }
}

/**
 * Merges stereo channels to mono for analysis
 */
function mergeStereoToMono(audioBuffer: AudioBuffer): Float32Array {
  const left = audioBuffer.getChannelData(0);
  const right = audioBuffer.getChannelData(1);
  const mono = new Float32Array(left.length);
  for (let i = 0; i < left.length; i++) {
    mono[i] = (left[i] + right[i]) / 2;
  }
  return mono;
}

/**
 * Formats key and scale into readable format
 */
function formatKey(key: string, scale: string): string {
  const keyMap: { [key: string]: string } = {
    'C': 'C',
    'C#': 'C#',
    'D': 'D',
    'D#': 'D#',
    'E': 'E',
    'F': 'F',
    'F#': 'F#',
    'G': 'G',
    'G#': 'G#',
    'A': 'A',
    'A#': 'A#',
    'B': 'B',
    'Cb': 'B',
    'Db': 'C#',
    'Eb': 'D#',
    'Fb': 'E',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  };

  const normalizedKey = keyMap[key] || key;
  const scaleName = scale === 'major' ? 'Major' : scale === 'minor' ? 'Minor' : scale;
  return `${normalizedKey} ${scaleName}`;
}

/**
 * Extracts basic audio features for genre/mood estimation
 */
function extractBasicFeatures(essentia: any, audioSignal: number[]): AudioFeatures {
  try {
    // Extract spectral features
    const spectralFeatures = essentia.LowLevelSpectralExtractor(audioSignal);
    
    // Extract danceability
    const danceability = essentia.Danceability(audioSignal);
    
    // Extract energy
    const energy = essentia.Energy(audioSignal);
    
    // Extract loudness
    const loudness = essentia.Loudness(audioSignal);
    
    return {
      spectralCentroid: spectralFeatures.spectral_centroid_mean,
      spectralRolloff: spectralFeatures.spectral_rolloff_mean,
      spectralFlux: spectralFeatures.spectral_flux_mean,
      mfcc: spectralFeatures.mfcc_mean,
      danceability: danceability.danceability,
      energy: energy.energy,
      loudness: loudness.loudness,
      zeroCrossingRate: spectralFeatures.zerocrossingrate_mean,
    };
  } catch (error) {
    console.error('Error extracting basic features:', error);
    return null;
  }
}

/**
 * Estimates genre based on audio characteristics
 */
function estimateGenre(features: AudioFeatures | null): string {
  if (!features) return 'Unknown';
  
  const { spectralCentroid, danceability, energy, mfcc } = features;
  
  // Simple heuristic-based genre classification
  // In a real implementation, this would use a trained ML model
  
  if (danceability > 0.8 && spectralCentroid > 2000) {
    return 'Electronic';
  } else if (spectralCentroid > 2500 && energy > 0.7) {
    return 'Rock';
  } else if (spectralCentroid < 1500 && mfcc && mfcc[1] > -200) {
    return 'Jazz';
  } else if (spectralCentroid > 1800 && danceability > 0.6) {
    return 'Hip Hop';
  } else if (spectralCentroid < 1200) {
    return 'Classical';
  } else if (danceability > 0.7) {
    return 'Pop';
  } else {
    return 'Other';
  }
}

/**
 * Estimates mood based on audio characteristics
 */
function estimateMood(features: AudioFeatures | null): string {
  if (!features) return 'Unknown';
  
  const { energy, danceability, spectralCentroid, loudness } = features;
  
  // Simple heuristic-based mood classification
  // In a real implementation, this would use a trained ML model
  
  if (energy > 0.8 && danceability > 0.8) {
    return 'Energetic';
  } else if (energy < 0.3 && spectralCentroid < 1500) {
    return 'Peaceful';
  } else if (energy > 0.6 && danceability > 0.5) {
    return 'Happy';
  } else if (energy < 0.4 && loudness < -10) {
    return 'Melancholic';
  } else if (energy > 0.7 && spectralCentroid > 2000) {
    return 'Aggressive';
  } else if (danceability > 0.6 && spectralCentroid > 1800) {
    return 'Confident';
  } else if (energy < 0.5 && spectralCentroid < 1600) {
    return 'Relaxed';
  } else {
    return 'Neutral';
  }
}

/**
 * Calculates overall confidence score
 */
function calculateConfidence(bpmConfidence: number, keyStrength: number): number {
  // Normalize and combine confidence scores
  const bpmScore = Math.min(bpmConfidence, 1.0);
  const keyScore = Math.min(keyStrength / 2.0, 1.0); // Key strength is typically 0-2
  
  return (bpmScore + keyScore) / 2;
}

// Type definitions
export interface AIAnalysisResult {
  bpm: number | null;
  key: string | null;
  genre: string | null;
  mood: string | null;
  confidence: number;
  analysisComplete: boolean;
  error?: string;
  features?: AudioFeatures | null;
}

export interface AudioFeatures {
  spectralCentroid: number;
  spectralRolloff: number;
  spectralFlux: number;
  mfcc: number[] | null;
  danceability: number;
  energy: number;
  loudness: number;
  zeroCrossingRate: number;
}

/**
 * Analyzes an audio file directly from File object
 * @param file - Audio file to analyze
 * @returns Analysis results
 */
export async function analyzeAudioFile(file: File): Promise<AIAnalysisResult> {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Analyze the decoded buffer
    return await analyzeAudioBuffer(audioBuffer);
  } catch (error) {
    console.error('❌ Failed to analyze audio file:', error);
    return {
      bpm: null,
      key: null,
      genre: null,
      mood: null,
      confidence: 0,
      analysisComplete: false,
      error: error instanceof Error ? error.message : 'Failed to process audio file',
      features: null,
    };
  }
}