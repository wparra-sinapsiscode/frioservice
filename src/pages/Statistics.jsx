import React, { useState, useEffect } from 'react';
import { FaFileExport } from 'react-icons/fa';
import { useApp } from '../hooks/useApp';
import StatsCard from '../components/dashboard/StatsCard';
import BarChart from '../components/dashboard/BarChart';
import LineChart from '../components/dashboard/LineChart';
import PieChart from '../components/dashboard/PieChart';

const Statistics = () => {
  const [period, setPeriod] = useState('month');
  const [efficiencyMetric, setEfficiencyMetric] = useState('tiempo');

  // Estados del AppContext
  const { 
    dashboardStats, 
    isLoadingDashboard, 
    errorDashboard, 
    fetchDashboardStats,
    serviceStats,
    isLoadingServiceStats,
    errorServiceStats,
    fetchServiceStats,
    incomeStats,
    isLoadingIncomeStats,
    errorIncomeStats,
    fetchIncomeStats,
    technicianRankings,
    isLoadingTechnicianRankings,
    errorTechnicianRankings,
    fetchTechnicianRankings,
    services,
    isLoadingServices,
    errorServices,
    fetchServices
  } = useApp();

  // Efectos para cargar datos
  useEffect(() => {
    fetchDashboardStats();
    fetchServiceStats();
    fetchTechnicianRankings();
    fetchServices();
  }, [fetchDashboardStats, fetchServiceStats, fetchTechnicianRankings, fetchServices]);

  useEffect(() => {
    fetchIncomeStats(period);
  }, [fetchIncomeStats, period]);

  // Helper para badges de estado
  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Helper para badges de prioridad
  const getPriorityBadge = (priority) => {
    const priorityColors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-red-100 text-red-800',
      'URGENT': 'bg-red-500 text-white'
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800';
  };

  // Función para mostrar la métrica adecuada en el gráfico de eficiencia
  const getTechnicianMetricData = () => {
    // ✅ Acceder a la estructura correcta del backend
    const technicians = technicianRankings?.topTechnicians || [];
    
    if (!technicians || !technicians.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Sin datos',
          data: [],
          backgroundColor: '#17a2b8',
        }]
      };
    }

    const labels = technicians.map(tech => tech.name || 'Sin nombre');
    
    switch (efficiencyMetric) {
      case 'tiempo':
        return {
          labels,
          datasets: [{
            label: 'Tiempo promedio (horas)',
            data: technicians.map(tech => parseFloat(tech.averageTime) || 0),
            backgroundColor: '#17a2b8',
          }]
        };
      case 'satisfaccion':
        return {
          labels,
          datasets: [{
            label: 'Calificación Promedio (1-5)',
            data: technicians.map(tech => parseFloat(tech.rating) || 0),
            backgroundColor: '#6f42c1',
          }]
        };
      case 'cantidad':
        return {
          labels,
          datasets: [{
            label: 'Servicios completados',
            data: technicians.map(tech => parseInt(tech.servicesCompleted) || 0),
            backgroundColor: '#fd7e14',
          }]
        };
      default:
        return {
          labels,
          datasets: [{
            label: 'Tiempo promedio (horas)',
            data: technicians.map(tech => parseFloat(tech.averageTime) || 0),
            backgroundColor: '#17a2b8',
          }]
        };
    }
  };

  // Estado de carga general
  const isLoading = isLoadingDashboard || isLoadingServiceStats || isLoadingIncomeStats || isLoadingTechnicianRankings;
  
  // Función para mostrar estados de carga
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  // Función para mostrar errores
  const hasErrors = errorDashboard || errorServiceStats || errorIncomeStats || errorTechnicianRankings;
  if (hasErrors) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error al cargar estadísticas</h3>
          <div className="text-red-600 mt-1">
            {errorDashboard && <p>Dashboard: {errorDashboard}</p>}
            {errorServiceStats && <p>Servicios: {errorServiceStats}</p>}
            {errorIncomeStats && <p>Ingresos: {errorIncomeStats}</p>}
            {errorTechnicianRankings && <p>Técnicos: {errorTechnicianRankings}</p>}
          </div>
          <button 
            onClick={() => {
              fetchDashboardStats();
              fetchServiceStats();
              fetchIncomeStats(period);
              fetchTechnicianRankings();
            }}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="semester">Este Semestre</option>
            <option value="year">Este Año</option>
          </select>
        </div>
      </div>
      
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Servicios" 
          value={dashboardStats?.totalServices?.total || 0}
          type="pending"
          trend={dashboardStats?.servicesTrend && {
            positive: dashboardStats.servicesTrend.growth >= 0,
            icon: dashboardStats.servicesTrend.growth >= 0 ? '↑' : '↓',
            text: `${Math.abs(dashboardStats.servicesTrend.growth || 0)}% vs. período anterior`
          }} 
        />
        <StatsCard 
          title="Ingresos Totales" 
          value={`S/ ${dashboardStats?.monthlyIncome?.current || 0}`}
          type="income"
          trend={dashboardStats?.monthlyIncome?.growth !== undefined && {
            positive: dashboardStats.monthlyIncome.growth >= 0,
            icon: dashboardStats.monthlyIncome.growth >= 0 ? '↑' : '↓',
            text: `${Math.abs(dashboardStats.monthlyIncome.growth || 0)}% vs. período anterior`
          }} 
        />
        <StatsCard 
          title="Nuevos Clientes" 
          value={dashboardStats?.newClientsThisMonth || 0}
          type="quotes"
          trend={dashboardStats?.clientsTrend && {
            positive: dashboardStats.clientsTrend.growth >= 0,
            icon: dashboardStats.clientsTrend.growth >= 0 ? '↑' : '↓',
            text: `${Math.abs(dashboardStats.clientsTrend.growth || 0)}% vs. período anterior`
          }} 
        />
        <StatsCard 
          title="Satisfacción" 
          value={`${dashboardStats?.averageRating || 0}/5`}
          type="completed"
          trend={dashboardStats?.ratingTrend && {
            positive: dashboardStats.ratingTrend.change >= 0,
            icon: dashboardStats.ratingTrend.change >= 0 ? '↑' : '↓',
            text: `${Math.abs(dashboardStats.ratingTrend.change || 0)} vs. período anterior`
          }} 
        />
      </div>
      
      {/* Primera fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PieChart 
          title="Servicios por Tipo"
          data={{
            labels: serviceStats?.servicesByType?.map(item => item.type) || ['Sin datos'],
            datasets: [{
              data: serviceStats?.servicesByType?.map(item => item.count) || [0],
              backgroundColor: ['#17a2b8', '#dc3545', '#28a745', '#ffc107', '#6f42c1'],
              borderWidth: 1,
            }]
          }}
        />
        
        <LineChart 
          title="Ingresos por Mes"
          data={{
            labels: incomeStats?.monthlyData?.map(item => item.month) || ['Sin datos'],
            datasets: [{
              label: 'Ingresos Mensuales (S/)',
              data: incomeStats?.monthlyData?.map(item => item.income) || [0],
              borderColor: '#28a745',
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              tension: 0.3,
              fill: true,
            }]
          }}
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
        
        <div className="bg-white rounded shadow p-5">
          <div className="mb-4">
            <h3 className="text-lg font-medium m-0">Servicios por Equipo</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Título</th>
                  <th className="text-left p-3">Cliente</th>
                  <th className="text-center p-3">Estado</th>
                  <th className="text-center p-3">Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {services && services.length > 0 ? (
                  services.slice(0, 10).map((service, index) => (
                    <tr key={service.id || index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-3 font-medium">{service.title || 'Sin título'}</td>
                      <td className="p-3">{service.client?.companyName || 'Sin cliente'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(service.status)}`}>
                          {service.status || 'Sin estado'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(service.priority)}`}>
                          {service.priority || 'Sin prioridad'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-500">
                      No hay servicios disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {technicianRankings?.topTechnicians && technicianRankings.topTechnicians.length > 0 ? (
                technicianRankings.topTechnicians.map((tech, index) => (
                  <tr key={tech.technicianId || index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-3 font-medium">{tech.name || 'Sin nombre'}</td>
                    <td className="p-3 text-center">{tech.servicesCompleted || 0}</td>
                    <td className="p-3 text-center">{tech.averageTime || '0'}h</td>
                    <td className="p-3 text-center">{tech.rating || '0'}/5</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No hay datos de técnicos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;