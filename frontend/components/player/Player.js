import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  PlayIcon, 
  PauseIcon, 
  ForwardIcon, 
  BackwardIcon, 
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathRoundedSquareIcon,
  QueueListIcon
} from '@heroicons/react/24/solid';
import { 
  togglePlayPause, 
  setProgress, 
  setDuration, 
  playNext, 
  setVolume,
  toggleRepeat,
  toggleShuffle
} from '../../utils/slices/playerSlice';

const Player = () => {
  const dispatch = useDispatch();
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    progress, 
    duration,
    repeat,
    shuffle,
    queue
  } = useSelector((state) => state.player);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [showVolume, setShowVolume] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  
  // Initialize audio when track changes
  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Playback failed:', err);
        });
      }
    }
  }, [currentTrack]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Playback failed:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Handle seeking
  const handleSeek = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    const seekTime = percent * duration;
    
    dispatch(setProgress(seekTime));
    audioRef.current.currentTime = seekTime;
  };
  
  // Format time (seconds -> MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-20">
      <audio 
        ref={audioRef}
        onTimeUpdate={() => dispatch(setProgress(audioRef.current.currentTime))}
        onDurationChange={() => dispatch(setDuration(audioRef.current.duration))}
        onEnded={() => {
          if (repeat === 'one') {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            dispatch(playNext());
          }
        }}
      />
      
      <div className="flex items-center">
        {/* Track info */}
        <div className="flex items-center flex-1 md:flex-none md:w-1/4">
          {currentTrack?.coverUrl && (
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className="w-12 h-12 rounded-md mr-3 object-cover"
            />
          )}
          <div className="truncate">
            <div className="font-medium truncate">{currentTrack?.title}</div>
            <div className="text-sm text-gray-500 truncate">{currentTrack?.artist}</div>
          </div>
        </div>
        
        {/* Player controls */}
        <div className="hidden md:flex flex-col items-center flex-1">
          <div className="flex items-center space-x-4">
            {/* Shuffle button */}
            <button 
              onClick={() => dispatch(toggleShuffle())}
              className={`p-1 rounded-full focus:outline-none ${
                shuffle ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 4.5a5.5 5.5 0 105.5 5.5.75.75 0 011.5 0 7 7 0 11-7-7 .75.75 0 010 1.5zM10 3a7 7 0 100 14 7 7 0 000-14z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Previous button */}
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => {
                if (audioRef.current.currentTime > 3) {
                  audioRef.current.currentTime = 0;
                } else {
                  // Go to previous track logic would go here
                }
              }}
            >
              <BackwardIcon className="w-5 h-5" />
            </button>
            
            {/* Play/Pause button */}
            <button 
              className="p-2 bg-primary text-white rounded-full focus:outline-none hover:bg-primary-dark"
              onClick={() => dispatch(togglePlayPause())}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
            
            {/* Next button */}
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => dispatch(playNext())}
            >
              <ForwardIcon className="w-5 h-5" />
            </button>
            
            {/* Repeat button */}
            <button 
              onClick={() => dispatch(toggleRepeat())}
              className={`p-1 rounded-full focus:outline-none ${
                repeat !== 'off' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowPathRoundedSquareIcon className="w-5 h-5" />
              {repeat === 'one' && (
                <span className="absolute text-xs font-bold">1</span>
              )}
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full flex items-center mt-2 space-x-2">
            <span className="text-xs text-gray-500">{formatTime(progress)}</span>
            <div 
              ref={progressBarRef}
              className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${(progress / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume and queue controls */}
        <div className="hidden md:flex items-center justify-end flex-1 md:w-1/4 space-x-4">
          {/* Volume control */}
          <div className="relative">
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowVolume(!showVolume)}
            >
              {volume === 0 ? (
                <SpeakerXMarkIcon className="w-5 h-5" />
              ) : (
                <SpeakerWaveIcon className="w-5 h-5" />
              )}
            </button>
            
            {showVolume && (
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 bg-white p-3 rounded-md shadow-lg border border-gray-200">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {/* Queue button */}
          <div className="relative">
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowQueue(!showQueue)}
            >
              <QueueListIcon className="w-5 h-5" />
              {queue.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center">
                  {queue.length}
                </span>
              )}
            </button>
            
            {showQueue && (
              <div className="absolute bottom-10 right-0 w-64 bg-white rounded-md shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-gray-200 font-medium">Queue</div>
                {queue.length > 0 ? (
                  <div className="p-2">
                    {queue.map((track, index) => (
                      <div key={`${track.id}-${index}`} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                        {track.coverUrl && (
                          <img 
                            src={track.coverUrl} 
                            alt={track.title} 
                            className="w-10 h-10 rounded-md mr-3 object-cover"
                          />
                        )}
                        <div className="truncate">
                          <div className="font-medium truncate">{track.title}</div>
                          <div className="text-sm text-gray-500 truncate">{track.artist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-gray-500">Queue is empty</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile player controls */}
        <div className="flex items-center space-x-4 md:hidden ml-auto">
          <button 
            className="p-1 text-gray-500 focus:outline-none"
            onClick={() => dispatch(togglePlayPause())}
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </button>
          
          <button 
            className="p-1 text-gray-500 focus:outline-none"
            onClick={() => dispatch(playNext())}
          >
            <ForwardIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile progress bar */}
      <div className="md:hidden w-full mt-1">
        <div 
          ref={progressBarRef}
          className="h-1 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${(progress / duration) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Player;