const express = require('express');
const router = express.Router();

// Get all releases (with pagination and filtering)
router.get('/', (req, res) => {
  const { page = 1, limit = 10, artist, type } = req.query;
  
  // Mock releases data
  const allReleases = [
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
      streams: 124578
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
      streams: 215689
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
      streams: 45678
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
      streams: 67890
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
      streams: 34567
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
      streams: 89245
    }
  ];
  
  // Apply filters
  let filteredReleases = [...allReleases];
  
  if (artist) {
    filteredReleases = filteredReleases.filter(release => 
      release.artist.id === artist || 
      release.artist.name.toLowerCase().includes(artist.toLowerCase())
    );
  }
  
  if (type) {
    filteredReleases = filteredReleases.filter(release => 
      release.type.toLowerCase() === type.toLowerCase()
    );
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedReleases = filteredReleases.slice(startIndex, endIndex);
  
  res.json({
    releases: paginatedReleases,
    totalReleases: filteredReleases.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(filteredReleases.length / limit)
  });
});

// Get a single release
router.get('/:id', (req, res) => {
  const releaseId = req.params.id;
  
  // Mock release data
  const releases = {
    'release1': {
      id: 'release1',
      title: 'Midnight Dreams',
      type: 'Single',
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
        }
      ],
      totalTracks: 1,
      totalDuration: 215,
      streams: 124578,
      description: 'A dreamy electronic single with ambient vibes and pulsing beats.',
      genres: ['Electronic', 'Ambient', 'Downtempo'],
      credits: [
        { role: 'Producer', name: 'James Wilson' },
        { role: 'Mixing', name: 'David Chen' },
        { role: 'Mastering', name: 'Mastering Studio X' }
      ],
      platforms: [
        { name: 'Spotify', url: '#' },
        { name: 'Apple Music', url: '#' },
        { name: 'YouTube Music', url: '#' },
        { name: 'Amazon Music', url: '#' }
      ],
      relatedReleases: ['release6', 'release5']
    },
    'release2': {
      id: 'release2',
      title: 'Electric Dreams EP',
      type: 'EP',
      artist: {
        id: '456',
        name: 'Sarah Johnson'
      },
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      releaseDate: '2025-01-10',
      tracks: [
        {
          id: 'track2',
          title: 'Electric Dreams',
          duration: 187,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
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
      totalDuration: 845,
      streams: 215689,
      description: 'A collection of electronic pop tracks exploring themes of technology and human connection.',
      genres: ['Pop', 'Electronic', 'Synth-pop'],
      credits: [
        { role: 'Producer', name: 'Sarah Johnson' },
        { role: 'Co-Producer', name: 'Michael Rodriguez' },
        { role: 'Mixing', name: 'Studio Y' },
        { role: 'Mastering', name: 'Mastering Studio Z' }
      ],
      platforms: [
        { name: 'Spotify', url: '#' },
        { name: 'Apple Music', url: '#' },
        { name: 'YouTube Music', url: '#' },
        { name: 'Amazon Music', url: '#' }
      ],
      relatedReleases: ['release5', 'release1']
    }
  };
  
  const release = releases[releaseId];
  
  if (!release) {
    return res.status(404).json({ message: 'Release not found' });
  }
  
  res.json({ release });
});

// Create a new release
router.post('/', (req, res) => {
  const { title, type, tracks } = req.body;
  
  // In a real app, we would validate the request and save the release to the database
  
  // Mock response
  res.status(201).json({
    message: 'Release created successfully',
    release: {
      id: 'new-release-' + Date.now(),
      title,
      type,
      tracks: tracks || [],
      createdAt: new Date(),
      status: 'draft'
    }
  });
});

// Update release details
router.put('/:id', (req, res) => {
  const releaseId = req.params.id;
  const updates = req.body;
  
  // In a real app, we would validate the request and update the release in the database
  
  res.json({
    message: 'Release updated successfully',
    release: {
      id: releaseId,
      ...updates,
      updatedAt: new Date()
    }
  });
});

// Delete a release
router.delete('/:id', (req, res) => {
  const releaseId = req.params.id;
  
  // In a real app, we would validate the request and delete the release from the database
  
  res.json({
    message: 'Release deleted successfully',
    id: releaseId
  });
});

// Submit a release for distribution
router.post('/:id/distribute', (req, res) => {
  const releaseId = req.params.id;
  const { platforms } = req.body;
  
  // In a real app, we would validate the request and update the release status in the database
  
  res.json({
    message: 'Release submitted for distribution',
    release: {
      id: releaseId,
      distributionStatus: 'pending',
      platforms: platforms || ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music'],
      submittedAt: new Date(),
      estimatedReleaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  });
});

// Get release analytics
router.get('/:id/analytics', (req, res) => {
  const releaseId = req.params.id;
  
  // Mock analytics data
  const analytics = {
    totalStreams: 124578,
    platformBreakdown: [
      { platform: 'Spotify', streams: 78245, revenue: 469.47 },
      { platform: 'Apple Music', streams: 32156, revenue: 225.09 },
      { platform: 'YouTube Music', streams: 8976, revenue: 44.88 },
      { platform: 'Amazon Music', streams: 5201, revenue: 31.21 }
    ],
    geographicBreakdown: [
      { country: 'United States', streams: 52322, percent: 42 },
      { country: 'United Kingdom', streams: 22424, percent: 18 },
      { country: 'Canada', streams: 14949, percent: 12 },
      { country: 'Australia', streams: 9966, percent: 8 },
      { country: 'Germany', streams: 7475, percent: 6 },
      { country: 'Other', streams: 17442, percent: 14 }
    ],
    dailyStreams: [
      { date: '2025-05-15', streams: 12456 },
      { date: '2025-05-16', streams: 10234 },
      { date: '2025-05-17', streams: 9876 },
      { date: '2025-05-18', streams: 8765 },
      { date: '2025-05-19', streams: 9234 },
      { date: '2025-05-20', streams: 8976 },
      { date: '2025-05-21', streams: 9543 }
    ],
    playlistAdditions: 87,
    saveRate: 2.6, // percentage of listeners who saved the track
    completionRate: 78.3 // percentage of listeners who listened to the entire track
  };
  
  res.json({ analytics });
});

module.exports = router;