import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ title, data, options = {} }) => {
  // Opciones predeterminadas para gráficos de tipo pie
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const labelIndex = context.dataIndex;
            const value = context.dataset.data[labelIndex];
            const label = context.chart.data.labels[labelIndex];
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
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
        <Pie data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default PieChart;