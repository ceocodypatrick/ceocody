import { useState } from 'react';

const GeographicDistribution = ({
  data = null,
  title = 'Geographic Distribution',
  maxItems = 5,
  showPercentage = true,
  showValue = true,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState(null);
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Generate mock data if none is provided
  const generateMockData = () => {
    return [
      { name: 'United States', code: 'US', icon: '🇺🇸', percent: 42, value: 103901 },
      { name: 'United Kingdom', code: 'GB', icon: '🇬🇧', percent: 18, value: 44529 },
      { name: 'Canada', code: 'CA', icon: '🇨🇦', percent: 12, value: 29686 },
      { name: 'Australia', code: 'AU', icon: '🇦🇺', percent: 8, value: 19791 },
      { name: 'Germany', code: 'DE', icon: '🇩🇪', percent: 6, value: 14843 },
      { name: 'France', code: 'FR', icon: '🇫🇷', percent: 4, value: 9895 },
      { name: 'Japan', code: 'JP', icon: '🇯🇵', percent: 3, value: 7421 },
      { name: 'Brazil', code: 'BR', icon: '🇧🇷', percent: 2, value: 4948 },
      { name: 'Netherlands', code: 'NL', icon: '🇳🇱', percent: 2, value: 4948 },
      { name: 'Other', code: 'OTHER', icon: '🌎', percent: 3, value: 7421 }
    ];
  };
  
  // Use provided data or generate mock data
  const locations = data || generateMockData();
  
  // Limit the number of items shown
  const displayedLocations = locations.slice(0, maxItems);
  
  // Calculate total for "Other" category if needed
  const hasMore = locations.length > maxItems;
  const otherLocations = hasMore ? locations.slice(maxItems) : [];
  const otherTotal = otherLocations.reduce((sum, loc) => sum + loc.value, 0);
  const otherPercent = otherLocations.reduce((sum, loc) => sum + loc.percent, 0);
  
  // If we have more locations than maxItems, add an "Other" category
  if (hasMore) {
    displayedLocations.push({
      name: 'Other',
      code: 'OTHER',
      icon: '🌎',
      percent: otherPercent,
      value: otherTotal
    });
  }
  
  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-white rounded-lg shadow-light p-5 ${className}`}
      >
        <div className="text-gray-500">Loading geographic data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-white rounded-lg shadow-light p-5 ${className}`}
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      
      <ul className="space-y-3">
        {displayedLocations.map((location) => (
          <li key={location.code} className="flex items-center py-2 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-lg mr-3">
              {location.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium">{location.name}</div>
              {showPercentage && (
                <div className="text-sm text-gray-500">{location.percent}% of total streams</div>
              )}
            </div>
            {showValue && (
              <div className="font-semibold">{formatNumber(location.value)}</div>
            )}
          </li>
        ))}
      </ul>
      
      {hasMore && (
        <div className="mt-3 text-center">
          <button className="text-sm text-primary hover:text-primary-dark">
            View All Countries
          </button>
        </div>
      )}
    </div>
  );
};

export default GeographicDistribution;