import React, { useState, useEffect, useCallback, useMemo } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ServicesList from '../components/dashboard/ServicesList';
import { FiClipboard, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';

const TechnicianDashboard = () => {
  const { 
    dashboardStats, 
    fetchDashboardStats, 
    services, 
    fetchServices,
    loading,
    error 
  } = useApp();
  const { user } = useAuth();

  // Estados locales para datos específicos del técnico
  const [technicianProfile, setTechnicianProfile] = useState(null);
  const [technicianServices, setTechnicianServices] = useState([]);
  const [loadingTechnician, setLoadingTechnician] = useState(true);
  const [technicianError, setTechnicianError] = useState(null);

  console.log('🔥 TechnicianDashboard - Usuario actual:', user);
  console.log('🔥 TechnicianDashboard - DashboardStats:', dashboardStats);
  console.log('🔥 TechnicianDashboard - Services:', services);
  console.log('🔥 TechnicianDashboard - TechnicianProfile:', technicianProfile);
  console.log('🔥 TechnicianDashboard - TechnicianServices:', technicianServices);

  // Función para obtener el perfil del técnico actual
  const getCurrentTechnician = useCallback(async () => {
    if (!user?.id || !user?.token) {
      console.log('🔥 No hay usuario o token disponible para obtener perfil de técnico');
      return;
    }

    try {
      console.log('🔥 Obteniendo perfil de técnico para ID:', user.id);
      setLoadingTechnician(true);
      setTechnicianError(null);

      const response = await fetch(`http://localhost:3001/api/technicians/profile/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('🔥 Respuesta del perfil de técnico:', responseData);

      if (responseData.success && responseData.data) {
        setTechnicianProfile(responseData.data);
      } else {
        throw new Error(responseData.message || 'Error al obtener perfil de técnico');
      }
    } catch (error) {
      console.error('🔥 Error al obtener perfil de técnico:', error);
      setTechnicianError('Error al cargar el perfil del técnico');
    } finally {
      setLoadingTechnician(false);
    }
  }, [user]);

  // Función para obtener servicios del técnico
  const getTechnicianServices = useCallback(async () => {
    if (!user?.id || !user?.token) {
      console.log('🔥 No hay usuario o token disponible para obtener servicios');
      return;
    }

    try {
      console.log('🔥 Obteniendo servicios para técnico ID:', user.id);
      
      const response = await fetch(`http://localhost:3001/api/services/technician/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('🔥 Respuesta de servicios del técnico:', responseData);

      if (responseData.success && responseData.data) {
        setTechnicianServices(responseData.data);
      } else {
        throw new Error(responseData.message || 'Error al obtener servicios del técnico');
      }
    } catch (error) {
      console.error('🔥 Error al obtener servicios del técnico:', error);
      setTechnicianError('Error al cargar los servicios del técnico');
    }
  }, [user]);

  // useEffect para cargar estadísticas del dashboard
  useEffect(() => {
    if (user?.token && user?.role === 'TECHNICIAN') {
      console.log('🔥 Cargando estadísticas del dashboard para técnico');
      fetchDashboardStats();
    }
  }, [user, fetchDashboardStats]);

  // useEffect para cargar servicios generales
  useEffect(() => {
    if (user?.token) {
      console.log('🔥 Cargando servicios generales');
      fetchServices();
    }
  }, [user, fetchServices]);

  // useEffect para cargar perfil y servicios del técnico
  useEffect(() => {
    if (user?.token && user?.role === 'TECHNICIAN') {
      console.log('🔥 Cargando datos específicos del técnico');
      getCurrentTechnician();
      getTechnicianServices();
    }
  }, [user, getCurrentTechnician, getTechnicianServices]);

  // Calcular estadísticas del técnico basadas en sus servicios
  const technicianStats = useMemo(() => {
    if (!technicianServices || technicianServices.length === 0) {
      return {
        pendingServices: 0,
        completedServices: 0,
        scheduledServices: 0,
        averageRating: 0
      };
    }

    const today = new Date().toISOString().split('T')[0];
    
    const pendingServices = technicianServices.filter(service => 
      service.status === 'PENDING' || service.status === 'ASSIGNED'
    ).length;

    const completedServices = technicianServices.filter(service => 
      service.status === 'COMPLETED'
    ).length;

    const scheduledServices = technicianServices.filter(service => 
      service.status === 'SCHEDULED' || 
      (service.scheduledDate && service.scheduledDate.includes(today))
    ).length;

    // Calcular calificación promedio (si hay evaluaciones)
    const servicesWithRating = technicianServices.filter(service => 
      service.rating && service.rating > 0
    );
    const averageRating = servicesWithRating.length > 0 
      ? servicesWithRating.reduce((sum, service) => sum + service.rating, 0) / servicesWithRating.length
      : (technicianProfile?.rating || 4.5);

    console.log('🔥 Estadísticas calculadas del técnico:', {
      pendingServices,
      completedServices,
      scheduledServices,
      averageRating
    });

    return {
      pendingServices,
      completedServices,
      scheduledServices,
      averageRating
    };
  }, [technicianServices, technicianProfile]);

  // Filtrar servicios activos (pendientes y programados)
  const activeServices = useMemo(() => {
    if (!technicianServices || technicianServices.length === 0) {
      return [];
    }

    return technicianServices
      .filter(service => 
        service.status === 'PENDING' || 
        service.status === 'ASSIGNED' || 
        service.status === 'SCHEDULED' ||
        service.status === 'IN_PROGRESS'
      )
      .map(service => ({
        id: service.id,
        client: service.client?.name || service.clientName || 'Cliente no especificado',
        type: service.serviceType || service.type || 'Tipo no especificado',
        equipment: service.equipment?.type || service.equipmentType || 'Equipo no especificado',
        date: service.scheduledDate ? new Date(service.scheduledDate).toLocaleDateString() : 'Fecha no programada',
        time: service.scheduledDate ? new Date(service.scheduledDate).toLocaleTimeString() : 'Hora no programada',
        status: service.status?.toLowerCase() || 'pendiente',
        address: service.client?.address || service.address || 'Dirección no especificada',
        description: service.description || 'Sin descripción'
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [technicianServices]);

  // Próximas visitas (servicios programados para los próximos días)
  const upcomingVisits = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return activeServices.filter(service => {
      if (!service.date || service.date === 'Fecha no programada') return false;
      const serviceDate = new Date(service.date);
      return serviceDate >= today && serviceDate <= nextWeek;
    });
  }, [activeServices]);

  // Mostrar estados de carga
  if (loading || loadingTechnician) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Cargando panel del técnico...</div>
        </div>
      </div>
    );
  }

  // Mostrar errores
  if (error || technicianError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error || technicianError}
          <button 
            onClick={() => {
              fetchDashboardStats();
              getCurrentTechnician();
              getTechnicianServices();
            }}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Panel del Técnico - {technicianProfile?.name || user?.name || 'Técnico'}
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Servicios Pendientes" 
          value={technicianStats.pendingServices} 
          icon={<FiClipboard className="text-white" />}
          iconBg="bg-warning"
        />
        <StatsCard 
          title="Servicios Completados" 
          value={technicianStats.completedServices} 
          icon={<FiCheckCircle className="text-white" />}
          iconBg="bg-success"
        />
        <StatsCard 
          title="Próximos Servicios" 
          value={technicianStats.scheduledServices} 
          icon={<FiClock className="text-white" />}
          iconBg="bg-info"
        />
        <StatsCard 
          title="Calificación Promedio" 
          value={technicianStats.averageRating.toFixed(1)} 
          icon={<FiStar className="text-white" />}
          iconBg="bg-primary"
        />
      </div>
      
      {/* Servicios Activos */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Mis Servicios Asignados ({activeServices.length})
        </h2>
        {activeServices.length > 0 ? (
          <ServicesList services={activeServices} />
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tienes servicios asignados en este momento.
          </p>
        )}
      </div>
      
      {/* Próximas visitas */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Próximas Visitas ({upcomingVisits.length})
        </h2>
        <div className="space-y-4">
          {upcomingVisits.length > 0 ? (
            upcomingVisits.map(service => (
              <div key={service.id} className="border-l-4 border-primary pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{service.client}</h3>
                    <p className="text-sm text-gray-600">{service.equipment} - {service.type}</p>
                    <p className="text-sm text-gray-500">{service.address}</p>
                    {service.description && (
                      <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{service.date}</div>
                    <div className="text-sm text-gray-600">{service.time}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      service.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      service.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      service.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status === 'pendiente' ? 'Pendiente' :
                       service.status === 'scheduled' ? 'Programado' :
                       service.status === 'in_progress' ? 'En Progreso' :
                       service.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No tienes visitas programadas para los próximos días.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;