import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = ({ title, data }) => {
  const [activeView, setActiveView] = useState('month');

  // Opciones del chart mejoradas
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter',
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          precision: 0,
          font: {
            size: 11,
            family: 'Inter',
          },
        },
      }
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 6,
        hoverRadius: 8,
      },
    },
  };

  // Cambiar vista del chart (día, mes, año)
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="card-gradient p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 m-0">{title}</h3>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeView === 'day' 
                ? 'bg-white text-accent-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleViewChange('day')}
          >
            Día
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeView === 'month' 
                ? 'bg-white text-accent-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleViewChange('month')}
          >
            Mes
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeView === 'year' 
                ? 'bg-white text-accent-700 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleViewChange('year')}
          >
            Año
          </button>
        </div>
      </div>
      
      <div className="w-full h-[350px] relative bg-white/50 rounded-xl p-4">
        <Line 
          options={options} 
          data={
            activeView === 'day' ? data.day : 
            activeView === 'month' ? data.month : 
            data.year
          } 
        />
      </div>
    </div>
  );
};

export default ChartContainer;