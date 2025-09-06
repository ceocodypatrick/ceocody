import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import ReleaseForm from '../../components/releases/ReleaseForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const NewReleasePage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // For the prototype, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to the releases page
      router.push('/releases');
    } catch (error) {
      console.error('Error creating release:', error);
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push('/releases');
  };
  
  return (
    <MainLayout>
      <Head>
        <title>Create New Release | HARMONI</title>
        <meta name="description" content="Create a new music release" />
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
            <h1 className="text-2xl font-bold">Create New Release</h1>
            <p className="text-gray-600">Prepare your music for distribution</p>
          </div>
        </div>
      </div>
      
      {/* Release creation instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Release Creation Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Complete all required fields marked with an asterisk (*)</li>
                <li>Upload high-quality cover artwork (3000x3000px recommended)</li>
                <li>Select at least one track for your release</li>
                <li>Choose appropriate genres to help listeners discover your music</li>
                <li>Plan your release date at least 1-2 weeks in advance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Release form */}
      <ReleaseForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      
      {/* Release types explanation */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Understanding Release Types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-light p-5">
            <h3 className="text-lg font-medium mb-2">Single</h3>
            <p className="text-gray-600 mb-3">
              A standalone track released on its own. Singles are great for maintaining momentum between larger releases and testing new sounds.
            </p>
            <ul className="text-sm text-gray-600">
              <li className="mb-1">• Typically 1 track</li>
              <li className="mb-1">• Quick to produce and release</li>
              <li className="mb-1">• Ideal for regular engagement</li>
              <li>• Perfect for new artists</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            <h3 className="text-lg font-medium mb-2">EP</h3>
            <p className="text-gray-600 mb-3">
              An Extended Play release contains multiple tracks but is shorter than a full album. EPs are perfect for showcasing a collection of related songs.
            </p>
            <ul className="text-sm text-gray-600">
              <li className="mb-1">• Typically 2-6 tracks</li>
              <li className="mb-1">• Allows for artistic cohesion</li>
              <li className="mb-1">• More substantial than singles</li>
              <li>• Good for concept-based releases</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-light p-5">
            <h3 className="text-lg font-medium mb-2">Album</h3>
            <p className="text-gray-600 mb-3">
              A full-length collection of tracks designed to be experienced as a complete work. Albums represent significant artistic statements.
            </p>
            <ul className="text-sm text-gray-600">
              <li className="mb-1">• Typically 7+ tracks</li>
              <li className="mb-1">• Comprehensive artistic statement</li>
              <li className="mb-1">• Opportunity for storytelling</li>
              <li>• Major milestone releases</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Distribution platforms */}
      <div className="mt-8 mb-6">
        <h2 className="text-xl font-bold mb-4">Distribution Platforms</h2>
        
        <div className="bg-white rounded-lg shadow-light p-5">
          <p className="text-gray-600 mb-4">
            Your music will be distributed to all major streaming platforms and stores, including:
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Spotify', logo: '🎵' },
              { name: 'Apple Music', logo: '🍎' },
              { name: 'YouTube Music', logo: '▶️' },
              { name: 'Amazon Music', logo: '📦' },
              { name: 'Tidal', logo: '🌊' },
              { name: 'Deezer', logo: '🎧' },
              { name: 'Pandora', logo: '📻' },
              { name: 'TikTok', logo: '📱' },
              { name: 'Instagram', logo: '📷' },
              { name: 'Facebook', logo: '👥' },
              { name: 'Beatport', logo: '🎚️' },
              { name: 'Traxsource', logo: '💿' }
            ].map((platform, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md">
                <div className="text-2xl mb-2">{platform.logo}</div>
                <div className="text-sm font-medium text-center">{platform.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewReleasePage;