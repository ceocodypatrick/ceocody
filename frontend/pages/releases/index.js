import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import ReleaseList from '../../components/releases/ReleaseList';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ReleasesPage = () => {
  const router = useRouter();
  const [releases, setReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch releases
  useEffect(() => {
    const fetchReleases = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For the prototype, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock releases data
        const mockReleases = [
          {
            id: 'release1',
            title: 'Midnight Dreams',
            type: 'Single',
            artist: {
              id: '123',
              name: 'James Wilson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-05-15',
            tracks: ['track1'],
            totalTracks: 1,
            totalDuration: 215, // in seconds
            streams: 124578,
            visibility: 'public'
          },
          {
            id: 'release2',
            title: 'Electric Dreams EP',
            type: 'EP',
            artist: {
              id: '456',
              name: 'Sarah Johnson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-01-10',
            tracks: ['track2', 'track7', 'track8', 'track9'],
            totalTracks: 4,
            totalDuration: 845, // in seconds
            streams: 215689,
            visibility: 'public'
          },
          {
            id: 'release3',
            title: 'Midnight Blues',
            type: 'Single',
            artist: {
              id: '101',
              name: 'Marcus Green'
            },
            coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-03-10',
            tracks: ['track3'],
            totalTracks: 1,
            totalDuration: 242, // in seconds
            streams: 45678,
            visibility: 'public'
          },
          {
            id: 'release4',
            title: 'Urban Jungle',
            type: 'Single',
            artist: {
              id: '102',
              name: 'The City Sounds'
            },
            coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-02-28',
            tracks: ['track4'],
            totalTracks: 1,
            totalDuration: 198, // in seconds
            streams: 67890,
            visibility: 'private'
          },
          {
            id: 'release5',
            title: 'Neon Lights',
            type: 'Single',
            artist: {
              id: '103',
              name: 'Electro Dreams'
            },
            coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-01-15',
            tracks: ['track5'],
            totalTracks: 1,
            totalDuration: 225, // in seconds
            streams: 34567,
            visibility: 'public'
          },
          {
            id: 'release6',
            title: 'Summer Vibes',
            type: 'Single',
            artist: {
              id: '123',
              name: 'James Wilson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-03-22',
            tracks: ['track6'],
            totalTracks: 1,
            totalDuration: 210, // in seconds
            streams: 89245,
            visibility: 'scheduled'
          }
        ];
        
        setReleases(mockReleases);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReleases();
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle release edit
  const handleEditRelease = (releaseId) => {
    router.push(`/releases/${releaseId}/edit`);
  };
  
  // Handle release delete
  const handleDeleteRelease = (releaseId) => {
    // In a real app, this would call an API to delete the release
    // For the prototype, we'll just remove it from the state
    setReleases(prev => prev.filter(release => release.id !== releaseId));
  };
  
  // Filter releases by search term
  const filteredReleases = releases.filter(release => {
    if (!searchTerm) return true;
    
    return (
      release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  return (
    <MainLayout>
      <Head>
        <title>Releases | HARMONI</title>
        <meta name="description" content="Manage your music releases" />
      </Head>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Releases</h1>
            <p className="text-gray-600">Manage and distribute your music</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search releases..."
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
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center justify-center"
              onClick={() => router.push('/releases/new')}
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              New Release
            </button>
          </div>
        </div>
      </div>
      
      {/* Release stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-sm text-gray-500 mb-1">Total Releases</div>
          <div className="text-2xl font-bold">{releases.length}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-sm text-gray-500 mb-1">Total Streams</div>
          <div className="text-2xl font-bold">
            {releases.reduce((sum, release) => sum + (release.streams || 0), 0).toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-sm text-gray-500 mb-1">Latest Release</div>
          <div className="text-lg font-bold truncate">
            {releases.length > 0 
              ? releases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))[0].title
              : 'None'
            }
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-sm text-gray-500 mb-1">Release Types</div>
          <div className="text-lg">
            <span className="font-bold">{releases.filter(r => r.type === 'Single').length}</span> Singles, 
            <span className="font-bold ml-1">{releases.filter(r => r.type === 'EP').length}</span> EPs, 
            <span className="font-bold ml-1">{releases.filter(r => r.type === 'Album').length}</span> Albums
          </div>
        </div>
      </div>
      
      {/* Release list */}
      <ReleaseList
        releases={filteredReleases}
        isLoading={isLoading}
        onEdit={handleEditRelease}
        onDelete={handleDeleteRelease}
      />
      
      {/* Distribution tips */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Distribution Tips</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-light p-5">
            <div className="text-primary mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Release Planning</h3>
            <p className="text-gray-600">
              Plan your release at least 3-4 weeks in advance to allow time for distribution and playlist pitching. Friday releases often perform best for streaming platforms.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            <div className="text-primary mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Promotion Strategy</h3>
            <p className="text-gray-600">
              Create a comprehensive promotion plan including social media, email marketing, and playlist pitching. Build anticipation with pre-save campaigns and teasers.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            <div className="text-primary mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Track Performance</h3>
            <p className="text-gray-600">
              Monitor your release performance across all platforms. Analyze listener demographics and engagement to refine your strategy for future releases.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReleasesPage;