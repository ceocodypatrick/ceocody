import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import TrackDetails from '../../components/tracks/TrackDetails-updated';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTracks } from '../../utils/hooks';

const TrackDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Use the custom tracks hook
  const { 
    currentTrack: track, 
    isLoading, 
    error,
    loadTrack
  } = useTracks();
  
  // Load track when ID is available
  useEffect(() => {
    if (id) {
      loadTrack(id);
    }
  }, [id]);
  
  // Handle edit track
  const handleEditTrack = (trackId) => {
    router.push(`/tracks/${trackId}/edit`);
  };
  
  return (
    <MainLayout>
      <Head>
        <title>{track ? `${track.title} | HARMONI` : 'Track Details | HARMONI'}</title>
        <meta name="description" content={track ? `Listen to ${track.title} by ${track.artist?.name}` : 'Track details'} />
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
        trackId={id}
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