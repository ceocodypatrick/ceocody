const express = require('express');
const router = express.Router();

// Get all tracks (with pagination and filtering)
router.get('/', (req, res) => {
  const { page = 1, limit = 10, genre, artist, search } = req.query;
  
  // Mock tracks data
  const allTracks = [
    {
      id: 'track1',
      title: 'Midnight Dreams',
      artist: {
        id: '123',
        name: 'James Wilson'
      },
      coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: 215, // in seconds
      releaseDate: '2025-05-15',
      genre: 'Electronic',
      plays: 124578,
      likes: 3245,
      releaseId: 'release1'
    },
    {
      id: 'track2',
      title: 'Electric Dreams',
      artist: {
        id: '456',
        name: 'Sarah Johnson'
      },
      coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: 187,
      releaseDate: '2025-04-22',
      genre: 'Pop',
      plays: 98765,
      likes: 2187,
      releaseId: 'release2'
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
      genre: 'Jazz',
      plays: 45678,
      likes: 1234,
      releaseId: 'release3'
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
      genre: 'Hip Hop',
      plays: 67890,
      likes: 1876,
      releaseId: 'release4'
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
      genre: 'Electronic',
      plays: 34567,
      likes: 987,
      releaseId: 'release5'
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
      genre: 'Pop',
      plays: 89245,
      likes: 2341,
      releaseId: 'release6'
    }
  ];
  
  // Apply filters
  let filteredTracks = [...allTracks];
  
  if (genre) {
    filteredTracks = filteredTracks.filter(track => 
      track.genre.toLowerCase() === genre.toLowerCase()
    );
  }
  
  if (artist) {
    filteredTracks = filteredTracks.filter(track => 
      track.artist.id === artist || 
      track.artist.name.toLowerCase().includes(artist.toLowerCase())
    );
  }
  
  if (search) {
    filteredTracks = filteredTracks.filter(track => 
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTracks = filteredTracks.slice(startIndex, endIndex);
  
  res.json({
    tracks: paginatedTracks,
    totalTracks: filteredTracks.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(filteredTracks.length / limit)
  });
});

// Get a single track
router.get('/:id', (req, res) => {
  const trackId = req.params.id;
  
  // Mock track data
  const tracks = {
    'track1': {
      id: 'track1',
      title: 'Midnight Dreams',
      artist: {
        id: '123',
        name: 'James Wilson'
      },
      coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: 215, // in seconds
      releaseDate: '2025-05-15',
      genre: 'Electronic',
      plays: 124578,
      likes: 3245,
      releaseId: 'release1',
      description: 'A dreamy electronic track with ambient vibes and pulsing beats.',
      lyrics: 'In the midnight hour\nWhen the world is quiet\nI can hear the sound\nOf my dreams taking flight...',
      credits: [
        { role: 'Producer', name: 'James Wilson' },
        { role: 'Mixing', name: 'David Chen' },
        { role: 'Mastering', name: 'Mastering Studio X' }
      ],
      relatedTracks: ['track5', 'track6']
    }
  };
  
  const track = tracks[trackId];
  
  if (!track) {
    return res.status(404).json({ message: 'Track not found' });
  }
  
  res.json({ track });
});

// Upload a new track
router.post('/', (req, res) => {
  const { title, genre, releaseId } = req.body;
  
  // In a real app, we would validate the request and save the track to storage
  
  // Mock response
  res.status(201).json({
    message: 'Track uploaded successfully',
    track: {
      id: 'new-track-' + Date.now(),
      title,
      genre,
      releaseId,
      uploadDate: new Date(),
      status: 'processing'
    }
  });
});

// Update track details
router.put('/:id', (req, res) => {
  const trackId = req.params.id;
  const updates = req.body;
  
  // In a real app, we would validate the request and update the track in the database
  
  res.json({
    message: 'Track updated successfully',
    track: {
      id: trackId,
      ...updates,
      updatedAt: new Date()
    }
  });
});

// Delete a track
router.delete('/:id', (req, res) => {
  const trackId = req.params.id;
  
  // In a real app, we would validate the request and delete the track from storage
  
  res.json({
    message: 'Track deleted successfully',
    id: trackId
  });
});

// Like a track
router.post('/:id/like', (req, res) => {
  const trackId = req.params.id;
  
  // In a real app, we would get the current user from the token
  // and update the like relationship in the database
  
  res.json({
    message: 'Track liked successfully',
    trackId
  });
});

// Unlike a track
router.post('/:id/unlike', (req, res) => {
  const trackId = req.params.id;
  
  // In a real app, we would get the current user from the token
  // and remove the like relationship from the database
  
  res.json({
    message: 'Track unliked successfully',
    trackId
  });
});

// Get track comments
router.get('/:id/comments', (req, res) => {
  const trackId = req.params.id;
  
  // Mock comments data
  const comments = [
    {
      id: 'comment1',
      user: {
        id: '789',
        name: 'Alex Thompson',
        avatar: null
      },
      text: 'This track is amazing! The beat drop at 1:45 is incredible.',
      createdAt: '2025-05-16T14:22:00Z',
      likes: 12
    },
    {
      id: 'comment2',
      user: {
        id: '101',
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      text: 'Love the synth work on this one. What gear did you use?',
      createdAt: '2025-05-16T15:45:00Z',
      likes: 8
    },
    {
      id: 'comment3',
      user: {
        id: '102',
        name: 'Emma Roberts',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      text: 'Been waiting for this release! Definitely worth the wait.',
      createdAt: '2025-05-17T09:12:00Z',
      likes: 15
    }
  ];
  
  res.json({
    comments,
    total: comments.length
  });
});

// Add a comment to a track
router.post('/:id/comments', (req, res) => {
  const trackId = req.params.id;
  const { text } = req.body;
  
  // In a real app, we would get the current user from the token
  // and save the comment to the database
  
  // Mock response
  res.status(201).json({
    message: 'Comment added successfully',
    comment: {
      id: 'new-comment-' + Date.now(),
      user: {
        id: '789',
        name: 'Alex Thompson',
        avatar: null
      },
      text,
      createdAt: new Date(),
      likes: 0
    }
  });
});

module.exports = router;