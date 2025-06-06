import React, { useEffect, useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/dashboard/StatsCard';
import ChartContainer from '../components/dashboard/ChartContainer';
import ServicesList from '../components/dashboard/ServicesList';
import RecentQuotesTable from '../components/dashboard/RecentQuotesTable';

const Dashboard = () => {
  const [dailyIncomeStats, setDailyIncomeStats] = useState(null);
  const [yearlyIncomeStats, setYearlyIncomeStats] = useState(null);

  const { user } = useAuth();
  const { 
    dashboardStats, 
    isLoadingDashboard, 
    errorDashboard, 
    fetchDashboardStats,
    services,
    quotes,
    incomeStats,
    fetchIncomeStats
  } = useApp();

  // Función para cargar datos diarios
  const loadDailyIncomeStats = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch('http://localhost:3001/api/stats/income?period=day', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDailyIncomeStats(data.data || data);
      }
    } catch (error) {
      console.error('Error loading daily income stats:', error);
    }
  };

  // Función para cargar datos anuales
  const loadYearlyIncomeStats = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch('http://localhost:3001/api/stats/income?period=year', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setYearlyIncomeStats(data.data || data);
      }
    } catch (error) {
      console.error('Error loading yearly income stats:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchDashboardStats();
      fetchIncomeStats('month'); // Para el gráfico de servicios por mes
      loadDailyIncomeStats();
      loadYearlyIncomeStats();
    }
  }, [fetchDashboardStats, fetchIncomeStats, user?.token]);

  if (isLoadingDashboard) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  if (errorDashboard) {
    return (
      <div className="animate-fade-in">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error al cargar estadísticas</h3>
          <p className="text-red-600 mt-1">{errorDashboard}</p>
          <button 
            onClick={fetchDashboardStats}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
              <p className="text-sm font-medium text-gray-900">
                {dashboardStats?.lastUpdated 
                  ? new Date(dashboardStats.lastUpdated).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Cargando...'
                }
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Tarjetas de estadísticas con mejor espaciado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Servicios Pendientes" 
            value={dashboardStats?.totalServices?.byStatus?.pending || 0} 
            type="pending" 
          />
          <StatsCard 
            title="Servicios Completados" 
            value={dashboardStats?.totalServices?.byStatus?.completed || 0} 
            type="completed" 
          />
          <StatsCard 
            title="Cotizaciones Pendientes" 
            value={dashboardStats?.pendingQuotes || 0} 
            type="quotes" 
          />
          <StatsCard 
            title="Ingresos del Mes" 
            value={`S/ ${dashboardStats?.monthlyIncome?.current || 0}`} 
            type="income" 
          />
        </div>

        {/* Gráficos y listas con mejor espaciado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer 
            title="Ingresos por Mes" 
            data={{
              day: {
                labels: dailyIncomeStats?.incomeByDay?.map(item => item.label) || ['Sin datos'],
                datasets: [{
                  label: 'Ingresos Diarios (S/)',
                  data: dailyIncomeStats?.incomeByDay?.map(item => item.income) || [0],
                  borderColor: '#28a745',
                  backgroundColor: 'rgba(40, 167, 69, 0.2)',
                  tension: 0.3,
                  fill: true,
                }]
              },
              month: {
                labels: incomeStats?.incomeByMonth?.map(item => item.label) || ['Sin datos'],
                datasets: [{
                  label: 'Ingresos Mensuales (S/)',
                  data: incomeStats?.incomeByMonth?.map(item => item.income) || [0],
                  borderColor: '#28a745',
                  backgroundColor: 'rgba(40, 167, 69, 0.2)',
                  tension: 0.3,
                  fill: true,
                }]
              },
              year: {
                labels: yearlyIncomeStats?.incomeByYear?.map(item => item.label) || ['Sin datos'],
                datasets: [{
                  label: 'Ingresos Anuales (S/)',
                  data: yearlyIncomeStats?.incomeByYear?.map(item => item.income) || [0],
                  borderColor: '#28a745',
                  backgroundColor: 'rgba(40, 167, 69, 0.2)',
                  tension: 0.3,
                  fill: true,
                }]
              }
            }}
          />
          <ServicesList 
            title="Servicios Próximos" 
            services={services?.filter(service => 
              // Mostrar TODOS los servicios EXCEPTO COMPLETED
              service.status !== 'COMPLETED'
            )
            // Ordenar por fecha más próxima primero
            .sort((a, b) => {
              const dateA = new Date(a.scheduledDate);
              const dateB = new Date(b.scheduledDate);
              return dateA - dateB;
            })
            .slice(0, 5)
            .map(service => ({
              title: service.title,
              details: `${service.client?.companyName || 'Cliente no especificado'} | ${service.technician?.name || service.technician?.firstName + ' ' + service.technician?.lastName || 'Sin técnico'} | ${service.status}`,
              time: service.scheduledDate 
                ? new Date(service.scheduledDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Sin fecha',
              status: service.status,
              priority: service.priority
            })) || []} 
            viewAllLink="/servicios" 
          />
        </div>

        {/* Tabla de Cotizaciones Recientes */}
        <div className="grid grid-cols-1 gap-6">
          <RecentQuotesTable quotes={quotes?.slice(0, 5).map(quote => ({
            id: quote.id,
            client: quote.client?.companyName || 'Cliente no especificado',
            type: quote.title || 'Sin título',
            amount: `S/ ${quote.amount || 0}`,
            status: quote.status?.toLowerCase() === 'pending' ? 'pendiente' 
                   : quote.status?.toLowerCase() === 'approved' ? 'aprobada'
                   : quote.status?.toLowerCase() === 'rejected' ? 'rechazada'
                   : 'pendiente',
            date: quote.createdAt 
              ? new Date(quote.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              : 'Sin fecha'
          })) || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;