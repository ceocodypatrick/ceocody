import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import { setCurrentTrack } from '../utils/slices/playerSlice';

// Mock data for the prototype
const featuredArtist = {
  id: 'artist1',
  name: 'James Wilson',
  image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  track: {
    id: 'track1',
    title: 'Midnight Dreams',
    artist: 'James Wilson',
    coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  }
};

const recentlyPlayed = [
  {
    id: 'track2',
    title: 'Electric Dreams',
    artist: 'Sarah Johnson',
    coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'track3',
    title: 'Midnight Blues',
    artist: 'Marcus Green',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 'track4',
    title: 'Urban Jungle',
    artist: 'The City Sounds',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 'track5',
    title: 'Neon Lights',
    artist: 'Electro Dreams',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: 'track6',
    title: 'Summer Vibes',
    artist: 'James Wilson',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  }
];

const forYou = [
  {
    id: 'track7',
    title: 'Acoustic Morning',
    artist: 'Emma Roberts',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: 'track8',
    title: 'City Lights',
    artist: 'Urban Collective',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 'track9',
    title: 'Dance Revolution',
    artist: 'DJ Pulse',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
  },
  {
    id: 'track10',
    title: 'Ocean Waves',
    artist: 'Coastal Dreams',
    coverUrl: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
  },
  {
    id: 'track11',
    title: 'Night Drive',
    artist: 'Midnight Cruisers',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3'
  }
];

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const handlePlayTrack = (track) => {
    dispatch(setCurrentTrack(track));
  };
  
  return (
    <MainLayout>
      <Head>
        <title>HARMONI - Revolutionary Music Platform</title>
        <meta name="description" content="Discover, stream, and support your favorite artists on HARMONI" />
      </Head>
      
      {/* Hero section */}
      <section className="mb-8">
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-r from-primary to-primary-dark">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${featuredArtist.track.coverUrl})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">New Release: "{featuredArtist.track.title}"</h1>
            <p className="text-lg mb-4">The latest single from {featuredArtist.name}</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handlePlayTrack(featuredArtist.track)}
                className="px-6 py-2 bg-secondary text-gray-900 rounded-full font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Now
              </button>
              <button className="px-6 py-2 bg-white/20 text-white rounded-full font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recently played section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recently Played</h2>
          <Link href="/library" className="text-primary hover:text-primary-dark">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentlyPlayed.map((track) => (
            <div 
              key={track.id} 
              className="bg-white rounded-lg overflow-hidden shadow-light hover:shadow-medium transition-shadow cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <div 
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${track.coverUrl})` }}
              ></div>
              <div className="p-3">
                <h3 className="font-medium truncate">{track.title}</h3>
                <p className="text-sm text-gray-500 truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Made for you section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Made For You</h2>
          <button className="text-primary hover:text-primary-dark">
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {forYou.map((track) => (
            <div 
              key={track.id} 
              className="bg-white rounded-lg overflow-hidden shadow-light hover:shadow-medium transition-shadow cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <div 
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${track.coverUrl})` }}
              ></div>
              <div className="p-3">
                <h3 className="font-medium truncate">{track.title}</h3>
                <p className="text-sm text-gray-500 truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Featured artists section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Artists</h2>
          <Link href="/artists" className="text-primary hover:text-primary-dark">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'artist1', name: 'James Wilson', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
            { id: 'artist2', name: 'Sarah Johnson', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
            { id: 'artist3', name: 'Michael Rodriguez', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
            { id: 'artist4', name: 'Emma Roberts', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
          ].map((artist) => (
            <Link 
              href={`/artists/${artist.id}`} 
              key={artist.id}
              className="bg-white rounded-lg overflow-hidden shadow-light hover:shadow-medium transition-shadow"
            >
              <div className="p-4 flex flex-col items-center text-center">
                <div 
                  className="w-24 h-24 rounded-full bg-cover bg-center mb-3"
                  style={{ backgroundImage: `url(${artist.image})` }}
                ></div>
                <h3 className="font-medium">{artist.name}</h3>
                <p className="text-sm text-gray-500">Artist</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Call to action for non-authenticated users */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-6 mb-8">
          <div className="md:flex items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Join HARMONI Today</h2>
              <p className="text-white/80">Discover new music, support your favorite artists, and join a community of music lovers.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/signup" className="px-6 py-2 bg-white text-primary rounded-full font-medium">
                Sign Up
              </Link>
              <Link href="/login" className="px-6 py-2 bg-white/20 text-white rounded-full font-medium">
                Log In
              </Link>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default Home;