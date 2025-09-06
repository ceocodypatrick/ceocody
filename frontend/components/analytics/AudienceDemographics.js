import { useState } from 'react';
import { 
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend
);

const AudienceDemographics = ({ 
  data = null,
  title = 'Audience Demographics',
  type = 'age', // 'age', 'gender', 'platform', 'location'
  height = 300,
  showLegend = true,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState(null);
  
  // Color palettes for different chart types
  const colorPalettes = {
    age: [
      'rgba(79, 70, 229, 1)',   // Indigo
      'rgba(59, 130, 246, 1)',  // Blue
      'rgba(16, 185, 129, 1)',  // Green
      'rgba(245, 158, 11, 1)',  // Amber
      'rgba(239, 68, 68, 1)'    // Red
    ],
    gender: [
      'rgba(79, 70, 229, 1)',   // Indigo
      'rgba(236, 72, 153, 1)',  // Pink
      'rgba(16, 185, 129, 1)'   // Green
    ],
    platform: [
      'rgba(79, 70, 229, 1)',   // Indigo
      'rgba(59, 130, 246, 1)',  // Blue
      'rgba(16, 185, 129, 1)',  // Green
      'rgba(245, 158, 11, 1)'   // Amber
    ],
    location: [
      'rgba(79, 70, 229, 1)',   // Indigo
      'rgba(59, 130, 246, 1)',  // Blue
      'rgba(16, 185, 129, 1)',  // Green
      'rgba(245, 158, 11, 1)',  // Amber
      'rgba(239, 68, 68, 1)'    // Red
    ]
  };
  
  // Generate mock data if none is provided
  const generateMockData = () => {
    if (type === 'age') {
      return {
        labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
        datasets: [{
          data: [32, 41, 18, 6, 3],
          backgroundColor: colorPalettes.age,
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 4
        }]
      };
    } else if (type === 'gender') {
      return {
        labels: ['Male', 'Female', 'Non-binary/Other'],
        datasets: [{
          data: [58, 41, 1],
          backgroundColor: colorPalettes.gender,
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 4
        }]
      };
    } else if (type === 'platform') {
      return {
        labels: ['Mobile', 'Desktop', 'Tablet', 'Smart Speaker'],
        datasets: [{
          data: [68, 24, 5, 3],
          backgroundColor: colorPalettes.platform,
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 4
        }]
      };
    } else if (type === 'location') {
      return {
        labels: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Other'],
        datasets: [{
          data: [42, 18, 12, 8, 20],
          backgroundColor: colorPalettes.location,
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 4
        }]
      };
    }
    
    // Default fallback
    return {
      labels: ['Category 1', 'Category 2', 'Category 3'],
      datasets: [{
        data: [60, 30, 10],
        backgroundColor: colorPalettes.age.slice(0, 3),
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 4
      }]
    };
  };
  
  // Use provided data or generate mock data
  const chartData = data || generateMockData();
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const backgroundColor = dataset.backgroundColor[i];
                
                return {
                  text: `${label} (${value}%)`,
                  fillStyle: backgroundColor,
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  hidden: isNaN(dataset.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                  index: i
                };
              });
            }
            return [];
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
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    cutout: '60%',
    layout: {
      padding: 10
    }
  };
  
  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-white rounded-lg shadow-light p-5 ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-500">Loading demographic data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-white rounded-lg shadow-light p-5 ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-light p-5 ${className}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div style={{ height: `${height - 50}px` }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AudienceDemographics;