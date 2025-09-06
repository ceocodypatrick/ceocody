import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReleases,
  fetchReleaseById,
  createRelease,
  updateRelease,
  deleteRelease,
  uploadReleaseCover,
  addTracksToRelease,
  removeTrackFromRelease,
  submitForDistribution,
  getDistributionStatus,
  setFilters,
  resetFilters,
  clearUploadedCover,
} from '../slices/releasesSlice';

/**
 * Custom hook for releases management
 * @returns {Object} Releases data and operations
 */
const useReleases = () => {
  const dispatch = useDispatch();
  const {
    releases,
    currentRelease,
    uploadedCover,
    analytics,
    distributionStatus,
    isLoading,
    error,
    uploadProgress,
    createSuccess,
    updateSuccess,
    deleteSuccess,
    distributionSuccess,
    totalReleases,
    filters,
  } = useSelector((state) => state.releases);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Load releases with current filters and pagination
  const loadReleases = (newPage = page, newLimit = limit, newFilters = filters) => {
    dispatch(fetchReleases({
      page: newPage,
      limit: newLimit,
      ...newFilters,
    }));
  };

  // Load a specific release by ID
  const loadRelease = (id) => {
    dispatch(fetchReleaseById(id));
  };

  // Create a new release
  const handleCreateRelease = (releaseData) => {
    return dispatch(createRelease(releaseData));
  };

  // Update an existing release
  const handleUpdateRelease = (id, releaseData) => {
    return dispatch(updateRelease({ id, releaseData }));
  };

  // Delete a release
  const handleDeleteRelease = (id) => {
    return dispatch(deleteRelease(id));
  };

  // Upload release cover image
  const handleUploadCover = (file, onProgress) => {
    return dispatch(uploadReleaseCover({ file, onProgress }));
  };

  // Add tracks to a release
  const handleAddTracksToRelease = (releaseId, trackIds) => {
    return dispatch(addTracksToRelease({ releaseId, trackIds }));
  };

  // Remove a track from a release
  const handleRemoveTrackFromRelease = (releaseId, trackId) => {
    return dispatch(removeTrackFromRelease({ releaseId, trackId }));
  };

  // Submit a release for distribution
  const handleSubmitForDistribution = (id, platforms) => {
    return dispatch(submitForDistribution({ id, platforms }));
  };

  // Get distribution status for a release
  const handleGetDistributionStatus = (id) => {
    return dispatch(getDistributionStatus(id));
  };

  // Update filters and reload releases
  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    setPage(1); // Reset to first page when filters change
    loadReleases(1, limit, { ...filters, ...newFilters });
  };

  // Reset filters to default
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setPage(1);
    loadReleases(1, limit, {
      search: '',
      type: '',
      sortBy: 'releaseDate',
      sortOrder: 'desc',
    });
  };

  // Clear uploaded cover
  const handleClearUploadedCover = () => {
    dispatch(clearUploadedCover());
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadReleases(newPage, limit);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
    loadReleases(1, newLimit);
  };

  return {
    releases,
    currentRelease,
    uploadedCover,
    analytics,
    distributionStatus,
    isLoading,
    error,
    uploadProgress,
    createSuccess,
    updateSuccess,
    deleteSuccess,
    distributionSuccess,
    totalReleases,
    filters,
    page,
    limit,
    loadReleases,
    loadRelease,
    createRelease: handleCreateRelease,
    updateRelease: handleUpdateRelease,
    deleteRelease: handleDeleteRelease,
    uploadCover: handleUploadCover,
    addTracksToRelease: handleAddTracksToRelease,
    removeTrackFromRelease: handleRemoveTrackFromRelease,
    submitForDistribution: handleSubmitForDistribution,
    getDistributionStatus: handleGetDistributionStatus,
    updateFilters,
    resetFilters: handleResetFilters,
    clearUploadedCover: handleClearUploadedCover,
    onPageChange: handlePageChange,
    onLimitChange: handleLimitChange,
  };
};

export default useReleases;