import React, { useState } from 'react';
import { FaFileExport } from 'react-icons/fa';
import StatsCard from '../components/dashboard/StatsCard';
import BarChart from '../components/dashboard/BarChart';
import LineChart from '../components/dashboard/LineChart';
import PieChart from '../components/dashboard/PieChart';
import {
  statsCardData,
  servicesByTypeData,
  monthlyIncomeData,
  technicianEfficiencyData,
  technicianSatisfactionData,
  servicesByTechnicianData,
  servicesByEquipmentData,
  topTechniciansData
} from '../utils/statisticsMockData';

const Statistics = () => {
  const [period, setPeriod] = useState('mes');
  const [efficiencyMetric, setEfficiencyMetric] = useState('tiempo');

  // Función para mostrar la métrica adecuada en el gráfico de eficiencia
  const getTechnicianMetricData = () => {
    switch (efficiencyMetric) {
      case 'tiempo':
        return technicianEfficiencyData;
      case 'satisfaccion':
        return technicianSatisfactionData;
      case 'cantidad':
        return servicesByTechnicianData;
      default:
        return technicianEfficiencyData;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Estadísticas y Análisis</h1>
        <div className="flex items-center gap-4">
          <button className="btn btn-outline flex items-center gap-2">
            <FaFileExport /> Exportar
          </button>
          <select 
            className="form-select rounded border p-2" 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="mes">Este Mes</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="semestre">Este Semestre</option>
            <option value="año">Este Año</option>
          </select>
        </div>
      </div>
      
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title={statsCardData.totalServices.title} 
          value={statsCardData.totalServices.value} 
          type={statsCardData.totalServices.type}
          trend={statsCardData.totalServices.trend} 
        />
        <StatsCard 
          title={statsCardData.totalIncome.title} 
          value={statsCardData.totalIncome.value} 
          type={statsCardData.totalIncome.type}
          trend={statsCardData.totalIncome.trend} 
        />
        <StatsCard 
          title={statsCardData.newClients.title} 
          value={statsCardData.newClients.value} 
          type={statsCardData.newClients.type}
          trend={statsCardData.newClients.trend} 
        />
        <StatsCard 
          title={statsCardData.satisfaction.title} 
          value={statsCardData.satisfaction.value} 
          type={statsCardData.satisfaction.type}
          trend={statsCardData.satisfaction.trend} 
        />
      </div>
      
      {/* Primera fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PieChart 
          title="Servicios por Tipo"
          data={servicesByTypeData}
        />
        
        <LineChart 
          title="Ingresos por Mes"
          data={monthlyIncomeData}
        />
      </div>
      
      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium m-0">Eficiencia de Técnicos</h3>
            <div>
              <select 
                className="form-select rounded border p-1 text-sm" 
                value={efficiencyMetric} 
                onChange={(e) => setEfficiencyMetric(e.target.value)}
              >
                <option value="tiempo">Tiempo promedio</option>
                <option value="satisfaccion">Satisfacción cliente</option>
                <option value="cantidad">Cantidad servicios</option>
              </select>
            </div>
          </div>
          
          <div className="w-full h-[300px] relative">
            <BarChart 
              data={getTechnicianMetricData()}
              options={
                efficiencyMetric === 'satisfaccion' 
                  ? { scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } } } 
                  : {}
              }
            />
          </div>
        </div>
        
        <PieChart 
          title="Servicios por Equipo"
          data={servicesByEquipmentData}
        />
      </div>
      
      {/* Tabla de técnicos destacados */}
      <div className="bg-white rounded shadow p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium m-0">Top Técnicos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Técnico</th>
                <th className="text-center p-3">Servicios</th>
                <th className="text-center p-3">Tiempo Promedio</th>
                <th className="text-center p-3">Satisfacción</th>
                <th className="text-center p-3">Ingresos Generados</th>
              </tr>
            </thead>
            <tbody>
              {topTechniciansData.map((tech, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-3 font-medium">{tech.name}</td>
                  <td className="p-3 text-center">{tech.services}</td>
                  <td className="p-3 text-center">{tech.avgTime}</td>
                  <td className="p-3 text-center">{tech.satisfaction}</td>
                  <td className="p-3 text-center">{tech.income}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;