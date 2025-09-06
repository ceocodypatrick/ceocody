import { useState, useRef, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationCircleIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/solid';

const TrackUpload = ({ 
  onUploadComplete = () => {},
  maxFileSize = 50, // in MB
  allowedFileTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg'],
  className = ''
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map(file => ({
      file,
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending', // pending, uploading, success, error
      error: null
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };
  
  // Handle file removal
  const handleRemoveFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Validate file
  const validateFile = (file) => {
    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload audio files only.'
      };
    }
    
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return {
        valid: false,
        error: `File size exceeds the ${maxFileSize}MB limit.`
      };
    }
    
    return { valid: true };
  };
  
  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0 || isUploading) return;
    
    setIsUploading(true);
    
    // Validate all files first
    const updatedFiles = files.map(file => {
      const validation = validateFile(file.file);
      
      if (!validation.valid) {
        return {
          ...file,
          status: 'error',
          error: validation.error
        };
      }
      
      return {
        ...file,
        status: 'uploading'
      };
    });
    
    setFiles(updatedFiles);
    
    // Upload each valid file
    const uploadPromises = updatedFiles
      .filter(file => file.status === 'uploading')
      .map(async (file) => {
        try {
          // In a real app, this would be an API call to upload the file
          // For the prototype, we'll simulate the upload with a delay
          
          // Create a FormData object
          const formData = new FormData();
          formData.append('file', file.file);
          formData.append('fileName', file.name);
          
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, progress } : f
            ));
          }
          
          // Simulate API response
          const response = {
            success: true,
            fileUrl: URL.createObjectURL(file.file),
            fileName: file.name,
            fileSize: file.size,
            duration: Math.floor(Math.random() * 300) + 120 // Random duration between 2-7 minutes
          };
          
          // Update file status
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'success',
              progress: 100,
              response
            } : f
          ));
          
          return response;
        } catch (error) {
          console.error('Error uploading file:', error);
          
          // Update file status
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'error',
              error: 'Failed to upload file. Please try again.'
            } : f
          ));
          
          return null;
        }
      });
    
    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    
    // Filter out failed uploads
    const successfulUploads = results.filter(result => result !== null);
    
    // Call the onUploadComplete callback with the results
    if (successfulUploads.length > 0) {
      onUploadComplete(successfulUploads);
    }
    
    setIsUploading(false);
  };
  
  // Get upload status summary
  const getUploadStatus = () => {
    const total = files.length;
    const pending = files.filter(file => file.status === 'pending').length;
    const uploading = files.filter(file => file.status === 'uploading').length;
    const success = files.filter(file => file.status === 'success').length;
    const error = files.filter(file => file.status === 'error').length;
    
    return { total, pending, uploading, success, error };
  };
  
  // Check if all files are uploaded
  const allFilesProcessed = () => {
    if (files.length === 0) return false;
    
    return files.every(file => 
      file.status === 'success' || file.status === 'error'
    );
  };
  
  // Reset the upload form
  const resetUpload = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
      <h3 className="font-semibold mb-4">Upload Tracks</h3>
      
      {/* Drop zone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={allowedFileTypes.join(',')}
          multiple
          onChange={handleFileInputChange}
        />
        
        <CloudArrowUpIcon className="h-12 w-12 mx-auto text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-900">
          Drag and drop audio files here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported formats: MP3, WAV, FLAC, AAC, OGG (max {maxFileSize}MB)
        </p>
      </div>
      
      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Files ({files.length})</h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map(file => (
              <div 
                key={file.id} 
                className={`border rounded-lg p-3 flex items-center ${
                  file.status === 'error' ? 'border-red-300 bg-red-50' :
                  file.status === 'success' ? 'border-green-300 bg-green-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {file.status === 'error' ? (
                    <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
                  ) : file.status === 'success' ? (
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <MusicalNoteIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {file.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">
                      {file.error}
                    </p>
                  )}
                  
                  {(file.status === 'uploading' || file.status === 'success') && (
                    <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          file.status === 'success' ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                <button 
                  className="ml-3 flex-shrink-0 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  disabled={file.status === 'uploading'}
                >
                  <XMarkIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          
          {/* Upload status and actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {(() => {
                const status = getUploadStatus();
                
                if (status.uploading > 0) {
                  return `Uploading ${status.uploading} of ${status.total} files...`;
                }
                
                if (status.success > 0) {
                  return `${status.success} of ${status.total} files uploaded successfully${status.error > 0 ? `, ${status.error} failed` : ''}`;
                }
                
                return `${status.total} files selected`;
              })()}
            </div>
            
            <div className="flex space-x-3">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                onClick={resetUpload}
                disabled={isUploading}
              >
                Clear All
              </button>
              
              {allFilesProcessed() ? (
                <button
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none"
                  onClick={resetUpload}
                >
                  Upload More
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={uploadFiles}
                  disabled={isUploading || files.length === 0}
                >
                  {isUploading ? 'Uploading...' : 'Upload Files'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackUpload;