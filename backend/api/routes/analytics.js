const express = require('express');
const router = express.Router();

// Get artist dashboard analytics
router.get('/dashboard', (req, res) => {
  const { timeRange = '30days' } = req.query;
  
  // Mock analytics data
  const analytics = {
    overview: {
      totalStreams: 247382,
      streamsTrend: 12.3,
      totalRevenue: 1842.57,
      revenueTrend: 8.7,
      newFollowers: 1254,
      followersTrend: 23.5,
      trackSaves: 3721,
      savesTrend: -2.1
    },
    topTracks: [
      {
        id: 'track1',
        title: 'Midnight Dreams',
        coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        streams: 124578,
        revenue: 747.47
      },
      {
        id: 'track6',
        title: 'Summer Vibes',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        streams: 89245,
        revenue: 535.47
      },
      {
        id: 'track10',
        title: 'Ocean Waves',
        coverUrl: 'https://images.unsplash.com/photo-1504509546545-e000b4a62425?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        streams: 33559,
        revenue: 201.35
      }
    ],
    topCountries: [
      { name: 'United States', code: 'US', streams: 103901, percent: 42 },
      { name: 'United Kingdom', code: 'GB', streams: 44529, percent: 18 },
      { name: 'Canada', code: 'CA', streams: 29686, percent: 12 },
      { name: 'Australia', code: 'AU', streams: 19791, percent: 8 },
      { name: 'Germany', code: 'DE', streams: 14843, percent: 6 }
    ],
    platformBreakdown: [
      { platform: 'Spotify', streams: 148429, revenue: 890.57 },
      { platform: 'Apple Music', streams: 61846, revenue: 432.92 },
      { platform: 'YouTube Music', streams: 24738, revenue: 123.69 },
      { platform: 'Amazon Music', streams: 12369, revenue: 74.21 }
    ],
    streamsTrend: [
      { date: '2025-04-21', streams: 7245 },
      { date: '2025-04-22', streams: 7123 },
      { date: '2025-04-23', streams: 7456 },
      { date: '2025-04-24', streams: 7321 },
      { date: '2025-04-25', streams: 7654 },
      { date: '2025-04-26', streams: 8123 },
      { date: '2025-04-27', streams: 8245 },
      { date: '2025-04-28', streams: 8123 },
      { date: '2025-04-29', streams: 8345 },
      { date: '2025-04-30', streams: 8456 },
      { date: '2025-05-01', streams: 8234 },
      { date: '2025-05-02', streams: 8345 },
      { date: '2025-05-03', streams: 8567 },
      { date: '2025-05-04', streams: 8765 },
      { date: '2025-05-05', streams: 8543 },
      { date: '2025-05-06', streams: 8765 },
      { date: '2025-05-07', streams: 8976 },
      { date: '2025-05-08', streams: 9123 },
      { date: '2025-05-09', streams: 9345 },
      { date: '2025-05-10', streams: 9567 },
      { date: '2025-05-11', streams: 9765 },
      { date: '2025-05-12', streams: 9876 },
      { date: '2025-05-13', streams: 10123 },
      { date: '2025-05-14', streams: 10345 },
      { date: '2025-05-15', streams: 12456 },
      { date: '2025-05-16', streams: 10234 },
      { date: '2025-05-17', streams: 9876 },
      { date: '2025-05-18', streams: 8765 },
      { date: '2025-05-19', streams: 9234 },
      { date: '2025-05-20', streams: 8976 }
    ],
    revenueTrend: [
      { date: '2025-04-21', revenue: 43.47 },
      { date: '2025-04-22', revenue: 42.74 },
      { date: '2025-04-23', revenue: 44.74 },
      { date: '2025-04-24', revenue: 43.93 },
      { date: '2025-04-25', revenue: 45.92 },
      { date: '2025-04-26', revenue: 48.74 },
      { date: '2025-04-27', revenue: 49.47 },
      { date: '2025-04-28', revenue: 48.74 },
      { date: '2025-04-29', revenue: 50.07 },
      { date: '2025-04-30', revenue: 50.74 },
      { date: '2025-05-01', revenue: 49.40 },
      { date: '2025-05-02', revenue: 50.07 },
      { date: '2025-05-03', revenue: 51.40 },
      { date: '2025-05-04', revenue: 52.59 },
      { date: '2025-05-05', revenue: 51.26 },
      { date: '2025-05-06', revenue: 52.59 },
      { date: '2025-05-07', revenue: 53.86 },
      { date: '2025-05-08', revenue: 54.74 },
      { date: '2025-05-09', revenue: 56.07 },
      { date: '2025-05-10', revenue: 57.40 },
      { date: '2025-05-11', revenue: 58.59 },
      { date: '2025-05-12', revenue: 59.26 },
      { date: '2025-05-13', revenue: 60.74 },
      { date: '2025-05-14', revenue: 62.07 },
      { date: '2025-05-15', revenue: 74.74 },
      { date: '2025-05-16', revenue: 61.40 },
      { date: '2025-05-17', revenue: 59.26 },
      { date: '2025-05-18', revenue: 52.59 },
      { date: '2025-05-19', revenue: 55.40 },
      { date: '2025-05-20', revenue: 53.86 }
    ],
    audienceInsights: {
      ageGroups: [
        { group: '18-24', percent: 32 },
        { group: '25-34', percent: 41 },
        { group: '35-44', percent: 18 },
        { group: '45-54', percent: 6 },
        { group: '55+', percent: 3 }
      ],
      gender: [
        { group: 'Male', percent: 58 },
        { group: 'Female', percent: 41 },
        { group: 'Non-binary/Other', percent: 1 }
      ],
      topCities: [
        { city: 'New York', country: 'US', listeners: 12468 },
        { city: 'Los Angeles', country: 'US', listeners: 9876 },
        { city: 'London', country: 'GB', listeners: 8765 },
        { city: 'Chicago', country: 'US', listeners: 6543 },
        { city: 'Toronto', country: 'CA', listeners: 5432 }
      ],
      listeningPlatforms: [
        { type: 'Mobile', percent: 68 },
        { type: 'Desktop', percent: 24 },
        { type: 'Tablet', percent: 5 },
        { type: 'Smart Speaker', percent: 3 }
      ]
    }
  };
  
  // Adjust data based on time range
  if (timeRange === '7days') {
    analytics.overview.totalStreams = 58765;
    analytics.overview.streamsTrend = 5.2;
    analytics.overview.totalRevenue = 352.59;
    analytics.overview.revenueTrend = 3.8;
    analytics.overview.newFollowers = 324;
    analytics.overview.followersTrend = 12.7;
    analytics.overview.trackSaves = 876;
    analytics.overview.savesTrend = 1.5;
    
    // Truncate trend data to last 7 days
    analytics.streamsTrend = analytics.streamsTrend.slice(-7);
    analytics.revenueTrend = analytics.revenueTrend.slice(-7);
  } else if (timeRange === '90days') {
    analytics.overview.totalStreams = 687543;
    analytics.overview.streamsTrend = 28.7;
    analytics.overview.totalRevenue = 4125.26;
    analytics.overview.revenueTrend = 22.3;
    analytics.overview.newFollowers = 3876;
    analytics.overview.followersTrend = 45.2;
    analytics.overview.trackSaves = 10234;
    analytics.overview.savesTrend = 18.7;
    
    // For 90 days, we would need more data points, but for the mock we'll keep the existing ones
  }
  
  res.json({ analytics });
});

// Get audience analytics
router.get('/audience', (req, res) => {
  const { timeRange = '30days' } = req.query;
  
  // Mock audience analytics data
  const audienceAnalytics = {
    overview: {
      totalListeners: 98765,
      listenersTrend: 15.3,
      averageListeningTime: 18.5, // minutes per session
      repeatListenerRate: 42.7, // percentage
      newListeners: 12543,
      newListenersTrend: 23.5
    },
    demographics: {
      ageGroups: [
        { group: '18-24', percent: 32, trend: 2.5 },
        { group: '25-34', percent: 41, trend: 1.2 },
        { group: '35-44', percent: 18, trend: -0.8 },
        { group: '45-54', percent: 6, trend: -0.5 },
        { group: '55+', percent: 3, trend: 0.3 }
      ],
      gender: [
        { group: 'Male', percent: 58, trend: -1.2 },
        { group: 'Female', percent: 41, trend: 1.0 },
        { group: 'Non-binary/Other', percent: 1, trend: 0.2 }
      ]
    },
    geographic: {
      topCountries: [
        { name: 'United States', code: 'US', listeners: 41481, percent: 42, trend: 1.5 },
        { name: 'United Kingdom', code: 'GB', listeners: 17778, percent: 18, trend: 2.3 },
        { name: 'Canada', code: 'CA', listeners: 11852, percent: 12, trend: 0.8 },
        { name: 'Australia', code: 'AU', listeners: 7901, percent: 8, trend: 1.2 },
        { name: 'Germany', code: 'DE', listeners: 5926, percent: 6, trend: 3.5 }
      ],
      topCities: [
        { city: 'New York', country: 'US', listeners: 12468, trend: 2.1 },
        { city: 'Los Angeles', country: 'US', listeners: 9876, trend: 1.8 },
        { city: 'London', country: 'GB', listeners: 8765, trend: 2.5 },
        { city: 'Chicago', country: 'US', listeners: 6543, trend: 1.2 },
        { city: 'Toronto', country: 'CA', listeners: 5432, trend: 0.9 }
      ],
      growthMarkets: [
        { name: 'Brazil', code: 'BR', growth: 45.3 },
        { name: 'India', code: 'IN', growth: 38.7 },
        { name: 'Mexico', code: 'MX', growth: 32.1 },
        { name: 'Spain', code: 'ES', growth: 28.5 },
        { name: 'Japan', code: 'JP', growth: 25.2 }
      ]
    },
    behavior: {
      listeningPlatforms: [
        { type: 'Mobile', percent: 68, trend: 2.5 },
        { type: 'Desktop', percent: 24, trend: -1.8 },
        { type: 'Tablet', percent: 5, trend: -0.5 },
        { type: 'Smart Speaker', percent: 3, trend: 0.8 }
      ],
      listeningTimes: [
        { hour: 0, percent: 3.2 },
        { hour: 1, percent: 2.1 },
        { hour: 2, percent: 1.5 },
        { hour: 3, percent: 0.8 },
        { hour: 4, percent: 0.5 },
        { hour: 5, percent: 0.7 },
        { hour: 6, percent: 1.2 },
        { hour: 7, percent: 2.5 },
        { hour: 8, percent: 4.8 },
        { hour: 9, percent: 5.3 },
        { hour: 10, percent: 4.7 },
        { hour: 11, percent: 4.2 },
        { hour: 12, percent: 5.1 },
        { hour: 13, percent: 5.8 },
        { hour: 14, percent: 5.2 },
        { hour: 15, percent: 4.9 },
        { hour: 16, percent: 5.3 },
        { hour: 17, percent: 6.2 },
        { hour: 18, percent: 7.5 },
        { hour: 19, percent: 8.3 },
        { hour: 20, percent: 7.9 },
        { hour: 21, percent: 6.8 },
        { hour: 22, percent: 5.2 },
        { hour: 23, percent: 4.3 }
      ],
      weekdayDistribution: [
        { day: 'Monday', percent: 13.5 },
        { day: 'Tuesday', percent: 12.8 },
        { day: 'Wednesday', percent: 13.2 },
        { day: 'Thursday', percent: 14.1 },
        { day: 'Friday', percent: 16.7 },
        { day: 'Saturday', percent: 17.2 },
        { day: 'Sunday', percent: 12.5 }
      ]
    },
    engagement: {
      followRate: 2.8, // percentage of listeners who follow after listening
      saveRate: 3.2, // percentage of listeners who save tracks
      completionRate: 78.5, // percentage of listeners who listen to tracks completely
      shareRate: 0.7, // percentage of listeners who share tracks
      playlistAddRate: 1.2, // percentage of listeners who add tracks to playlists
      averageSessionDuration: 24.5, // minutes
      returnRate: 42.3 // percentage of listeners who return within 7 days
    },
    sources: [
      { source: 'Direct', percent: 32.5, trend: 1.2 },
      { source: 'Algorithmic Recommendations', percent: 28.7, trend: 3.5 },
      { source: 'Playlists', percent: 22.3, trend: 2.1 },
      { source: 'Social Media', percent: 8.5, trend: 4.2 },
      { source: 'External Links', percent: 5.2, trend: 0.8 },
      { source: 'Other', percent: 2.8, trend: -0.5 }
    ]
  };
  
  res.json({ audienceAnalytics });
});

// Get revenue analytics
router.get('/revenue', (req, res) => {
  const { timeRange = '30days' } = req.query;
  
  // Mock revenue analytics data
  const revenueAnalytics = {
    overview: {
      totalRevenue: 1842.57,
      revenueTrend: 8.7,
      projectedRevenue: 2150.00, // projected for next month
      averageRevenuePerStream: 0.006, // in dollars
      topEarningTrack: {
        id: 'track1',
        title: 'Midnight Dreams',
        revenue: 747.47
      },
      topEarningRelease: {
        id: 'release2',
        title: 'Electric Dreams EP',
        revenue: 1294.13
      }
    },
    revenueBySource: [
      { source: 'Streaming', amount: 1547.76, percent: 84.0, trend: 7.8 },
      { source: 'Direct Support', amount: 185.32, percent: 10.1, trend: 15.3 },
      { source: 'Merchandise', amount: 73.70, percent: 4.0, trend: 12.5 },
      { source: 'Licensing', amount: 35.79, percent: 1.9, trend: 5.2 }
    ],
    streamingRevenue: {
      byPlatform: [
        { platform: 'Spotify', amount: 890.57, percent: 57.5, trend: 8.2 },
        { platform: 'Apple Music', amount: 432.92, percent: 28.0, trend: 7.5 },
        { platform: 'YouTube Music', amount: 123.69, percent: 8.0, trend: 12.3 },
        { platform: 'Amazon Music', amount: 74.21, percent: 4.8, trend: 5.7 },
        { platform: 'Other', amount: 26.37, percent: 1.7, trend: 3.2 }
      ],
      byCountry: [
        { country: 'United States', code: 'US', amount: 774.88, percent: 50.1, trend: 7.2 },
        { country: 'United Kingdom', code: 'GB', amount: 232.16, percent: 15.0, trend: 8.5 },
        { country: 'Canada', code: 'CA', amount: 139.30, percent: 9.0, trend: 6.8 },
        { country: 'Australia', code: 'AU', amount: 108.34, percent: 7.0, trend: 9.2 },
        { country: 'Germany', code: 'DE', amount: 77.39, percent: 5.0, trend: 10.5 },
        { country: 'Other', code: 'Other', amount: 215.69, percent: 13.9, trend: 8.7 }
      ],
      byTrack: [
        {
          id: 'track1',
          title: 'Midnight Dreams',
          amount: 747.47,
          percent: 48.3,
          trend: 12.5
        },
        {
          id: 'track6',
          title: 'Summer Vibes',
          amount: 535.47,
          percent: 34.6,
          trend: 8.2
        },
        {
          id: 'track10',
          title: 'Ocean Waves',
          amount: 201.35,
          percent: 13.0,
          trend: 5.7
        },
        {
          id: 'other',
          title: 'Other Tracks',
          amount: 63.47,
          percent: 4.1,
          trend: 3.2
        }
      ]
    },
    directSupport: {
      byType: [
        { type: 'Tips', amount: 92.66, percent: 50.0, trend: 18.5 },
        { type: 'Subscriptions', amount: 74.13, percent: 40.0, trend: 12.7 },
        { type: 'One-time Support', amount: 18.53, percent: 10.0, trend: 8.2 }
      ],
      topSupporters: [
        { id: 'user1', name: 'Alex Thompson', amount: 25.00, date: '2025-05-18' },
        { id: 'user2', name: 'Emma Roberts', amount: 20.00, date: '2025-05-15' },
        { id: 'user3', name: 'Michael Chen', amount: 15.00, date: '2025-05-20' }
      ]
    },
    revenueTrend: [
      { date: '2025-04-21', amount: 43.47 },
      { date: '2025-04-22', amount: 42.74 },
      { date: '2025-04-23', amount: 44.74 },
      { date: '2025-04-24', amount: 43.93 },
      { date: '2025-04-25', amount: 45.92 },
      { date: '2025-04-26', amount: 48.74 },
      { date: '2025-04-27', amount: 49.47 },
      { date: '2025-04-28', amount: 48.74 },
      { date: '2025-04-29', amount: 50.07 },
      { date: '2025-04-30', amount: 50.74 },
      { date: '2025-05-01', amount: 49.40 },
      { date: '2025-05-02', amount: 50.07 },
      { date: '2025-05-03', amount: 51.40 },
      { date: '2025-05-04', amount: 52.59 },
      { date: '2025-05-05', amount: 51.26 },
      { date: '2025-05-06', amount: 52.59 },
      { date: '2025-05-07', amount: 53.86 },
      { date: '2025-05-08', amount: 54.74 },
      { date: '2025-05-09', amount: 56.07 },
      { date: '2025-05-10', amount: 57.40 },
      { date: '2025-05-11', amount: 58.59 },
      { date: '2025-05-12', amount: 59.26 },
      { date: '2025-05-13', amount: 60.74 },
      { date: '2025-05-14', amount: 62.07 },
      { date: '2025-05-15', amount: 74.74 },
      { date: '2025-05-16', amount: 61.40 },
      { date: '2025-05-17', amount: 59.26 },
      { date: '2025-05-18', amount: 52.59 },
      { date: '2025-05-19', amount: 55.40 },
      { date: '2025-05-20', amount: 53.86 }
    ],
    paymentHistory: [
      { date: '2025-05-15', amount: 745.32, status: 'Paid', reference: 'PAY-2025-05-001' },
      { date: '2025-04-15', amount: 687.45, status: 'Paid', reference: 'PAY-2025-04-001' },
      { date: '2025-03-15', amount: 623.78, status: 'Paid', reference: 'PAY-2025-03-001' }
    ],
    projections: {
      nextMonth: 2150.00,
      threeMonths: 6750.00,
      sixMonths: 14500.00,
      annual: 32000.00
    }
  };
  
  res.json({ revenueAnalytics });
});

module.exports = router;