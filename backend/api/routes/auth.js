const express = require('express');
const router = express.Router();

// Mock authentication for prototype
// In a real application, these would call controller functions

// Register a new user
router.post('/register', (req, res) => {
  const { name, email, password, userType } = req.body;
  
  // Validate input
  if (!name || !email || !password || !userType) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Check if email is valid format
  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Check if password is strong enough
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  // In a real app, we would check if user already exists and hash the password
  
  // Create a mock user
  const user = {
    id: Math.floor(Math.random() * 10000),
    name,
    email,
    type: userType,
    createdAt: new Date(),
    avatar: null
  };
  
  // Generate a mock token
  const token = 'mock_jwt_token_' + user.id;
  
  res.status(201).json({
    message: 'User registered successfully',
    user,
    token
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // In a real app, we would verify credentials against database
  
  // For demo purposes, accept any valid email format and password length > 5
  if (!email.includes('@') || password.length < 6) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Determine if artist or listener based on email domain for demo
  const isArtist = email.includes('artist');
  
  // Create a mock user
  const user = {
    id: Math.floor(Math.random() * 10000),
    name: isArtist ? 'James Wilson' : 'Alex Thompson',
    email,
    type: isArtist ? 'artist' : 'listener',
    avatar: isArtist 
      ? 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      : null
  };
  
  // Generate a mock token
  const token = 'mock_jwt_token_' + user.id;
  
  res.json({
    message: 'Login successful',
    user,
    token
  });
});

// Get current user
router.get('/me', (req, res) => {
  // In a real app, we would verify the JWT token and get the user from database
  
  // For demo, just return a mock user
  const user = {
    id: 12345,
    name: 'James Wilson',
    email: 'james@artist.com',
    type: 'artist',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  };
  
  res.json({ user });
});

// Logout
router.post('/logout', (req, res) => {
  // In a real app, we might invalidate the token
  
  res.json({ message: 'Logout successful' });
});

module.exports = router;