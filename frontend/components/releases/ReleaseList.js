import { useState } from 'react';
import Link from 'next/link';
import { 
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ChartBarIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const ReleaseList = ({ 
  releases = [], 
  isLoading = false,
  onEdit = null,
  onDelete = null,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'singles', 'eps', 'albums'
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Filter releases
  const filteredReleases = releases.filter(release => {
    if (filter === 'all') return true;
    if (filter === 'singles') return release.type === 'single';
    if (filter === 'eps') return release.type === 'ep';
    if (filter === 'albums') return release.type === 'album';
    return true;
  });
  
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (releases.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900">No releases found</h3>
          <p className="mt-2 text-gray-500">
            Get started by creating your first release.
          </p>
          <div className="mt-6">
            <Link href="/releases/new" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
              Create Release
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-light overflow-hidden ${className}`}>
      {/* Header with filters and view toggle */}
      <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Your Releases</h2>
          <p className="text-sm text-gray-500">{releases.length} releases</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filter buttons */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                filter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'singles' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300'
              }`}
              onClick={() => setFilter('singles')}
            >
              Singles
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'eps' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300'
              }`}
              onClick={() => setFilter('eps')}
            >
              EPs
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                filter === 'albums' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              onClick={() => setFilter('albums')}
            >
              Albums
            </button>
          </div>
          
          {/* View toggle */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                viewMode === 'grid' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              onClick={() => setViewMode('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Create new release button */}
          <Link 
            href="/releases/new" 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Release
          </Link>
        </div>
      </div>
      
      {/* Grid view */}
      {viewMode === 'grid' && (
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredReleases.map((release) => (
              <div 
                key={release.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/releases/${release.id}`} className="block">
                  <div 
                    className="aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${release.coverUrl})` }}
                  ></div>
                </Link>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-500 uppercase">
                      {release.type}
                    </div>
                    
                    {release.visibility !== 'public' && (
                      <div className="flex items-center text-xs text-gray-500">
                        <EyeSlashIcon className="h-4 w-4 mr-1" />
                        {release.visibility}
                      </div>
                    )}
                  </div>
                  
                  <Link href={`/releases/${release.id}`} className="block mt-1">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-primary truncate">{release.title}</h3>
                  </Link>
                  
                  <div className="mt-1 text-sm text-gray-500">
                    {formatDate(release.releaseDate)}
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <ChartBarIcon className="h-4 w-4 mr-1" />
                    {formatNumber(release.streams || 0)} streams
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {release.totalTracks} {release.totalTracks === 1 ? 'track' : 'tracks'}
                    </div>
                    
                    <div className="relative">
                      <div className="dropdown">
                        <button className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none">
                          <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        <div className="dropdown-menu hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1" role="none">
                            <Link href={`/releases/${release.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View Details
                            </Link>
                            {onEdit && (
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => onEdit(release.id)}
                              >
                                Edit Release
                              </button>
                            )}
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Share Release
                            </button>
                            <Link href={`/analytics/releases/${release.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View Analytics
                            </Link>
                            {onDelete && (
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => onDelete(release.id)}
                              >
                                Delete Release
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* List view */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Release
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Release Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracks
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Streams
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReleases.map((release) => (
                <tr key={release.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <img 
                          src={release.coverUrl} 
                          alt={release.title} 
                          className="h-12 w-12 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <Link href={`/releases/${release.id}`} className="text-sm font-medium text-gray-900 hover:text-primary">
                          {release.title}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{release.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(release.releaseDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{release.totalTracks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatNumber(release.streams || 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      release.visibility === 'public' ? 'bg-green-100 text-green-800' :
                      release.visibility === 'private' ? 'bg-red-100 text-red-800' :
                      release.visibility === 'unlisted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {release.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/releases/${release.id}`} 
                        className="text-gray-500 hover:text-gray-700"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      
                      <Link 
                        href={`/analytics/releases/${release.id}`} 
                        className="text-gray-500 hover:text-gray-700"
                        title="View Analytics"
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </Link>
                      
                      <button 
                        className="text-gray-500 hover:text-gray-700"
                        title="Share Release"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </button>
                      
                      {onEdit && (
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => onEdit(release.id)}
                          title="Edit Release"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      {onDelete && (
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onDelete(release.id)}
                          title="Delete Release"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add some JavaScript to handle dropdown menus */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
              const button = dropdown.querySelector('button');
              const menu = dropdown.querySelector('.dropdown-menu');
              
              button.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
              });
              
              document.addEventListener('click', () => {
                menu.classList.add('hidden');
              });
            });
          });
        `
      }} />
    </div>
  );
};

export default ReleaseList;