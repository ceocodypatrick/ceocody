import { useState } from 'react';
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
  LanguageIcon,
  QueueListIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrack, togglePlayPause, addToQueue } from '../../utils/slices/playerSlice';

const ReleaseDetails = ({ 
  release = null,
  isLoading = false,
  onEdit = null,
  className = ''
}) => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.player);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('tracks');
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate total duration
  const calculateTotalDuration = (tracks) => {
    const totalSeconds = tracks.reduce((total, track) => total + track.duration, 0);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes} min ${seconds} sec`;
  };
  
  // Handle play/pause for a track
  const handlePlayTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setCurrentTrack(track));
    }
  };
  
  // Handle play all
  const handlePlayAll = () => {
    if (release.tracks && release.tracks.length > 0) {
      // Play the first track
      dispatch(setCurrentTrack(release.tracks[0]));
      
      // Add the rest to the queue
      if (release.tracks.length > 1) {
        for (let i = 1; i < release.tracks.length; i++) {
          dispatch(addToQueue(release.tracks[i]));
        }
      }
    }
  };
  
  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would call an API to like/unlike the release
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
  
  if (isLoading || !release) {
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
  
  return (
    <div className={`bg-white rounded-lg shadow-light overflow-hidden ${className}`}>
      {/* Release header */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row">
          {/* Release cover */}
          <div className="w-full md:w-64 mb-4 md:mb-0 md:mr-6">
            <div 
              className="w-full h-64 bg-cover bg-center rounded-lg shadow-md"
              style={{ backgroundImage: `url(${release.coverUrl})` }}
            ></div>
          </div>
          
          {/* Release info */}
          <div className="flex-1">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <span className="capitalize">{release.type}</span>
              {release.totalTracks > 1 && (
                <span className="ml-2">• {release.totalTracks} tracks</span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{release.title}</h1>
            
            <div className="flex items-center mb-4">
              <Link href={`/artists/${release.artist.id}`} className="text-lg text-gray-700 hover:text-primary">
                {release.artist.name}
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(release.releaseDate)}
              </div>
              
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {calculateTotalDuration(release.tracks)}
              </div>
              
              <div className="flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                {formatNumber(release.streams || 0)} streams
              </div>
              
              {release.genres && release.genres.length > 0 && (
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-1" />
                  {release.genres.join(', ')}
                </div>
              )}
              
              {release.language && (
                <div className="flex items-center">
                  <LanguageIcon className="h-4 w-4 mr-1" />
                  {release.language}
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                className="flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark focus:outline-none"
                onClick={handlePlayAll}
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Play All
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
                  onClick={() => onEdit(release.id)}
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
              activeTab === 'tracks' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tracks')}
          >
            Tracks
          </button>
          
          <button 
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'about' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('about')}
          >
            About
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
              activeTab === 'analytics' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="p-5 md:p-6">
        {/* Tracks tab */}
        {activeTab === 'tracks' && (
          <div>
            {release.tracks && release.tracks.length > 0 ? (
              <div className="space-y-2">
                {release.tracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex-shrink-0 mr-4">
                        <button 
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                          onClick={() => handlePlayTrack(track)}
                        >
                          {currentTrack && currentTrack.id === track.id && isPlaying ? (
                            <PauseIcon className="h-5 w-5" />
                          ) : (
                            <PlayIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-gray-500 w-6 text-right mr-4">{track.trackNumber}</span>
                          <div>
                            <div className="font-medium truncate">{track.title}</div>
                            {track.featuring && track.featuring.length > 0 && (
                              <div className="text-sm text-gray-500 truncate">
                                feat. {track.featuring.map(artist => artist.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-4">{formatDuration(track.duration)}</span>
                      
                      <div className="relative">
                        <div className="dropdown">
                          <button className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none">
                            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                          </button>
                          <div className="dropdown-menu hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1" role="none">
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => dispatch(addToQueue(track))}
                              >
                                Add to Queue
                              </button>
                              <Link href={`/tracks/${track.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                View Track Details
                              </Link>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Share Track
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <MusicalNoteIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No tracks available</h3>
                <p className="mt-1 text-gray-500">
                  This release doesn't have any tracks yet.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* About tab */}
        {activeTab === 'about' && (
          <div>
            {release.description ? (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-700">{release.description}</p>
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
                    <span className="font-medium">{formatDate(release.releaseDate)}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Release Type</span>
                    <span className="font-medium capitalize">{release.type}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Total Tracks</span>
                    <span className="font-medium">{release.totalTracks}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Total Duration</span>
                    <span className="font-medium">{calculateTotalDuration(release.tracks)}</span>
                  </div>
                </div>
                
                <div>
                  {release.upc && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">UPC</span>
                      <span className="font-medium">{release.upc}</span>
                    </div>
                  )}
                  
                  {release.recordLabel && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Record Label</span>
                      <span className="font-medium">{release.recordLabel}</span>
                    </div>
                  )}
                  
                  {release.language && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Language</span>
                      <span className="font-medium">{release.language}</span>
                    </div>
                  )}
                  
                  {release.copyright && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Copyright</span>
                      <span className="font-medium">© {release.copyright.year} {release.copyright.holder}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {release.genres && release.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {release.genres.map((genre, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {release.platforms && release.platforms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Available On</h3>
                <div className="flex flex-wrap gap-3">
                  {release.platforms.map((platform, index) => (
                    <a 
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Credits tab */}
        {activeTab === 'credits' && (
          <div>
            {release.credits && release.credits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {release.credits.map((credit, index) => (
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
                  Credits haven't been added for this release yet.
                </p>
                {onEdit && (
                  <div className="mt-6">
                    <button 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
                      onClick={() => onEdit(release.id)}
                    >
                      Add Credits
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Analytics tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Total Streams</div>
                <div className="text-2xl font-bold">{formatNumber(release.streams || 0)}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Saves</div>
                <div className="text-2xl font-bold">{formatNumber(release.stats?.saves || 0)}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Playlist Adds</div>
                <div className="text-2xl font-bold">{formatNumber(release.stats?.playlistAdds || 0)}</div>
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
                <h3 className="text-lg font-medium mb-4">Platform Breakdown</h3>
                <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ChartBarIcon className="h-10 w-10 mx-auto mb-2" />
                    <p>Platform data will be available in the full version.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href={`/analytics/releases/${release.id}`}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark inline-flex items-center"
              >
                <ChartBarIcon className="h-5 w-5 mr-2" />
                View Full Analytics
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Add some JavaScript to handle dropdown menus */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
              const button = dropdown.querySelector('button');
              const menu = dropdown.querySelector('.dropdown-menu');
              
              button.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
              });
              
              document.addEventListener('click', () => {
                menu.classList.add('hidden');
              });
            });
          });
        `
      }} />
    </div>
  );
};

export default ReleaseDetails;