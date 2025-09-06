const express = require('express');
const router = express.Router();

// Get user profile
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  
  // Mock user data
  const users = {
    '123': {
      id: '123',
      name: 'James Wilson',
      type: 'artist',
      bio: 'Electronic music producer and DJ based in Los Angeles',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      followers: 12543,
      following: 245,
      genres: ['Electronic', 'House', 'Ambient'],
      socialLinks: {
        instagram: 'jameswilson',
        twitter: 'jameswilson',
        website: 'https://jameswilson.com'
      }
    },
    '456': {
      id: '456',
      name: 'Sarah Johnson',
      type: 'artist',
      bio: 'Singer-songwriter with a passion for storytelling through music',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      followers: 8765,
      following: 312,
      genres: ['Pop', 'Indie', 'Folk'],
      socialLinks: {
        instagram: 'sarahjohnsonmusic',
        twitter: 'sarahjohnson',
        website: 'https://sarahjohnsonmusic.com'
      }
    },
    '789': {
      id: '789',
      name: 'Alex Thompson',
      type: 'listener',
      bio: 'Music enthusiast and avid concert-goer',
      avatar: null,
      followers: 45,
      following: 128,
      favoriteGenres: ['Rock', 'Alternative', 'Electronic']
    }
  };
  
  const user = users[userId];
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({ user });
});

// Update user profile
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  
  // In a real app, we would validate the user ID from the token
  // and update the user in the database
  
  res.json({
    message: 'Profile updated successfully',
    user: {
      id: userId,
      ...updates,
      updatedAt: new Date()
    }
  });
});

// Follow a user
router.post('/:id/follow', (req, res) => {
  const userId = req.params.id;
  
  // In a real app, we would get the current user from the token
  // and update the follow relationship in the database
  
  res.json({
    message: 'User followed successfully',
    followId: userId
  });
});

// Unfollow a user
router.post('/:id/unfollow', (req, res) => {
  const userId = req.params.id;
  
  // In a real app, we would get the current user from the token
  // and remove the follow relationship from the database
  
  res.json({
    message: 'User unfollowed successfully',
    unfollowId: userId
  });
});

// Get user's followers
router.get('/:id/followers', (req, res) => {
  const userId = req.params.id;
  
  // Mock followers data
  const followers = [
    {
      id: '789',
      name: 'Alex Thompson',
      type: 'listener',
      avatar: null
    },
    {
      id: '101',
      name: 'Michael Rodriguez',
      type: 'artist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: '102',
      name: 'Emma Roberts',
      type: 'listener',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];
  
  res.json({
    followers,
    total: followers.length
  });
});

// Get user's following
router.get('/:id/following', (req, res) => {
  const userId = req.params.id;
  
  // Mock following data
  const following = [
    {
      id: '123',
      name: 'James Wilson',
      type: 'artist',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: '456',
      name: 'Sarah Johnson',
      type: 'artist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];
  
  res.json({
    following,
    total: following.length
  });
});

module.exports = router;