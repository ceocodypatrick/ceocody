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
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

// Import our custom hooks
import { useAnalytics, useTracks, useReleases } from '../utils/hooks';

const EnhancedDashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Use our custom hooks
  const { 
    performanceOverview, 
    audienceDemographics, 
    geographicDistribution, 
    topTracks,
    topReleases,
    isLoading: analyticsLoading, 
    timeframe, 
    changeTimeframe 
  } = useAnalytics('30d');
  
  const { tracks, isLoading: tracksLoading } = useTracks();
  const { releases, isLoading: releasesLoading } = useReleases();
  
  const [selectedMetric, setSelectedMetric] = useState('streams');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setSelectedTimeframe(newTimeframe);
    changeTimeframe(newTimeframe);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Prepare data for performance chart
  const getPerformanceData = () => {
    if (!performanceOverview) return { labels: [], datasets: [] };
    
    const metrics = {
      streams: {
        label: 'Streams',
        color: 'rgba(99, 102, 241, 0.8)',
      },
      followers: {
        label: 'Followers',
        color: 'rgba(16, 185, 129, 0.8)',
      },
      revenue: {
        label: 'Revenue',
        color: 'rgba(245, 158, 11, 0.8)',
      },
    };
    
    return {
      labels: performanceOverview.dates,
      datasets: [
        {
          label: metrics[selectedMetric].label,
          data: performanceOverview[selectedMetric],
          borderColor: metrics[selectedMetric].color,
          backgroundColor: metrics[selectedMetric].color.replace('0.8', '0.2'),
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  // Get KPI data
  const getKpiData = () => {
    if (!performanceOverview) {
      return {
        streams: { value: 0, change: 0 },
        followers: { value: 0, change: 0 },
        revenue: { value: 0, change: 0 },
        engagement: { value: 0, change: 0 },
      };
    }

    return {
      streams: {
        value: performanceOverview.totals.streams,
        change: performanceOverview.changes.streams,
      },
      followers: {
        value: performanceOverview.totals.followers,
        change: performanceOverview.changes.followers,
      },
      revenue: {
        value: performanceOverview.totals.revenue,
        change: performanceOverview.changes.revenue,
      },
      engagement: {
        value: performanceOverview.totals.engagement,
        change: performanceOverview.changes.engagement,
      },
    };
  };

  // Format number with K, M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const kpiData = getKpiData();
  const performanceData = getPerformanceData();

  // Loading state
  const isLoading = analyticsLoading || tracksLoading || releasesLoading;

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <>
      <Head>
        <title>Artist Dashboard | HARMONI</title>
      </Head>
      <MainLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Artist'}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your music
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => handleTimeframeChange('7d')}
                  className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
                    selectedTimeframe === '7d'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300 focus:z-10 focus:outline-none`}
                >
                  7 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeframeChange('30d')}
                  className={`relative -ml-px inline-flex items-center px-3 py-2 text-sm font-medium ${
                    selectedTimeframe === '30d'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300 focus:z-10 focus:outline-none`}
                >
                  30 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeframeChange('90d')}
                  className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
                    selectedTimeframe === '90d'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300 focus:z-10 focus:outline-none`}
                >
                  90 Days
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total Streams"
              value={formatNumber(kpiData.streams.value)}
              change={kpiData.streams.change}
              icon={<ChartBarIcon className="h-6 w-6" />}
              onClick={() => setSelectedMetric('streams')}
              isSelected={selectedMetric === 'streams'}
              isLoading={isLoading}
            />
            <KpiCard
              title="Followers"
              value={formatNumber(kpiData.followers.value)}
              change={kpiData.followers.change}
              icon={<UserGroupIcon className="h-6 w-6" />}
              onClick={() => setSelectedMetric('followers')}
              isSelected={selectedMetric === 'followers'}
              isLoading={isLoading}
            />
            <KpiCard
              title="Revenue"
              value={formatCurrency(kpiData.revenue.value)}
              change={kpiData.revenue.change}
              icon={<CurrencyDollarIcon className="h-6 w-6" />}
              onClick={() => setSelectedMetric('revenue')}
              isSelected={selectedMetric === 'revenue'}
              isLoading={isLoading}
            />
            <KpiCard
              title="Engagement Rate"
              value={`${kpiData.engagement.value.toFixed(1)}%`}
              change={kpiData.engagement.change}
              icon={<ChartBarIcon className="h-6 w-6" />}
              isLoading={isLoading}
            />
          </div>

          {/* Performance Chart */}
          <div className="mt-8">
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Performance Overview</h2>
                <div className="mt-4 h-80">
                  <PerformanceChart data={performanceData} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tracks and Releases */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Recent Tracks */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Tracks</h2>
                  <Link href="/tracks" className="text-sm font-medium text-primary hover:text-primary-dark">
                    View all
                  </Link>
                </div>
                <div className="mt-4">
                  <TrackList 
                    tracks={tracks.slice(0, 5)} 
                    isLoading={isLoading} 
                    compact={true} 
                  />
                </div>
              </div>
            </div>

            {/* Recent Releases */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Releases</h2>
                  <Link href="/releases" className="text-sm font-medium text-primary hover:text-primary-dark">
                    View all
                  </Link>
                </div>
                <div className="mt-4">
                  <ReleaseList 
                    releases={releases.slice(0, 3)} 
                    isLoading={isLoading} 
                    compact={true} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Audience Insights */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Demographics */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Audience Demographics</h2>
                <div className="mt-4 h-80">
                  <AudienceDemographics data={audienceDemographics} isLoading={isLoading} />
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Geographic Distribution</h2>
                <div className="mt-4 h-80">
                  <GeographicDistribution data={geographicDistribution} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <Link href="/tracks/upload" className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary">
                    <MusicalNoteIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">Upload Track</span>
                  </Link>
                  <Link href="/releases/new" className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary">
                    <CalendarIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">Create Release</span>
                  </Link>
                  <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary">
                    <GlobeAltIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">Promote Music</span>
                  </button>
                  <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary">
                    <ChartBarIcon className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900">Export Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default EnhancedDashboard;