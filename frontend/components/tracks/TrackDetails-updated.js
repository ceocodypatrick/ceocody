import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlayIcon, 
  PauseIcon,
  HeartIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  ChartBarIcon,
  MusicalNoteIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  GlobeAltIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrack, togglePlayPause } from '../../utils/slices/playerSlice';
import { useTracks } from '../../utils/hooks';

const TrackDetails = ({ 
  trackId,
  onEdit = null,
  className = ''
}) => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.player);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use the custom tracks hook
  const { 
    currentTrack: track, 
    isLoading, 
    error, 
    loadTrack,
    fetchTrackAnalytics,
    analytics
  } = useTracks();
  
  // Load track on component mount
  useEffect(() => {
    if (trackId) {
      loadTrack(trackId);
    }
  }, [trackId]);
  
  // Load track analytics when on stats tab
  useEffect(() => {
    if (trackId && activeTab === 'stats' && !analytics[trackId]) {
      fetchTrackAnalytics(trackId, { timeframe: '30days' });
    }
  }, [trackId, activeTab]);
  
  // Format number with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause
  const handlePlayPause = () => {
    if (currentTrack && currentTrack._id === track._id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setCurrentTrack(track));
    }
  };
  
  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would call an API to like/unlike the track
  };
  
  // Handle share
  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert('Share functionality will be implemented in the full version.');
  };
  
  // Handle download
  const handleDownload = () => {
    // In a real app, this would trigger a download
    alert('Download functionality will be implemented in the full version.');
  };
  
  if (isLoading || !track) {
    return (
      <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 h-64 bg-gray-200 rounded-lg mb-4 md:mb-0 md:mr-6"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Error loading track</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button 
              onClick={() => loadTrack(trackId)} 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const trackAnalytics = analytics[trackId] || {};
  
  return (
    <div className={`bg-white rounded-lg shadow-light overflow-hidden ${className}`}>
      {/* Track header */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row">
          {/* Track cover */}
          <div className="w-full md:w-64 mb-4 md:mb-0 md:mr-6">
            <div 
              className="w-full h-64 bg-cover bg-center rounded-lg shadow-md"
              style={{ backgroundImage: `url(${track.coverUrl})` }}
            ></div>
          </div>
          
          {/* Track info */}
          <div className="flex-1">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <span>{track.type || 'Single'}</span>
              {track.isExplicit && (
                <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                  Explicit
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{track.title}</h1>
            
            <div className="flex items-center mb-4">
              <Link href={`/artists/${track.artist?._id || '#'}`} className="text-lg text-gray-700 hover:text-primary">
                {track.artist?.name || 'Unknown Artist'}
              </Link>
              
              {track.featuring && track.featuring.length > 0 && (
                <span className="text-gray-500 ml-1">
                  feat. {track.featuring.map(artist => artist.name).join(', ')}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatDuration(track.duration)}
              </div>
              
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(track.releaseDate)}
              </div>
              
              <div className="flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                {formatNumber(track.plays || 0)} plays
              </div>
              
              {track.genre && track.genre.length > 0 && (
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-1" />
                  {Array.isArray(track.genre) ? track.genre.join(', ') : track.genre}
                </div>
              )}
              
              {track.language && (
                <div className="flex items-center">
                  <LanguageIcon className="h-4 w-4 mr-1" />
                  {track.language}
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark focus:outline-none"
                onClick={handlePlayPause}
              >
                {currentTrack && currentTrack._id === track._id && isPlaying ? (
                  <>
                    <PauseIcon className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Play
                  </>
                )}
              </button>
              
              <button 
                className={`flex items-center px-4 py-2 border rounded-full focus:outline-none ${
                  isLiked 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
                onClick={handleLike}
              >
                {isLiked ? (
                  <HeartIconSolid className="h-5 w-5 mr-2 text-primary" />
                ) : (
                  <HeartIcon className="h-5 w-5 mr-2" />
                )}
                {isLiked ? 'Liked' : 'Like'}
              </button>
              
              <button 
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:border-gray-400 focus:outline-none"
                onClick={handleShare}
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share
              </button>
              
              <button 
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:border-gray-400 focus:outline-none"
                onClick={handleDownload}
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download
              </button>
              
              {onEdit && (
                <button 
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:border-gray-400 focus:outline-none"
                  onClick={() => onEdit(track._id)}
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex overflow-x-auto">
          <button 
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          
          <button 
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'lyrics' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('lyrics')}
          >
            Lyrics
          </button>
          
          <button 
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'credits' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('credits')}
          >
            Credits
          </button>
          
          <button 
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'stats' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="p-5 md:p-6">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div>
            {track.description ? (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-700">{track.description}</p>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-500 italic">No description available.</p>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Release Date</span>
                    <span className="font-medium">{formatDate(track.releaseDate)}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium">{formatDuration(track.duration)}</span>
                  </div>
                  
                  {track.bpm && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">BPM</span>
                      <span className="font-medium">{track.bpm}</span>
                    </div>
                  )}
                  
                  {track.key && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Key</span>
                      <span className="font-medium">{track.key}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  {track.isrc && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">ISRC</span>
                      <span className="font-medium">{track.isrc}</span>
                    </div>
                  )}
                  
                  {track.copyright && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Copyright</span>
                      <span className="font-medium">© {track.copyright.year} {track.copyright.holder}</span>
                    </div>
                  )}
                  
                  {track.language && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Language</span>
                      <span className="font-medium">{track.language}</span>
                    </div>
                  )}
                  
                  {track.recordedDate && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Recorded</span>
                      <span className="font-medium">{formatDate(track.recordedDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {track.tags && track.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Lyrics tab */}
        {activeTab === 'lyrics' && (
          <div>
            {track.lyrics ? (
              <div className="whitespace-pre-line text-gray-700">
                {track.lyrics}
              </div>
            ) : (
              <div className="text-center py-10">
                <MusicalNoteIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No lyrics available</h3>
                <p className="mt-1 text-gray-500">
                  Lyrics haven't been added for this track yet.
                </p>
                {onEdit && (
                  <div className="mt-6">
                    <button 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
                      onClick={() => onEdit(track._id)}
                    >
                      Add Lyrics
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Credits tab */}
        {activeTab === 'credits' && (
          <div>
            {track.credits && track.credits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {track.credits.map((credit, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{credit.role}</span>
                    <span className="font-medium">{credit.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <MusicalNoteIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No credits available</h3>
                <p className="mt-1 text-gray-500">
                  Credits haven't been added for this track yet.
                </p>
                {onEdit && (
                  <div className="mt-6">
                    <button 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
                      onClick={() => onEdit(track._id)}
                    >
                      Add Credits
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div>
            {trackAnalytics.isLoading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
                <div className="h-64 bg-gray-100 rounded-lg mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-48 bg-gray-100 rounded-lg"></div>
                  <div className="h-48 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ) : trackAnalytics.error ? (
              <div className="text-center py-10">
                <div className="text-red-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading analytics</h3>
                <p className="mt-1 text-gray-500">{trackAnalytics.error}</p>
                <div className="mt-6">
                  <button 
                    onClick={() => fetchTrackAnalytics(trackId, { timeframe: '30days' })} 
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Total Plays</div>
                    <div className="text-2xl font-bold">{formatNumber(trackAnalytics.totalPlays || track.plays || 0)}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Likes</div>
                    <div className="text-2xl font-bold">{formatNumber(trackAnalytics.totalLikes || 0)}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Saves</div>
                    <div className="text-2xl font-bold">{formatNumber(trackAnalytics.totalSaves || 0)}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Performance</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
                      <p>Detailed performance analytics will be available in the full version.</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Top Countries</h3>
                    <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <GlobeAltIcon className="h-10 w-10 mx-auto mb-2" />
                        <p>Geographic data will be available in the full version.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Listener Demographics</h3>
                    <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <ChartBarIcon className="h-10 w-10 mx-auto mb-2" />
                        <p>Demographic data will be available in the full version.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDetails;