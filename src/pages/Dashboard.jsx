import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ChartContainer from '../components/dashboard/ChartContainer';
import ServicesList from '../components/dashboard/ServicesList';
import RecentQuotesTable from '../components/dashboard/RecentQuotesTable';
import { 
  statsData, 
  servicesChartData, 
  upcomingServices, 
  recentQuotes 
} from '../utils/mockData';

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        {/* Header mejorado */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard 
              <span className="text-gradient ml-2">Administrador</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Resumen general del sistema y métricas clave
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Último actualización</p>
              <p className="text-sm font-medium text-gray-900">Hace 2 minutos</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Tarjetas de estadísticas con mejor espaciado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title={statsData.pendingServices.title} 
            value={statsData.pendingServices.value} 
            type={statsData.pendingServices.type} 
          />
          <StatsCard 
            title={statsData.completedServices.title} 
            value={statsData.completedServices.value} 
            type={statsData.completedServices.type} 
          />
          <StatsCard 
            title={statsData.quotes.title} 
            value={statsData.quotes.value} 
            type={statsData.quotes.type} 
          />
          <StatsCard 
            title={statsData.monthlyIncome.title} 
            value={statsData.monthlyIncome.value} 
            type={statsData.monthlyIncome.type} 
          />
        </div>

        {/* Gráficos y listas con mejor espaciado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer 
            title="Servicios por Mes" 
            data={servicesChartData} 
          />
          <ServicesList 
            title="Servicios Próximos" 
            services={upcomingServices} 
            viewAllLink="/servicios" 
          />
        </div>

        {/* Tabla de Cotizaciones Recientes */}
        <div className="grid grid-cols-1 gap-6">
          <RecentQuotesTable quotes={recentQuotes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;