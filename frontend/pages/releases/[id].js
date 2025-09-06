import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import ReleaseDetails from '../../components/releases/ReleaseDetails';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ReleaseDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [release, setRelease] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch release data
  useEffect(() => {
    const fetchRelease = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // For the prototype, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock release data
        const mockRelease = {
          id: 'release1',
          title: 'Midnight Dreams',
          type: 'EP',
          artist: {
            id: '123',
            name: 'James Wilson'
          },
          coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          releaseDate: '2025-05-15',
          tracks: [
            {
              id: 'track1',
              title: 'Midnight Dreams',
              duration: 215,
              audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              trackNumber: 1
            },
            {
              id: 'track7',
              title: 'Neon City',
              duration: 210,
              audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
              trackNumber: 2
            },
            {
              id: 'track8',
              title: 'Digital Love',
              duration: 225,
              audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
              trackNumber: 3
            },
            {
              id: 'track9',
              title: 'Future Memories',
              duration: 223,
              audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
              trackNumber: 4
            }
          ],
          totalTracks: 4,
          totalDuration: 873,
          streams: 124578,
          description: 'A collection of electronic tracks exploring themes of night, dreams, and urban life. Created over the course of six months in my home studio, this EP represents a journey through the subconscious mind and the electric energy of city nights.',
          genres: ['Electronic', 'Ambient', 'Downtempo'],
          language: 'English',
          recordLabel: 'HARMONI Records',
          upc: '123456789012',
          visibility: 'public',
          credits: [
            { role: 'Producer', name: 'James Wilson' },
            { role: 'Mixing', name: 'David Chen' },
            { role: 'Mastering', name: 'Mastering Studio X' },
            { role: 'Artwork', name: 'Visual Arts Studio' }
          ],
          copyright: {
            year: 2025,
            holder: 'HARMONI Records'
          },
          platforms: [
            { name: 'Spotify', url: '#' },
            { name: 'Apple Music', url: '#' },
            { name: 'YouTube Music', url: '#' },
            { name: 'Amazon Music', url: '#' }
          ],
          stats: {
            plays: 124578,
            saves: 3245,
            playlistAdds: 187,
            shares: 892
          }
        };
        
        setRelease(mockRelease);
      } catch (error) {
        console.error('Error fetching release:', error);
        setError('Failed to load release details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelease();
  }, [id]);
  
  // Handle edit release
  const handleEditRelease = (releaseId) => {
    router.push(`/releases/${releaseId}/edit`);
  };
  
  return (
    <MainLayout>
      <Head>
        <title>{release ? `${release.title} | HARMONI` : 'Release Details | HARMONI'}</title>
        <meta name="description" content={release ? `Listen to ${release.title} by ${release.artist.name}` : 'Release details'} />
      </Head>
      
      <div className="mb-6">
        <div className="flex items-center">
          <button
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Release Details</h1>
            <p className="text-gray-600">View and manage release information</p>
          </div>
        </div>
      </div>
      
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
      
      <ReleaseDetails 
        release={release}
        isLoading={isLoading}
        onEdit={handleEditRelease}
      />
      
      {/* Distribution status */}
      {release && !isLoading && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Distribution Status</h2>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Distribution Progress</h3>
                <span className="text-sm text-green-600 font-medium">Complete</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Spotify', status: 'Live', date: '2025-05-15', url: '#' },
                    { name: 'Apple Music', status: 'Live', date: '2025-05-15', url: '#' },
                    { name: 'YouTube Music', status: 'Live', date: '2025-05-15', url: '#' },
                    { name: 'Amazon Music', status: 'Live', date: '2025-05-15', url: '#' },
                    { name: 'Tidal', status: 'Live', date: '2025-05-15', url: '#' },
                    { name: 'Deezer', status: 'Live', date: '2025-05-15', url: '#' }
                  ].map((platform, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {platform.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{platform.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={platform.url} className="text-primary hover:text-primary-dark">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Similar releases */}
      {release && !isLoading && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Similar Releases</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-light overflow-hidden">
                <div 
                  className="aspect-square bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-${1511379938547 + i * 1000}-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80)` 
                  }}
                ></div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 uppercase mb-1">
                    {i % 2 === 0 ? 'Single' : 'EP'}
                  </div>
                  <h3 className="font-medium">Similar Release {i}</h3>
                  <p className="text-sm text-gray-500">Artist Name</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ReleaseDetailsPage;