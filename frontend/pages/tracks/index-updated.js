import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import TrackList from '../../components/tracks/TrackList-updated';
import { 
  PlusIcon,
  ArrowUpTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTracks } from '../../utils/hooks';

const TracksPage = () => {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the custom tracks hook
  const { 
    tracks, 
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    resetFilters,
    loadTracks
  } = useTracks();
  
  // Load tracks on component mount
  useEffect(() => {
    loadTracks();
  }, []);
  
  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        updateFilters({ search: searchTerm });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };
  
  // Handle track edit
  const handleEditTrack = (trackId) => {
    router.push(`/tracks/${trackId}/edit`);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    resetFilters();
  };
  
  return (
    <MainLayout>
      <Head>
        <title>Tracks | HARMONI</title>
        <meta name="description" content="Manage your music tracks" />
      </Head>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Tracks</h1>
            <p className="text-gray-600">Manage and organize your music</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/tracks/upload" 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center justify-center"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-1" />
              Upload Tracks
            </Link>
          </div>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => {
                  setSearchTerm('');
                  updateFilters({ search: '' });
                }}
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
          
          <button
            className={`px-4 py-2 border rounded-md flex items-center ${
              showFilters ? 'bg-gray-100 border-gray-400' : 'border-gray-300'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
            {(filters.genre || filters.releaseType || filters.timeframe || 
              filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') && (
              <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  name="genre"
                  value={filters.genre || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">All Genres</option>
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Jazz">Jazz</option>
                  <option value="R&B">R&B</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Release Type
                </label>
                <select
                  name="releaseType"
                  value={filters.releaseType || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">All Types</option>
                  <option value="single">Singles</option>
                  <option value="ep">EPs</option>
                  <option value="album">Albums</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Frame
                </label>
                <select
                  name="timeframe"
                  value={filters.timeframe || ''}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">All Time</option>
                  <option value="year">This Year</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                  <option value="day">Today</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select
                    name="sortBy"
                    value={filters.sortBy || 'createdAt'}
                    onChange={handleFilterChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="releaseDate">Release Date</option>
                    <option value="title">Title</option>
                    <option value="plays">Plays</option>
                    <option value="duration">Duration</option>
                  </select>
                  
                  <select
                    name="sortOrder"
                    value={filters.sortOrder || 'desc'}
                    onChange={handleFilterChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Track list */}
      <TrackList
        showArtist={true}
        onEdit={handleEditTrack}
      />
    </MainLayout>
  );
};

export default TracksPage;