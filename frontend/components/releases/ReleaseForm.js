import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  PlusIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  ExclamationCircleIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/solid';

const ReleaseForm = ({ 
  initialData = null,
  onSubmit,
  onCancel,
  className = ''
}) => {
  // Default release data
  const defaultData = {
    title: '',
    type: 'single',
    releaseDate: '',
    tracks: [],
    coverUrl: '',
    description: '',
    genres: [],
    language: 'English',
    recordLabel: '',
    upc: '',
    visibility: 'public'
  };
  
  // Form state
  const [formData, setFormData] = useState(initialData || defaultData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState(initialData?.coverUrl || '');
  const [availableTracks, setAvailableTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  
  // Genre options
  const genreOptions = [
    'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 'Dance', 'Jazz', 'Blues',
    'Country', 'Folk', 'Classical', 'Reggae', 'Metal', 'Punk', 'Soul',
    'Funk', 'Indie', 'Alternative', 'Latin', 'World', 'Gospel', 'Ambient',
    'Soundtrack', 'Children\'s', 'Comedy', 'Spoken Word'
  ];
  
  // Language options
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Japanese', 'Chinese', 'Korean', 'Arabic', 'Hindi',
    'Instrumental', 'Other'
  ];
  
  // Load available tracks
  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoadingTracks(true);
      
      try {
        // In a real app, this would be an API call
        // For the prototype, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock tracks data
        const mockTracks = [
          {
            id: 'track1',
            title: 'Midnight Dreams',
            duration: 215,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
          },
          {
            id: 'track2',
            title: 'Electric Dreams',
            duration: 187,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
          },
          {
            id: 'track3',
            title: 'Midnight Blues',
            duration: 242,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
          },
          {
            id: 'track4',
            title: 'Urban Jungle',
            duration: 198,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
          },
          {
            id: 'track5',
            title: 'Neon Lights',
            duration: 225,
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
          }
        ];
        
        setAvailableTracks(mockTracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setIsLoadingTracks(false);
      }
    };
    
    fetchTracks();
  }, []);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle cover image upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ 
        ...prev, 
        coverUrl: 'Please upload an image file (JPEG, PNG, etc.)' 
      }));
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ 
        ...prev, 
        coverUrl: 'Image size should be less than 5MB' 
      }));
      return;
    }
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
    
    // In a real app, this would upload the file to a server
    // For the prototype, we'll just use the object URL
    setFormData(prev => ({ ...prev, coverUrl: objectUrl }));
    
    // Clear error
    if (errors.coverUrl) {
      setErrors(prev => ({ ...prev, coverUrl: null }));
    }
  };
  
  // Handle genre selection
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add genre if not already in the list
      if (!formData.genres.includes(value)) {
        setFormData(prev => ({ 
          ...prev, 
          genres: [...prev.genres, value] 
        }));
      }
    } else {
      // Remove genre
      setFormData(prev => ({ 
        ...prev, 
        genres: prev.genres.filter(genre => genre !== value) 
      }));
    }
    
    // Clear error
    if (errors.genres) {
      setErrors(prev => ({ ...prev, genres: null }));
    }
  };
  
  // Handle track selection
  const handleTrackSelection = (track) => {
    // Check if track is already in the list
    const isSelected = formData.tracks.some(t => t.id === track.id);
    
    if (isSelected) {
      // Remove track
      setFormData(prev => ({ 
        ...prev, 
        tracks: prev.tracks.filter(t => t.id !== track.id) 
      }));
    } else {
      // Add track with track number
      const newTrack = {
        ...track,
        trackNumber: formData.tracks.length + 1
      };
      
      setFormData(prev => ({ 
        ...prev, 
        tracks: [...prev.tracks, newTrack] 
      }));
    }
    
    // Clear error
    if (errors.tracks) {
      setErrors(prev => ({ ...prev, tracks: null }));
    }
  };
  
  // Handle track reordering
  const handleTrackReorder = (trackId, direction) => {
    const trackIndex = formData.tracks.findIndex(t => t.id === trackId);
    if (trackIndex === -1) return;
    
    // Can't move first track up or last track down
    if (
      (direction === 'up' && trackIndex === 0) || 
      (direction === 'down' && trackIndex === formData.tracks.length - 1)
    ) {
      return;
    }
    
    // Create a copy of tracks array
    const newTracks = [...formData.tracks];
    
    // Swap tracks
    const swapIndex = direction === 'up' ? trackIndex - 1 : trackIndex + 1;
    [newTracks[trackIndex], newTracks[swapIndex]] = [newTracks[swapIndex], newTracks[trackIndex]];
    
    // Update track numbers
    const updatedTracks = newTracks.map((track, index) => ({
      ...track,
      trackNumber: index + 1
    }));
    
    setFormData(prev => ({ ...prev, tracks: updatedTracks }));
  };
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Release title is required';
    }
    
    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required';
    } else {
      const selectedDate = new Date(formData.releaseDate);
      const today = new Date();
      
      if (selectedDate < today) {
        newErrors.releaseDate = 'Release date cannot be in the past';
      }
    }
    
    if (!formData.coverUrl) {
      newErrors.coverUrl = 'Cover artwork is required';
    }
    
    if (formData.tracks.length === 0) {
      newErrors.tracks = 'At least one track is required';
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'At least one genre is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // For the prototype, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call onSubmit callback with form data
      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Failed to submit form. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
      <h2 className="text-xl font-bold mb-6">
        {initialData ? 'Edit Release' : 'Create New Release'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Info Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter release title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
                <option value="compilation">Compilation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.releaseDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.releaseDate && (
                <p className="mt-1 text-sm text-red-600">{errors.releaseDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languageOptions.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Cover Artwork Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Cover Artwork</h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div 
                className={`border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center overflow-hidden ${
                  errors.coverUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {coverPreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={coverPreview} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      onClick={() => {
                        setCoverPreview('');
                        setFormData(prev => ({ ...prev, coverUrl: '' }));
                      }}
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer p-6 flex flex-col items-center justify-center w-full h-full">
                    <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Upload Cover Art</span>
                    <span className="text-xs text-gray-500 mt-1">3000 x 3000px recommended</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverUpload}
                    />
                  </label>
                )}
              </div>
              {errors.coverUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.coverUrl}</p>
              )}
            </div>
            
            <div className="flex-1">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter a description for your release"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Label (optional)
                </label>
                <input
                  type="text"
                  name="recordLabel"
                  value={formData.recordLabel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter record label name"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tracks Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Tracks</h3>
          
          <div className={`border rounded-lg ${errors.tracks ? 'border-red-500' : 'border-gray-200'}`}>
            {/* Selected tracks */}
            {formData.tracks.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium mb-2">Selected Tracks</h4>
                <div className="space-y-2">
                  {formData.tracks.map((track) => (
                    <div 
                      key={track.id} 
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium mr-3">
                          {track.trackNumber}
                        </div>
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-sm text-gray-500">{formatDuration(track.duration)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="p-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleTrackReorder(track.id, 'up')}
                          disabled={track.trackNumber === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleTrackReorder(track.id, 'down')}
                          disabled={track.trackNumber === formData.tracks.length}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="p-1 text-red-500 hover:text-red-700"
                          onClick={() => handleTrackSelection(track)}
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Available tracks */}
            <div className="p-4">
              <h4 className="font-medium mb-2">Available Tracks</h4>
              
              {isLoadingTracks ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading tracks...</p>
                </div>
              ) : availableTracks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No tracks available. Upload tracks first.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {availableTracks.map((track) => {
                    const isSelected = formData.tracks.some(t => t.id === track.id);
                    
                    return (
                      <div 
                        key={track.id} 
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                          isSelected ? 'bg-primary/10 border border-primary/30' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleTrackSelection(track)}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isSelected ? (
                              <CheckIcon className="h-5 w-5" />
                            ) : (
                              <PlusIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{track.title}</div>
                            <div className="text-sm text-gray-500">{formatDuration(track.duration)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {errors.tracks && (
            <p className="mt-1 text-sm text-red-600">{errors.tracks}</p>
          )}
        </div>
        
        {/* Genres Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Genres</h3>
          
          <div className={`border rounded-lg p-4 ${errors.genres ? 'border-red-500' : 'border-gray-200'}`}>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((genre) => (
                <label 
                  key={genre} 
                  className={`inline-flex items-center px-3 py-1.5 rounded-full cursor-pointer ${
                    formData.genres.includes(genre) 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.genres.includes(genre)}
                    onChange={handleGenreChange}
                    className="sr-only"
                  />
                  <span>{genre}</span>
                  {formData.genres.includes(genre) && (
                    <XMarkIcon 
                      className="h-4 w-4 ml-1" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleGenreChange({ target: { value: genre, checked: false } });
                      }}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
          
          {errors.genres && (
            <p className="mt-1 text-sm text-red-600">{errors.genres}</p>
          )}
        </div>
        
        {/* Additional Info Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPC (optional)
              </label>
              <input
                type="text"
                name="upc"
                value={formData.upc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter UPC code"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-5">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : initialData ? 'Update Release' : 'Create Release'}
          </button>
        </div>
        
        {errors.submit && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReleaseForm;