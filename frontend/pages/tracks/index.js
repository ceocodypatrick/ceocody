import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import TrackList from '../../components/tracks/TrackList';
import { 
  PlusIcon,
  ArrowUpTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const TracksPage = () => {
  const router = useRouter();
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    releaseType: '',
    releaseDate: '',
    sortBy: 'releaseDate',
    sortOrder: 'desc'
  });
  
  // Fetch tracks
  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For the prototype, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock tracks data
        const mockTracks = [
          {
            id: 'track1',
            title: 'Midnight Dreams',
            artist: {
              id: '123',
              name: 'James Wilson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            duration: 215,
            releaseDate: '2025-05-15',
            releaseTitle: 'Midnight Dreams EP',
            genre: ['Electronic'],
            plays: 124578
          },
          {
            id: 'track2',
            title: 'Electric Dreams',
            artist: {
              id: '456',
              name: 'Sarah Johnson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            duration: 187,
            releaseDate: '2025-04-22',
            releaseTitle: 'Summer Vibes',
            genre: ['Pop'],
            plays: 98765
          },
          {
            id: 'track3',
            title: 'Midnight Blues',
            artist: {
              id: '101',
              name: 'Marcus Green'
            },
            coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            duration: 242,
            releaseDate: '2025-03-10',
            releaseTitle: 'Midnight Blues',
            genre: ['Jazz'],
            plays: 45678
          },
          {
            id: 'track4',
            title: 'Urban Jungle',
            artist: {
              id: '102',
              name: 'The City Sounds'
            },
            coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            duration: 198,
            releaseDate: '2025-02-28',
            releaseTitle: 'Urban Jungle',
            genre: ['Hip Hop'],
            plays: 67890
          },
          {
            id: 'track5',
            title: 'Neon Lights',
            artist: {
              id: '103',
              name: 'Electro Dreams'
            },
            coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            duration: 225,
            releaseDate: '2025-01-15',
            releaseTitle: 'Neon Lights',
            genre: ['Electronic'],
            plays: 34567
          },
          {
            id: 'track6',
            title: 'Summer Vibes',
            artist: {
              id: '123',
              name: 'James Wilson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            duration: 210,
            releaseDate: '2025-03-22',
            releaseTitle: 'Summer Vibes',
            genre: ['Pop'],
            plays: 89245
          }
        ];
        
        setTracks(mockTracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle track edit
  const handleEditTrack = (trackId) => {
    router.push(`/tracks/${trackId}/edit`);
  };
  
  // Handle track delete
  const handleDeleteTrack = (trackIds) => {
    // In a real app, this would call an API to delete the track
    // For the prototype, we'll just remove it from the state
    setTracks(prev => prev.filter(track => !trackIds.includes(track.id)));
  };
  
  // Filter and sort tracks
  const filteredTracks = tracks.filter(track => {
    // Search filter
    if (searchTerm && !track.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Genre filter
    if (filters.genre && (!track.genre || !track.genre.includes(filters.genre))) {
      return false;
    }
    
    // Release type filter (would need to be implemented in a real app)
    
    // Release date filter
    if (filters.releaseDate) {
      const date = new Date(track.releaseDate);
      const year = date.getFullYear();
      
      if (filters.releaseDate === 'thisYear' && year !== new Date().getFullYear()) {
        return false;
      } else if (filters.releaseDate === 'lastYear' && year !== new Date().getFullYear() - 1) {
        return false;
      }
      // Add more date filters as needed
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected field
    const field = filters.sortBy;
    let aValue = a[field];
    let bValue = b[field];
    
    // Handle nested fields
    if (field === 'artist.name') {
      aValue = a.artist?.name || '';
      bValue = b.artist?.name || '';
    }
    
    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return filters.sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Handle number comparison
    return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
  
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
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
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
            {(filters.genre || filters.releaseType || filters.releaseDate || 
              filters.sortBy !== 'releaseDate' || filters.sortOrder !== 'desc') && (
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
                  value={filters.genre}
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
                  value={filters.releaseType}
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
                  Release Date
                </label>
                <select
                  name="releaseDate"
                  value={filters.releaseDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">All Time</option>
                  <option value="thisYear">This Year</option>
                  <option value="lastYear">Last Year</option>
                  <option value="last30Days">Last 30 Days</option>
                  <option value="last7Days">Last 7 Days</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="releaseDate">Release Date</option>
                    <option value="title">Title</option>
                    <option value="plays">Plays</option>
                    <option value="duration">Duration</option>
                  </select>
                  
                  <select
                    name="sortOrder"
                    value={filters.sortOrder}
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
                onClick={() => {
                  setFilters({
                    genre: '',
                    releaseType: '',
                    releaseDate: '',
                    sortBy: 'releaseDate',
                    sortOrder: 'desc'
                  });
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Track list */}
      <TrackList
        tracks={filteredTracks}
        isLoading={isLoading}
        onEdit={handleEditTrack}
        onDelete={handleDeleteTrack}
      />
    </MainLayout>
  );
};

export default TracksPage;