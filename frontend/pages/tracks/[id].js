import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import TrackDetails from '../../components/tracks/TrackDetails';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TrackDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [track, setTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch track data
  useEffect(() => {
    const fetchTrack = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // For the prototype, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock track data
        const mockTrack = {
          id: 'track1',
          title: 'Midnight Dreams',
          artist: {
            id: '123',
            name: 'James Wilson'
          },
          featuring: [
            {
              id: '456',
              name: 'Sarah Johnson'
            }
          ],
          coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          duration: 215,
          releaseDate: '2025-05-15',
          recordedDate: '2025-03-10',
          releaseId: 'release1',
          genre: ['Electronic', 'Ambient'],
          moods: ['Chill', 'Dreamy', 'Atmospheric'],
          bpm: 120,
          key: 'A minor',
          isrc: 'USRC12345678',
          language: 'English',
          isExplicit: false,
          description: 'A dreamy electronic track with ambient vibes and pulsing beats. Created during a late-night studio session, this track captures the essence of urban nightlife and the quiet moments of reflection that come with it.',
          lyrics: "In the midnight hour\nWhen the world is quiet\nI can hear the sound\nOf my dreams taking flight\n\nNeon lights guide my way\nThrough the city's embrace\nElectric dreams, they play\nIn this timeless space\n\n[Chorus]\nMidnight dreams, midnight dreams\nTaking me higher than I've ever been\nMidnight dreams, midnight dreams\nLost in the moment, again and again\n\nDigital waves wash over me\nSynthesized emotions set free\nIn this world between sleep and awake\nA new reality we make\n\n[Bridge]\nTime stands still\nAs the beat drops\nHearts fulfill\nAs the world stops\n\n[Chorus]\nMidnight dreams, midnight dreams\nTaking me higher than I've ever been\nMidnight dreams, midnight dreams\nLost in the moment, again and again\n\nWhen morning comes\nThese feelings remain\nThe journey's just begun\nI'll never be the same\n\n[Outro]\nMidnight dreams...\nMidnight dreams...",
          credits: [
            { role: 'Producer', name: 'James Wilson' },
            { role: 'Mixing', name: 'David Chen' },
            { role: 'Mastering', name: 'Mastering Studio X' },
            { role: 'Featured Vocals', name: 'Sarah Johnson' }
          ],
          copyright: {
            year: 2025,
            holder: 'HARMONI Records'
          },
          publishing: {
            publisher: 'HARMONI Publishing',
            iswc: 'T-123456789-0'
          },
          distribution: {
            status: 'distributed',
            platforms: [
              { name: 'Spotify', url: '#', status: 'active', distributionDate: '2025-05-15' },
              { name: 'Apple Music', url: '#', status: 'active', distributionDate: '2025-05-15' },
              { name: 'YouTube Music', url: '#', status: 'active', distributionDate: '2025-05-15' },
              { name: 'Amazon Music', url: '#', status: 'active', distributionDate: '2025-05-15' }
            ]
          },
          stats: {
            plays: 124578,
            likes: 3245,
            comments: 187,
            shares: 892,
            saves: 4321
          },
          tags: ['Electronic', 'Ambient', 'Chill', 'Night', 'Urban']
        };
        
        setTrack(mockTrack);
      } catch (error) {
        console.error('Error fetching track:', error);
        setError('Failed to load track details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrack();
  }, [id]);
  
  // Handle edit track
  const handleEditTrack = (trackId) => {
    router.push(`/tracks/${trackId}/edit`);
  };
  
  return (
    <MainLayout>
      <Head>
        <title>{track ? `${track.title} | HARMONI` : 'Track Details | HARMONI'}</title>
        <meta name="description" content={track ? `Listen to ${track.title} by ${track.artist.name}` : 'Track details'} />
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
            <h1 className="text-2xl font-bold">Track Details</h1>
            <p className="text-gray-600">View and manage track information</p>
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
      
      <TrackDetails 
        track={track}
        isLoading={isLoading}
        onEdit={handleEditTrack}
      />
      
      {/* Related tracks section */}
      {track && !isLoading && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
          
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
                  <h3 className="font-medium">Similar Track {i}</h3>
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

export default TrackDetailsPage;