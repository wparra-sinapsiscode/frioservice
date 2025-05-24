import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ title, data, options = {} }) => {
  // Opciones predeterminadas para gráficos de barras
  const defaultOptions = {
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
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      }
    },
  };

  // Combinar las opciones predeterminadas con las opciones personalizadas
  const chartOptions = { ...defaultOptions, ...options };

  return (
    <div className="bg-white rounded shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium m-0">{title}</h3>
      </div>
      
      <div className="w-full h-[300px] relative">
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;