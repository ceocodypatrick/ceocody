import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import PerformanceChart from '../components/analytics/PerformanceChart';
import KpiCard from '../components/analytics/KpiCard';
import AudienceDemographics from '../components/analytics/AudienceDemographics';
import GeographicDistribution from '../components/analytics/GeographicDistribution';
import TrackList from '../components/tracks/TrackList';
import ReleaseList from '../components/releases/ReleaseList';

import { 
  ChartBarIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  DevicePhoneMobileIcon,
  ArrowUpTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const EnhancedDashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [timeRange, setTimeRange] = useState('30days');
  const [activeMetric, setActiveMetric] = useState('streams');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [recentReleases, setRecentReleases] = useState([]);
  const [upcomingReleases, setUpcomingReleases] = useState([]);
  
  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (isAuthenticated && user?.type !== 'artist') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For the prototype, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock dashboard data
        const mockDashboardData = {
          overview: {
            totalStreams: 247382,
            streamsTrend: 12.3,
            totalRevenue: 1842.57,
            revenueTrend: 8.7,
            newFollowers: 1254,
            followersTrend: 23.5,
            trackSaves: 3721,
            savesTrend: -2.1
          }
        };
        
        // Mock recent tracks
        const mockRecentTracks = [
          {
            id: 'track1',
            title: 'Midnight Dreams',
            artist: {
              id: '123',
              name: 'James Wilson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            duration: 215,
            releaseDate: '2025-05-15',
            releaseTitle: 'Midnight Dreams EP',
            genre: ['Electronic'],
            plays: 124578
          },
          {
            id: 'track2',
            title: 'Electric Dreams',
            artist: {
              id: '456',
              name: 'Sarah Johnson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            duration: 187,
            releaseDate: '2025-04-22',
            releaseTitle: 'Summer Vibes',
            genre: ['Pop'],
            plays: 98765
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
            releaseTitle: 'Midnight Blues',
            genre: ['Jazz'],
            plays: 45678
          }
        ];
        
        // Mock recent releases
        const mockRecentReleases = [
          {
            id: 'release1',
            title: 'Midnight Dreams',
            type: 'EP',
            artist: {
              id: '123',
              name: 'James Wilson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-05-15',
            tracks: ['track1', 'track7', 'track8', 'track9'],
            totalTracks: 4,
            totalDuration: 873,
            streams: 124578,
            visibility: 'public'
          },
          {
            id: 'release2',
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
            totalDuration: 210,
            streams: 89245,
            visibility: 'public'
          }
        ];
        
        // Mock upcoming releases
        const mockUpcomingReleases = [
          {
            id: 'upcoming1',
            title: 'Autumn Leaves',
            type: 'Single',
            artist: {
              id: '123',
              name: 'James Wilson'
            },
            coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            releaseDate: '2025-08-15',
            tracks: ['track10'],
            totalTracks: 1,
            totalDuration: 195,
            visibility: 'scheduled'
          }
        ];
        
        setDashboardData(mockDashboardData);
        setRecentTracks(mockRecentTracks);
        setRecentReleases(mockRecentReleases);
        setUpcomingReleases(mockUpcomingReleases);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeRange]);
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format currency
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };
  
  return (
    <MainLayout>
      <Head>
        <title>Artist Dashboard | HARMONI</title>
        <meta name="description" content="Manage your music and track your performance" />
      </Head>
      
      <div className="dashboard-header flex justify-between items-center mb-6">
        <div className="welcome-section">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Artist'}</h1>
          <p className="text-gray-600">Here's what's happening with your music</p>
        </div>
        
        <div className="action-buttons flex space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
            <option value="allTime">All Time</option>
          </select>
          
          <div className="flex space-x-2">
            <Link href="/tracks/upload" className="btn btn-primary flex items-center">
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload Track
            </Link>
            
            <Link href="/releases/new" className="btn btn-outline flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Release
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Streams"
          value={isLoading ? '—' : formatNumber(dashboardData?.overview.totalStreams || 0)}
          trend={dashboardData?.overview.streamsTrend}
          icon={<ChartBarIcon className="h-5 w-5" />}
          onClick={() => setActiveMetric('streams')}
          className={activeMetric === 'streams' ? 'ring-2 ring-primary ring-opacity-50' : ''}
        />
        
        <KpiCard
          title="Total Revenue"
          value={isLoading ? '—' : formatCurrency(dashboardData?.overview.totalRevenue || 0)}
          trend={dashboardData?.overview.revenueTrend}
          icon={<CurrencyDollarIcon className="h-5 w-5" />}
          formatter={formatCurrency}
          onClick={() => setActiveMetric('revenue')}
          className={activeMetric === 'revenue' ? 'ring-2 ring-primary ring-opacity-50' : ''}
        />
        
        <KpiCard
          title="New Followers"
          value={isLoading ? '—' : formatNumber(dashboardData?.overview.newFollowers || 0)}
          trend={dashboardData?.overview.followersTrend}
          icon={<UserGroupIcon className="h-5 w-5" />}
          onClick={() => setActiveMetric('followers')}
          className={activeMetric === 'followers' ? 'ring-2 ring-primary ring-opacity-50' : ''}
        />
        
        <KpiCard
          title="Track Saves"
          value={isLoading ? '—' : formatNumber(dashboardData?.overview.trackSaves || 0)}
          trend={dashboardData?.overview.savesTrend}
          icon={<MusicalNoteIcon className="h-5 w-5" />}
          onClick={() => setActiveMetric('saves')}
          className={activeMetric === 'saves' ? 'ring-2 ring-primary ring-opacity-50' : ''}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-light p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Performance Trends</h3>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-sm rounded-md ${activeMetric === 'streams' ? 'bg-primary text-white' : 'border border-gray-300'}`}
                onClick={() => setActiveMetric('streams')}
              >
                Streams
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${activeMetric === 'revenue' ? 'bg-primary text-white' : 'border border-gray-300'}`}
                onClick={() => setActiveMetric('revenue')}
              >
                Revenue
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${activeMetric === 'followers' ? 'bg-primary text-white' : 'border border-gray-300'}`}
                onClick={() => setActiveMetric('followers')}
              >
                Followers
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <PerformanceChart 
              timeRange={timeRange}
              dataType={activeMetric}
              height={256}
            />
          </div>
        </div>
        
        {/* Top Listeners */}
        <div className="bg-white rounded-lg shadow-light p-5">
          <GeographicDistribution 
            title="Top Listeners"
            maxItems={5}
          />
        </div>
      </div>
      
      {/* Recent Tracks */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Tracks</h2>
          <Link href="/tracks" className="text-primary hover:text-primary-dark">
            View All
          </Link>
        </div>
        
        <TrackList
          tracks={recentTracks}
          isLoading={isLoading}
          showArtist={false}
          showReleaseDate={true}
          showDuration={true}
          showPlays={true}
        />
      </div>
      
      {/* Releases Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Releases */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Releases</h2>
            <Link href="/releases" className="text-primary hover:text-primary-dark">
              View All
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : recentReleases.length > 0 ? (
              <div className="space-y-4">
                {recentReleases.map(release => (
                  <Link 
                    key={release.id}
                    href={`/releases/${release.id}`}
                    className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-16 h-16 bg-cover bg-center rounded-md flex-shrink-0"
                      style={{ backgroundImage: `url(${release.coverUrl})` }}
                    ></div>
                    <div className="ml-4 flex-1">
                      <div className="text-xs text-gray-500 uppercase">{release.type}</div>
                      <div className="font-medium">{release.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(release.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        {' • '}
                        {formatNumber(release.streams || 0)} streams
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent releases found
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Releases */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Releases</h2>
            <Link href="/releases" className="text-primary hover:text-primary-dark">
              Schedule New
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : upcomingReleases.length > 0 ? (
              <div className="space-y-4">
                {upcomingReleases.map(release => (
                  <Link 
                    key={release.id}
                    href={`/releases/${release.id}`}
                    className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div 
                      className="w-16 h-16 bg-cover bg-center rounded-md flex-shrink-0"
                      style={{ backgroundImage: `url(${release.coverUrl})` }}
                    ></div>
                    <div className="ml-4 flex-1">
                      <div className="text-xs text-gray-500 uppercase">{release.type}</div>
                      <div className="font-medium">{release.title}</div>
                      <div className="text-sm text-gray-500">
                        Scheduled for {new Date(release.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Scheduled
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No upcoming releases scheduled</p>
                <Link href="/releases/new" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  Schedule Release
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Audience Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <AudienceDemographics 
            title="Age Distribution"
            type="age"
            height={250}
          />
        </div>
        
        <div className="lg:col-span-1">
          <AudienceDemographics 
            title="Gender Distribution"
            type="gender"
            height={250}
          />
        </div>
        
        <div className="lg:col-span-1">
          <AudienceDemographics 
            title="Listening Platforms"
            type="platform"
            height={250}
          />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-light p-5 h-full">
            <h3 className="font-semibold mb-4">Listening Times</h3>
            <div className="flex flex-col h-[202px] justify-center items-center">
              <div className="text-gray-500 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Detailed listening time data will be available in the full version.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/releases/new" className="bg-white rounded-lg shadow-light p-5 hover:shadow-medium transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                <MusicalNoteIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Create Release</h3>
                <p className="text-sm text-gray-500">Upload and distribute your music</p>
              </div>
            </div>
          </Link>
          
          <Link href="/audience" className="bg-white rounded-lg shadow-light p-5 hover:shadow-medium transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Audience Insights</h3>
                <p className="text-sm text-gray-500">Understand your listeners</p>
              </div>
            </div>
          </Link>
          
          <Link href="/revenue" className="bg-white rounded-lg shadow-light p-5 hover:shadow-medium transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Revenue Details</h3>
                <p className="text-sm text-gray-500">Track your earnings</p>
              </div>
            </div>
          </Link>
          
          <Link href="/analytics" className="bg-white rounded-lg shadow-light p-5 hover:shadow-medium transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Advanced Analytics</h3>
                <p className="text-sm text-gray-500">Dive deeper into your data</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Tips and Recommendations */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-5 border border-primary/10">
        <h3 className="font-semibold mb-2">Tips to Grow Your Audience</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Share your latest release on social media with a link to your HARMONI profile</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Post regular updates to keep your fans engaged and attract new listeners</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Collaborate with other artists to reach new audiences and cross-promote</span>
          </li>
        </ul>
      </div>
    </MainLayout>
  );
};

export default EnhancedDashboard;