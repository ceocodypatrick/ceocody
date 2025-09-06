import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPerformanceOverview,
  fetchAudienceDemographics,
  fetchGeographicDistribution,
  fetchTopTracks,
  fetchTopReleases,
  setTimeframe,
} from '../slices/analyticsSlice';

/**
 * Custom hook for analytics data and operations
 * @param {string} initialTimeframe - Initial timeframe for analytics (e.g., '7d', '30d', '90d')
 * @returns {Object} Analytics data and operations
 */
const useAnalytics = (initialTimeframe = '30d') => {
  const dispatch = useDispatch();
  const {
    performanceOverview,
    audienceDemographics,
    geographicDistribution,
    topTracks,
    topReleases,
    isLoading,
    error,
    timeframe,
  } = useSelector((state) => state.analytics);

  const [initialized, setInitialized] = useState(false);

  // Set initial timeframe if provided
  useEffect(() => {
    if (initialTimeframe && !initialized) {
      dispatch(setTimeframe(initialTimeframe));
      setInitialized(true);
    }
  }, [dispatch, initialTimeframe, initialized]);

  // Load analytics data
  const loadAnalyticsData = (tf = timeframe) => {
    dispatch(fetchPerformanceOverview({ timeframe: tf }));
    dispatch(fetchAudienceDemographics({ timeframe: tf }));
    dispatch(fetchGeographicDistribution({ timeframe: tf }));
    dispatch(fetchTopTracks({ timeframe: tf, limit: 10 }));
    dispatch(fetchTopReleases({ timeframe: tf, limit: 5 }));
  };

  // Change timeframe and reload data
  const changeTimeframe = (newTimeframe) => {
    dispatch(setTimeframe(newTimeframe));
    loadAnalyticsData(newTimeframe);
  };

  // Load data on initial render if initialized
  useEffect(() => {
    if (initialized) {
      loadAnalyticsData();
    }
  }, [initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    performanceOverview,
    audienceDemographics,
    geographicDistribution,
    topTracks,
    topReleases,
    isLoading,
    error,
    timeframe,
    changeTimeframe,
    loadAnalyticsData,
  };
};

export default useAnalytics;