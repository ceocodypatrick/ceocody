import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import TrackUpload from '../../components/tracks/TrackUpload-updated';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTracks } from '../../utils/hooks';

const TrackUploadPage = () => {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Use the custom tracks hook
  const { 
    createSuccess, 
    tracks, 
    resetSuccess 
  } = useTracks();
  
  // Handle upload complete
  const handleUploadComplete = (files) => {
    setUploadedFiles(files);
    setShowSuccess(true);
  };
  
  // Handle continue to metadata
  const handleContinueToMetadata = () => {
    // Navigate to the first uploaded track for metadata editing
    if (uploadedFiles.length > 0 && uploadedFiles[0].audioId) {
      router.push(`/tracks/${uploadedFiles[0].audioId}/edit`);
    } else {
      // Fallback to tracks list
      router.push('/tracks');
    }
  };
  
  // Handle upload more
  const handleUploadMore = () => {
    setUploadedFiles([]);
    setShowSuccess(false);
    resetSuccess();
  };
  
  return (
    <MainLayout>
      <Head>
        <title>Upload Tracks | HARMONI</title>
        <meta name="description" content="Upload your music tracks" />
      </Head>
      
      <div className="mb-6">
        <div className="flex items-center">
          <button
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Upload Tracks</h1>
            <p className="text-gray-600">Add new music to your catalog</p>
          </div>
        </div>
      </div>
      
      {/* Upload instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Upload Instructions</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Supported formats: MP3, WAV, FLAC, AAC, OGG</li>
                <li>Maximum file size: 50MB per track</li>
                <li>Higher quality files (320kbps or lossless) are recommended</li>
                <li>After upload, you'll be able to add metadata and artwork</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upload component */}
      {!showSuccess ? (
        <TrackUpload 
          onUploadComplete={handleUploadComplete}
          maxFileSize={50}
          allowedFileTypes={['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg']}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-light p-5">
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Upload Successful!</h3>
            <p className="mt-2 text-sm text-gray-500">
              {uploadedFiles.length} {uploadedFiles.length === 1 ? 'track' : 'tracks'} uploaded successfully.
            </p>
            
            {/* Uploaded files list */}
            <div className="mt-6 max-w-md mx-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-2 text-left">Uploaded Tracks:</h4>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="px-4 py-3 flex items-center bg-gray-50">
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round(file.fileSize / 1024 / 1024 * 10) / 10} MB • {Math.floor(file.duration / 60)}:{(file.duration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
                onClick={handleUploadMore}
              >
                Upload More Tracks
              </button>
              
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none"
                onClick={handleContinueToMetadata}
              >
                Continue to Metadata
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Best practices */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Best Practices for Music Uploads</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-light p-5">
            <div className="text-primary mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Audio Quality</h3>
            <p className="text-gray-600">
              Upload high-quality audio files (320kbps MP3 or lossless formats like WAV or FLAC) for the best listening experience. Avoid compressed or low-quality sources.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            <div className="text-primary mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Metadata</h3>
            <p className="text-gray-600">
              Complete and accurate metadata helps listeners find your music. Include correct titles, featured artists, genres, and release information.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            <div className="text-primary mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Artwork</h3>
            <p className="text-gray-600">
              Use high-resolution artwork (3000x3000px recommended) that represents your music and brand. Ensure it meets distribution platform requirements.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrackUploadPage;