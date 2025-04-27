import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ClimateChart.css';

const ClimateChart = ({ 
  data, 
  type = 'line', 
  title = 'Climate Data', 
  xLabel = 'Time', 
  yLabel = 'Value',
  backgroundColor = 'rgba(44, 140, 153, 0.2)',
  borderColor = 'rgba(44, 140, 153, 1)'
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart if data is available
    if (data && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: type,
        data: {
          labels: data.labels || [],
          datasets: [{
            label: title,
            data: data.values || [],
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: type === 'line' ? true : undefined
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            title: {
              display: true,
              text: title,
              font: {
                size: 16
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: xLabel
              },
              grid: {
                display: false
              }
            },
            y: {
              title: {
                display: true,
                text: yLabel
              },
              beginAtZero: type !== 'line'
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, title, xLabel, yLabel, backgroundColor, borderColor]);

  return (
    <div className="climate-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ClimateChart;