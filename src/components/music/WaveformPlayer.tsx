import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { Button } from '../ui/Button';

interface WaveformPlayerProps {
  audioUrl: string;
  title?: string;
  artist?: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioUrl,
  title,
  artist,
  onEnded,
  autoPlay = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Generate waveform visualization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      generateWaveform();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, onEnded]);

  // Generate simple waveform data
  const generateWaveform = () => {
    const bars = 100;
    const data: number[] = [];
    
    for (let i = 0; i < bars; i++) {
      // Create a more realistic waveform pattern
      const baseHeight = Math.random() * 0.5 + 0.3;
      const variation = Math.sin(i / 10) * 0.2;
      data.push(Math.min(1, Math.max(0.1, baseHeight + variation)));
    }
    
    setWaveformData(data);
  };

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / waveformData.length;
      const progress = duration > 0 ? currentTime / duration : 0;

      ctx.clearRect(0, 0, width, height);

      waveformData.forEach((value, index) => {
        const barHeight = value * height * 0.8;
        const x = index * barWidth;
        const y = (height - barHeight) / 2;

        // Determine if this bar is in the played portion
        const barProgress = index / waveformData.length;
        const isPlayed = barProgress <= progress;

        // Set color based on play state
        if (isPlayed) {
          ctx.fillStyle = '#6366f1'; // Primary color for played portion
        } else {
          ctx.fillStyle = '#374151'; // Gray for unplayed portion
        }

        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });
    };

    draw();
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveformData, currentTime, duration, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Track Info */}
      {(title || artist) && (
        <div className="text-center">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {artist && (
            <p className="text-sm text-gray-400">{artist}</p>
          )}
        </div>
      )}

      {/* Waveform */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={100}
          className="w-full h-24 cursor-pointer rounded"
          onClick={handleSeek}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={skipBackward}
          disabled={isLoading}
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          size="lg"
          onClick={togglePlay}
          disabled={isLoading}
          className="rounded-full w-12 h-12"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={skipForward}
          disabled={isLoading}
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #6366f1;
          cursor: pointer;
          border-radius: 50%;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #6366f1;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
};