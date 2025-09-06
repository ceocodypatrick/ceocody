import apiClient from './apiClient';

const releasesService = {
  /**
   * Get all releases for the current user
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with releases data
   */
  getAllReleases: async (params = {}) => {
    try {
      const response = await apiClient.get('/releases', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching releases:', error);
      throw error;
    }
  },

  /**
   * Get a single release by ID
   * @param {string} id - Release ID
   * @returns {Promise} - Promise with release data
   */
  getReleaseById: async (id) => {
    try {
      const response = await apiClient.get(`/releases/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching release ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new release
   * @param {Object} releaseData - Release data
   * @returns {Promise} - Promise with created release data
   */
  createRelease: async (releaseData) => {
    try {
      const response = await apiClient.post('/releases', releaseData);
      return response.data;
    } catch (error) {
      console.error('Error creating release:', error);
      throw error;
    }
  },

  /**
   * Update an existing release
   * @param {string} id - Release ID
   * @param {Object} releaseData - Updated release data
   * @returns {Promise} - Promise with updated release data
   */
  updateRelease: async (id, releaseData) => {
    try {
      const response = await apiClient.put(`/releases/${id}`, releaseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating release ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a release
   * @param {string} id - Release ID
   * @returns {Promise} - Promise with deletion result
   */
  deleteRelease: async (id) => {
    try {
      const response = await apiClient.delete(`/releases/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting release ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload release cover image
   * @param {File} file - Image file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} - Promise with upload result
   */
  uploadReleaseCover: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post('/releases/cover', formData, {
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
      console.error('Error uploading release cover:', error);
      throw error;
    }
  },

  /**
   * Add tracks to a release
   * @param {string} releaseId - Release ID
   * @param {Array} trackIds - Array of track IDs to add
   * @returns {Promise} - Promise with updated release data
   */
  addTracksToRelease: async (releaseId, trackIds) => {
    try {
      const response = await apiClient.post(`/releases/${releaseId}/tracks`, { trackIds });
      return response.data;
    } catch (error) {
      console.error(`Error adding tracks to release ${releaseId}:`, error);
      throw error;
    }
  },

  /**
   * Remove a track from a release
   * @param {string} releaseId - Release ID
   * @param {string} trackId - Track ID to remove
   * @returns {Promise} - Promise with updated release data
   */
  removeTrackFromRelease: async (releaseId, trackId) => {
    try {
      const response = await apiClient.delete(`/releases/${releaseId}/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing track ${trackId} from release ${releaseId}:`, error);
      throw error;
    }
  },

  /**
   * Get release analytics
   * @param {string} id - Release ID
   * @param {Object} params - Query parameters (timeframe, etc.)
   * @returns {Promise} - Promise with release analytics data
   */
  getReleaseAnalytics: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`/releases/${id}/analytics`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching analytics for release ${id}:`, error);
      throw error;
    }
  },

  /**
   * Submit release for distribution
   * @param {string} id - Release ID
   * @param {Array} platforms - Array of platforms to distribute to
   * @returns {Promise} - Promise with distribution result
   */
  submitForDistribution: async (id, platforms) => {
    try {
      const response = await apiClient.post(`/releases/${id}/distribute`, { platforms });
      return response.data;
    } catch (error) {
      console.error(`Error submitting release ${id} for distribution:`, error);
      throw error;
    }
  },

  /**
   * Get distribution status for a release
   * @param {string} id - Release ID
   * @returns {Promise} - Promise with distribution status data
   */
  getDistributionStatus: async (id) => {
    try {
      const response = await apiClient.get(`/releases/${id}/distribution`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching distribution status for release ${id}:`, error);
      throw error;
    }
  }
};

export default releasesService;