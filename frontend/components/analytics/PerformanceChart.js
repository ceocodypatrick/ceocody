import { useState, useEffect, useRef } from 'react';
import { 
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart = ({ 
  timeRange = '30days',
  dataType = 'streams',
  height = 300,
  showLegend = true,
  showGrid = true,
  fillArea = true,
  customColors = null
}) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default colors for different data types
  const defaultColors = {
    streams: {
      primary: 'rgba(79, 70, 229, 1)',
      background: 'rgba(79, 70, 229, 0.1)'
    },
    revenue: {
      primary: 'rgba(16, 185, 129, 1)',
      background: 'rgba(16, 185, 129, 0.1)'
    },
    followers: {
      primary: 'rgba(245, 158, 11, 1)',
      background: 'rgba(245, 158, 11, 0.1)'
    },
    saves: {
      primary: 'rgba(239, 68, 68, 1)',
      background: 'rgba(239, 68, 68, 0.1)'
    }
  };
  
  // Get colors based on data type or custom colors
  const colors = customColors || defaultColors[dataType] || defaultColors.streams;
  
  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format currency
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // For the prototype, we'll use mock data
        const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
        const data = await response.json();
        
        // Process data based on dataType
        let chartLabels, chartValues;
        
        if (dataType === 'streams') {
          chartLabels = data.analytics.streamsTrend.map(item => formatDate(item.date));
          chartValues = data.analytics.streamsTrend.map(item => item.streams);
        } else if (dataType === 'revenue') {
          chartLabels = data.analytics.revenueTrend.map(item => formatDate(item.date));
          chartValues = data.analytics.revenueTrend.map(item => item.revenue);
        } else {
          // Default to streams if dataType is not recognized
          chartLabels = data.analytics.streamsTrend.map(item => formatDate(item.date));
          chartValues = data.analytics.streamsTrend.map(item => item.streams);
        }
        
        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: dataType.charAt(0).toUpperCase() + dataType.slice(1),
              data: chartValues,
              borderColor: colors.primary,
              backgroundColor: fillArea ? colors.background : 'transparent',
              borderWidth: 2,
              pointBackgroundColor: colors.primary,
              pointBorderColor: '#fff',
              pointBorderWidth: 1,
              pointRadius: 3,
              pointHoverRadius: 5,
              tension: 0.3,
              fill: fillArea
            }
          ]
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data. Please try again later.');
        setIsLoading(false);
        
        // For prototype, generate mock data if API fails
        generateMockData();
      }
    };
    
    // Generate mock data for prototype
    const generateMockData = () => {
      const today = new Date();
      const labels = [];
      const values = [];
      
      // Generate dates and values based on timeRange
      const daysToGenerate = timeRange === '7days' ? 7 : 
                            timeRange === '30days' ? 30 : 
                            timeRange === '90days' ? 90 : 30;
      
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        labels.push(formatDate(date));
        
        // Generate realistic looking data with an upward trend and some variation
        const baseValue = dataType === 'streams' ? 8000 : 
                         dataType === 'revenue' ? 50 : 
                         dataType === 'followers' ? 100 : 200;
        
        const trendFactor = 1 + ((daysToGenerate - i) / daysToGenerate) * 0.5; // 0-50% increase over time
        const randomVariation = 0.8 + Math.random() * 0.4; // 80-120% random variation
        const value = Math.round(baseValue * trendFactor * randomVariation);
        
        values.push(value);
      }
      
      setChartData({
        labels: labels,
        datasets: [
          {
            label: dataType.charAt(0).toUpperCase() + dataType.slice(1),
            data: values,
            borderColor: colors.primary,
            backgroundColor: fillArea ? colors.background : 'transparent',
            borderWidth: 2,
            pointBackgroundColor: colors.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: fillArea
          }
        ]
      });
      
      setIsLoading(false);
    };
    
    // For prototype, use mock data directly
    generateMockData();
    
    // In a real app, uncomment this to fetch from API
    // fetchData();
  }, [timeRange, dataType, fillArea, colors]);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (dataType === 'revenue') {
              label += formatCurrency(context.parsed.y);
            } else {
              label += formatNumber(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          drawBorder: showGrid,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 0,
          maxTicksLimit: 10
        }
      },
      y: {
        grid: {
          display: showGrid,
          drawBorder: showGrid,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 10
          },
          callback: function(value) {
            if (dataType === 'revenue') {
              return '$' + value;
            }
            
            // For large numbers, use K/M notation
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value;
          }
        },
        beginAtZero: true
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.3
      }
    }
  };
  
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-md"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-md"
        style={{ height: `${height}px` }}
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  return (
    <div style={{ height: `${height}px` }}>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default PerformanceChart;