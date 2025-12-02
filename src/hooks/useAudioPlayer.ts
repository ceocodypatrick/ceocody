import { useState, useCallback, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { AudioTrack, Playlist } from '../types';
import { storage } from '../utils/helpers';

// Audio player context type
interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  currentPlaylist: Playlist | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLooping: boolean;
  isShuffling: boolean;
  queue: AudioTrack[];
  queueIndex: number;
  
  // Playback controls
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  
  // Track/playlist management
  loadTrack: (track: AudioTrack) => void;
  loadPlaylist: (playlist: Playlist) => void;
  addToQueue: (tracks: AudioTrack[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  
  // State getters
  getProgress: () => number;
  getRemainingTime: () => number;
  getTimeFormatted: () => { current: string; total: string };
}

// Create audio player context
const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Provider props
interface AudioPlayerProviderProps {
  children: ReactNode;
}

// Audio player provider component
export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // State
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    // Set up event listeners
    const handleLoadStart = () => {
      setCurrentTime(0);
      setDuration(0);
    };
    
    const handleLoadedMetadata = () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleVolumeChange = () => {
      setVolumeState(audio.volume);
    };
    
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);
    
    // Load saved settings
    const savedVolume = storage.get<number>('audio_volume', 0.7);
    const savedPlaybackRate = storage.get<number>('audio_playback_rate', 1);
    
    audio.volume = savedVolume;
    audio.playbackRate = savedPlaybackRate;
    setVolumeState(savedVolume);
    setPlaybackRateState(savedPlaybackRate);
    
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLooping]);

  // Play function
  const play = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().catch(error => {
        console.error('Failed to play audio:', error);
      });
    }
  }, [currentTrack]);

  // Pause function
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Seek to time
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Next track
  const next = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex = queueIndex + 1;
    
    if (nextIndex >= queue.length) {
      if (isShuffling) {
        shuffleQueue();
        nextIndex = 0;
      } else {
        nextIndex = 0; // Loop to beginning
      }
    }
    
    if (queue[nextIndex]) {
      setQueueIndex(nextIndex);
      loadTrack(queue[nextIndex]);
    }
  }, [queue, queueIndex, isShuffling]);

  // Previous track
  const previous = useCallback(() => {
    if (queue.length === 0) return;
    
    let prevIndex = queueIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // Loop to end
    }
    
    if (queue[prevIndex]) {
      setQueueIndex(prevIndex);
      loadTrack(queue[prevIndex]);
    }
  }, [queue, queueIndex]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    setVolumeState(clampedVolume);
    storage.set('audio_volume', clampedVolume);
  }, []);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    
    setPlaybackRateState(rate);
    storage.set('audio_playback_rate', rate);
  }, []);

  // Toggle loop
  const toggleLoop = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffling(!isShuffling);
    
    if (!isShuffling && queue.length > 0) {
      shuffleQueue();
    }
  }, [isShuffling, queue]);

  // Load single track
  const loadTrack = useCallback((track: AudioTrack) => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Load new track
    audio.src = track.url;
    audio.load();
    
    setCurrentTrack(track);
    setCurrentPlaylist(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Save to history
    const history = storage.get<AudioTrack[]>('playback_history', []);
    const updatedHistory = [track, ...history.filter(t => t.id !== track.id)].slice(0, 50);
    storage.set('playback_history', updatedHistory);
  }, []);

  // Load playlist
  const loadPlaylist = useCallback((playlist: Playlist) => {
    if (playlist.tracks.length === 0) return;
    
    setCurrentPlaylist(playlist);
    setQueue(playlist.tracks);
    setQueueIndex(0);
    loadTrack(playlist.tracks[0]);
  }, []);

  // Add tracks to queue
  const addToQueue = useCallback((tracks: AudioTrack[]) => {
    setQueue(prev => [...prev, ...tracks]);
  }, []);

  // Remove track from queue
  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    
    if (index === queueIndex) {
      if (queue.length > 1) {
        const nextTrack = queue[index + 1] || queue[0];
        loadTrack(nextTrack);
        setQueueIndex(index === queue.length - 1 ? 0 : index);
      }
    }
  }, [queueIndex, queue, loadTrack]);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(0);
    setCurrentPlaylist(null);
  }, []);

  // Shuffle queue
  const shuffleQueue = useCallback(() => {
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
  }, [queue]);

  // Get progress percentage
  const getProgress = useCallback((): number => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  // Get remaining time
  const getRemainingTime = useCallback((): number => {
    return duration - currentTime;
  }, [currentTime, duration]);

  // Get formatted time strings
  const getTimeFormatted = useCallback(() => {
    const formatTime = (time: number): string => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return {
      current: formatTime(currentTime),
      total: formatTime(duration)
    };
  }, [currentTime, duration]);

  const value: AudioPlayerContextType = {
    currentTrack,
    currentPlaylist,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLooping,
    isShuffling,
    queue,
    queueIndex,
    
    play,
    pause,
    toggle,
    seek,
    next,
    previous,
    setVolume,
    setPlaybackRate,
    toggleLoop,
    toggleShuffle,
    
    loadTrack,
    loadPlaylist,
    addToQueue,
    removeFromQueue,
    clearQueue,
    shuffleQueue,
    
    getProgress,
    getRemainingTime,
    getTimeFormatted
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

// Hook to use audio player context
export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  
  return context;
};

// Hook for audio waveform visualization
export const useWaveform = (audioUrl: string | null, samples: number = 200) => {
  const [waveform, setWaveform] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setWaveform([]);
      return;
    }

    const generateWaveform = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
        
        const rawData = audioBuffer.getChannelData(0);
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData: number[] = [];
        
        for (let i = 0; i < samples; i++) {
          const blockStart = blockSize * i;
          let sum = 0;
          
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          
          filteredData.push(sum / blockSize);
        }
        
        // Normalize the data
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        const normalizedData = filteredData.map(n => n * multiplier);
        
        setWaveform(normalizedData);
      } catch (err) {
        setError('Failed to generate waveform');
        console.error('Waveform generation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateWaveform();
  }, [audioUrl, samples]);

  return { waveform, isLoading, error };
};

// Hook for audio analyzer
export const useAudioAnalyzer = () => {
  const { currentTrack } = useAudioPlayer();
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (!currentTrack) {
      setAnalyser(null);
      setFrequencyData(null);
      return;
    }

    const setupAnalyser = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audio = new Audio(currentTrack.url);
      
      const source = audioContext.createMediaElementSource(audio);
      const analyserNode = audioContext.createAnalyser();
      
      analyserNode.fftSize = 256;
      analyserNode.connect(audioContext.destination);
      source.connect(analyserNode);
      
      setAnalyser(analyserNode);
      
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
      
      const updateFrequencyData = () => {
        if (analyserNode) {
          analyserNode.getByteFrequencyData(dataArray);
          setFrequencyData(new Uint8Array(dataArray));
          requestAnimationFrame(updateFrequencyData);
        }
      };
      
      updateFrequencyData();
    };

    setupAnalyser();
  }, [currentTrack]);

  return { analyser, frequencyData };
};

export default useAudioPlayer;