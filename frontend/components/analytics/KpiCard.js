import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const KpiCard = ({ 
  title, 
  value, 
  trend = 0, 
  icon = null, 
  formatter = null,
  trendFormatter = (val) => `${Math.abs(val)}%`,
  trendLabel = 'from last period',
  className = '',
  onClick = null
}) => {
  // Format the value if a formatter is provided
  const formattedValue = formatter ? formatter(value) : value;
  
  // Format trend value and determine if it's positive, negative, or neutral
  const formattedTrend = trendFormatter(trend);
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  
  // Determine trend color based on direction
  // For some metrics like "Cost per acquisition", down is good
  // This can be customized per KPI if needed
  const trendColor = trendDirection === 'up' ? 'text-green-600' : 
                    trendDirection === 'down' ? 'text-red-600' : 
                    'text-gray-500';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-light p-5 ${className} ${onClick ? 'cursor-pointer hover:shadow-medium transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
        {icon && (
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold">{formattedValue}</div>
      
      {trend !== null && (
        <div className={`flex items-center mt-2 text-sm ${trendColor}`}>
          {trendDirection === 'up' ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : trendDirection === 'down' ? (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          ) : (
            <span className="w-4 h-4 mr-1 inline-block">—</span>
          )}
          <span>{formattedTrend} {trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;