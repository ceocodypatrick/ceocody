import { useState } from 'react';
import Link from 'next/link';
import { 
  PlayIcon, 
  PauseIcon, 
  EllipsisHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrack, togglePlayPause } from '../../utils/slices/playerSlice';

const TrackList = ({ 
  tracks = [], 
  isLoading = false, 
  showArtist = false,
  showAlbum = true,
  showReleaseDate = true,
  showDuration = true,
  showPlays = true,
  showActions = true,
  onDelete = null,
  onEdit = null,
  className = ''
}) => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.player);
  const [sortField, setSortField] = useState('releaseDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedTracks, setSelectedTracks] = useState([]);
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort tracks
  const sortedTracks = [...tracks].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle nested fields like artist.name
    if (sortField === 'artist.name') {
      aValue = a.artist?.name || '';
      bValue = b.artist?.name || '';
    }
    
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle number comparison
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });
  
  // Handle play/pause
  const handlePlayPause = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setCurrentTrack(track));
    }
  };
  
  // Handle track selection
  const handleSelectTrack = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedTracks.length === tracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(tracks.map(track => track.id));
    }
  };
  
  // Handle bulk actions
  const handleBulkDelete = () => {
    if (onDelete && selectedTracks.length > 0) {
      onDelete(selectedTracks);
      setSelectedTracks([]);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (tracks.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No tracks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading your first track.
          </p>
          <div className="mt-6">
            <Link href="/tracks/upload" className="btn btn-primary">
              Upload Track
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-light overflow-hidden ${className}`}>
      {/* Bulk actions */}
      {selectedTracks.length > 0 && (
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{selectedTracks.length}</span> tracks selected
          </div>
          <div className="flex space-x-2">
            <button 
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
              onClick={() => setSelectedTracks([])}
            >
              Deselect All
            </button>
            <button 
              className="text-sm text-red-600 hover:text-red-900 flex items-center"
              onClick={handleBulkDelete}
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Table header */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedTracks.length === tracks.length && tracks.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col" className="px-4 py-3 w-10"></th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center focus:outline-none"
                  onClick={() => handleSort('title')}
                >
                  Title
                  {sortField === 'title' && (
                    sortDirection === 'asc' ? 
                    <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
                    <ArrowDownIcon className="h-3 w-3 ml-1" />
                  )}
                </button>
              </th>
              {showArtist && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort('artist.name')}
                  >
                    Artist
                    {sortField === 'artist.name' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
                      <ArrowDownIcon className="h-3 w-3 ml-1" />
                    )}
                  </button>
                </th>
              )}
              {showAlbum && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort('releaseTitle')}
                  >
                    Album
                    {sortField === 'releaseTitle' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
                      <ArrowDownIcon className="h-3 w-3 ml-1" />
                    )}
                  </button>
                </th>
              )}
              {showReleaseDate && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort('releaseDate')}
                  >
                    Date
                    {sortField === 'releaseDate' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
                      <ArrowDownIcon className="h-3 w-3 ml-1" />
                    )}
                  </button>
                </th>
              )}
              {showDuration && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort('duration')}
                  >
                    Duration
                    {sortField === 'duration' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
                      <ArrowDownIcon className="h-3 w-3 ml-1" />
                    )}
                  </button>
                </th>
              )}
              {showPlays && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSort('plays')}
                  >
                    Plays
                    {sortField === 'plays' && (
                      sortDirection === 'asc' ? 
                      <ArrowUpIcon className="h-3 w-3 ml-1" /> : 
                      <ArrowDownIcon className="h-3 w-3 ml-1" />
                    )}
                  </button>
                </th>
              )}
              {showActions && (
                <th scope="col" className="px-4 py-3 w-10"></th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTracks.map((track) => (
              <tr 
                key={track.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedTracks.includes(track.id)}
                    onChange={() => handleSelectTrack(track.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark focus:outline-none"
                    onClick={() => handlePlayPause(track)}
                  >
                    {currentTrack && currentTrack.id === track.id && isPlaying ? (
                      <PauseIcon className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    {track.coverUrl && (
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="h-10 w-10 rounded object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{track.title}</div>
                      {!showArtist && track.artist && (
                        <div className="text-sm text-gray-500">{track.artist.name}</div>
                      )}
                    </div>
                  </div>
                </td>
                {showArtist && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{track.artist?.name}</div>
                  </td>
                )}
                {showAlbum && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{track.releaseTitle || 'Single'}</div>
                  </td>
                )}
                {showReleaseDate && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(track.releaseDate)}</div>
                  </td>
                )}
                {showDuration && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDuration(track.duration)}</div>
                  </td>
                )}
                {showPlays && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatNumber(track.plays || 0)}</div>
                  </td>
                )}
                {showActions && (
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <div className="dropdown">
                        <button className="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                          <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        <div className="dropdown-menu hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1" role="none">
                            <Link href={`/tracks/${track.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View Details
                            </Link>
                            {onEdit && (
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => onEdit(track.id)}
                              >
                                Edit Track
                              </button>
                            )}
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Share Track
                            </button>
                            {onDelete && (
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => onDelete([track.id])}
                              >
                                Delete Track
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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

export default TrackList;