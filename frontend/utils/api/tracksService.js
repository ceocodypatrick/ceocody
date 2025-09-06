import apiClient from './apiClient';

const tracksService = {
  /**
   * Get all tracks for the current user
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with tracks data
   */
  getAllTracks: async (params = {}) => {
    try {
      const response = await apiClient.get('/tracks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    }
  },

  /**
   * Get a single track by ID
   * @param {string} id - Track ID
   * @returns {Promise} - Promise with track data
   */
  getTrackById: async (id) => {
    try {
      const response = await apiClient.get(`/tracks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching track ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new track
   * @param {Object} trackData - Track data
   * @returns {Promise} - Promise with created track data
   */
  createTrack: async (trackData) => {
    try {
      const response = await apiClient.post('/tracks', trackData);
      return response.data;
    } catch (error) {
      console.error('Error creating track:', error);
      throw error;
    }
  },

  /**
   * Update an existing track
   * @param {string} id - Track ID
   * @param {Object} trackData - Updated track data
   * @returns {Promise} - Promise with updated track data
   */
  updateTrack: async (id, trackData) => {
    try {
      const response = await apiClient.put(`/tracks/${id}`, trackData);
      return response.data;
    } catch (error) {
      console.error(`Error updating track ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a track
   * @param {string} id - Track ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteTrack: async (id) => {
    try {
      const response = await apiClient.delete(`/tracks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting track ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload track audio file
   * @param {File} file - Audio file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} - Promise with upload result
   */
  uploadTrackAudio: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await apiClient.post('/tracks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading track audio:', error);
      throw error;
    }
  },

  /**
   * Upload track cover image
   * @param {File} file - Image file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} - Promise with upload result
   */
  uploadTrackCover: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post('/tracks/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading track cover:', error);
      throw error;
    }
  },

  /**
   * Get track analytics
   * @param {string} id - Track ID
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with track analytics data
   */
  getTrackAnalytics: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`/tracks/${id}/analytics`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching analytics for track ${id}:`, error);
      throw error;
    }
  }
};

export default tracksService;