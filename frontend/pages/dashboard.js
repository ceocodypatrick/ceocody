import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChartBarIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Mock data for the dashboard
const mockStats = {
  totalStreams: 247382,
  streamsTrend: 12.3,
  totalRevenue: 1842.57,
  revenueTrend: 8.7,
  newFollowers: 1254,
  followersTrend: 23.5,
  trackSaves: 3721,
  savesTrend: -2.1
};

const mockTopListeners = [
  { id: 'country1', name: 'United States', icon: '🇺🇸', percent: 42, value: 103901 },
  { id: 'country2', name: 'United Kingdom', icon: '🇬🇧', percent: 18, value: 44529 },
  { id: 'country3', name: 'Canada', icon: '🇨🇦', percent: 12, value: 29686 },
  { id: 'country4', name: 'Australia', icon: '🇦🇺', percent: 8, value: 19791 }
];

const mockRecentReleases = [
  {
    id: 'release1',
    title: 'Midnight Dreams',
    type: 'Single',
    releaseDate: '2025-05-15',
    coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    streams: 124578
  },
  {
    id: 'release2',
    title: 'Summer Vibes',
    type: 'Single',
    releaseDate: '2025-03-22',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    streams: 89245
  },
  {
    id: 'release3',
    title: 'Electric Dreams EP',
    type: 'EP',
    releaseDate: '2025-01-10',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    streams: 215689
  }
];

const Dashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [timeRange, setTimeRange] = useState('30days');
  
  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (isAuthenticated && user?.type !== 'artist') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);
  
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
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
          
          <button className="btn btn-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Upload New Track
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-light p-5">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Streams</h3>
          <div className="text-2xl font-bold">{formatNumber(mockStats.totalStreams)}</div>
          <div className={`flex items-center mt-2 text-sm ${mockStats.streamsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {mockStats.streamsTrend >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(mockStats.streamsTrend)}% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
          <div className="text-2xl font-bold">{formatCurrency(mockStats.totalRevenue)}</div>
          <div className={`flex items-center mt-2 text-sm ${mockStats.revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {mockStats.revenueTrend >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(mockStats.revenueTrend)}% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <h3 className="text-gray-600 text-sm font-medium mb-2">New Followers</h3>
          <div className="text-2xl font-bold">{formatNumber(mockStats.newFollowers)}</div>
          <div className={`flex items-center mt-2 text-sm ${mockStats.followersTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {mockStats.followersTrend >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(mockStats.followersTrend)}% from last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Track Saves</h3>
          <div className="text-2xl font-bold">{formatNumber(mockStats.trackSaves)}</div>
          <div className={`flex items-center mt-2 text-sm ${mockStats.savesTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {mockStats.savesTrend >= 0 ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(mockStats.savesTrend)}% from last month</span>
          </div>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-light p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Performance Trends</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-primary text-white rounded-md">Streams</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md">Revenue</button>
            </div>
          </div>
          
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
            [Performance Chart Visualization]
          </div>
        </div>
        
        {/* Top Listeners */}
        <div className="bg-white rounded-lg shadow-light p-5">
          <h3 className="font-semibold mb-4">Top Listeners</h3>
          
          <ul className="space-y-3">
            {mockTopListeners.map((listener) => (
              <li key={listener.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-lg mr-3">
                  {listener.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{listener.name}</div>
                  <div className="text-sm text-gray-500">{listener.percent}% of total streams</div>
                </div>
                <div className="font-semibold">{formatNumber(listener.value)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Recent Releases */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Releases</h2>
          <Link href="/releases" className="text-primary hover:text-primary-dark">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockRecentReleases.map((release) => (
            <Link 
              href={`/releases/${release.id}`} 
              key={release.id}
              className="bg-white rounded-lg shadow-light overflow-hidden hover:shadow-medium transition-shadow"
            >
              <div className="flex">
                <div 
                  className="w-24 h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url(${release.coverUrl})` }}
                ></div>
                <div className="p-4 flex-1">
                  <h3 className="font-medium mb-1">{release.title}</h3>
                  <div className="text-sm text-gray-500 mb-2">{release.type} • {formatDate(release.releaseDate)}</div>
                  <div className="text-sm font-medium">{formatNumber(release.streams)} streams</div>
                </div>
              </div>
            </Link>
          ))}
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

export default Dashboard;