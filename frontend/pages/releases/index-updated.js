import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import ReleaseList from '../../components/releases/ReleaseList-updated';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useReleases } from '../../utils/hooks';

const ReleasesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the custom releases hook
  const { 
    releases, 
    isLoading, 
    error, 
    loadReleases, 
    updateFilters,
    filters,
    totalReleases
  } = useReleases();
  
  // Load releases on component mount
  useEffect(() => {
    loadReleases();
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
  
  // Handle release edit
  const handleEditRelease = (releaseId) => {
    router.push(`/releases/${releaseId}/edit`);
  };
  
  // Calculate total streams
  const totalStreams = releases.reduce((sum, release) => sum + (release.streams || 0), 0);
  
  // Get latest release
  const latestRelease = releases.length > 0 
    ? [...releases].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))[0]
    : null;
  
  // Count release types
  const singleCount = releases.filter(r => r.type === 'single').length;
  const epCount = releases.filter(r => r.type === 'ep').length;
  const albumCount = releases.filter(r => r.type === 'album').length;
  
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
          <div className="text-2xl font-bold">{totalReleases}</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-sm text-gray-500 mb-1">Total Streams</div>
          <div className="text-2xl font-bold">
            {totalStreams.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-sm text-gray-500 mb-1">Latest Release</div>
          <div className="text-lg font-bold truncate">
            {latestRelease ? latestRelease.title : 'None'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-sm text-gray-500 mb-1">Release Types</div>
          <div className="text-lg">
            <span className="font-bold">{singleCount}</span> Singles, 
            <span className="font-bold ml-1">{epCount}</span> EPs, 
            <span className="font-bold ml-1">{albumCount}</span> Albums
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Release list */}
      <ReleaseList
        onEdit={handleEditRelease}
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