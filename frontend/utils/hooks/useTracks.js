import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTracks,
  fetchTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
  uploadTrackAudio,
  uploadTrackCover,
  setFilters,
  resetFilters,
  clearUploadedFiles,
} from '../slices/tracksSlice';

/**
 * Custom hook for tracks management
 * @returns {Object} Tracks data and operations
 */
const useTracks = () => {
  const dispatch = useDispatch();
  const {
    tracks,
    currentTrack,
    uploadedAudio,
    uploadedCover,
    isLoading,
    error,
    uploadProgress,
    createSuccess,
    updateSuccess,
    deleteSuccess,
    totalTracks,
    filters,
  } = useSelector((state) => state.tracks);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Load tracks with current filters and pagination
  const loadTracks = (newPage = page, newLimit = limit, newFilters = filters) => {
    dispatch(fetchTracks({
      page: newPage,
      limit: newLimit,
      ...newFilters,
    }));
  };

  // Load a specific track by ID
  const loadTrack = (id) => {
    dispatch(fetchTrackById(id));
  };

  // Create a new track
  const handleCreateTrack = (trackData) => {
    return dispatch(createTrack(trackData));
  };

  // Update an existing track
  const handleUpdateTrack = (id, trackData) => {
    return dispatch(updateTrack({ id, trackData }));
  };

  // Delete a track
  const handleDeleteTrack = (id) => {
    return dispatch(deleteTrack(id));
  };

  // Upload track audio file
  const handleUploadAudio = (file, onProgress) => {
    return dispatch(uploadTrackAudio({ file, onProgress }));
  };

  // Upload track cover image
  const handleUploadCover = (file, onProgress) => {
    return dispatch(uploadTrackCover({ file, onProgress }));
  };

  // Update filters and reload tracks
  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    setPage(1); // Reset to first page when filters change
    loadTracks(1, limit, { ...filters, ...newFilters });
  };

  // Reset filters to default
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setPage(1);
    loadTracks(1, limit, {
      search: '',
      genre: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  // Clear uploaded files
  const handleClearUploadedFiles = () => {
    dispatch(clearUploadedFiles());
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadTracks(newPage, limit);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
    loadTracks(1, newLimit);
  };

  return {
    tracks,
    currentTrack,
    uploadedAudio,
    uploadedCover,
    isLoading,
    error,
    uploadProgress,
    createSuccess,
    updateSuccess,
    deleteSuccess,
    totalTracks,
    filters,
    page,
    limit,
    loadTracks,
    loadTrack,
    createTrack: handleCreateTrack,
    updateTrack: handleUpdateTrack,
    deleteTrack: handleDeleteTrack,
    uploadAudio: handleUploadAudio,
    uploadCover: handleUploadCover,
    updateFilters,
    resetFilters: handleResetFilters,
    clearUploadedFiles: handleClearUploadedFiles,
    onPageChange: handlePageChange,
    onLimitChange: handleLimitChange,
  };
};

export default useTracks;