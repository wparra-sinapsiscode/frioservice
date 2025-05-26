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

  // Función para obtener servicios del técnico usando fetchServices del contexto
  const getTechnicianServices = useCallback(async () => {
    if (!technicianProfile?.id) {
      console.log('🔥 No hay perfil de técnico disponible para obtener servicios');
      return;
    }

    try {
      console.log('🔥 Obteniendo servicios para técnico ID:', technicianProfile.id);
      
      // fetchServices actualiza el estado global 'services', no retorna los datos
      await fetchServices({ technicianId: technicianProfile.id });
      
      console.log('🔥 fetchServices completado, servicios serán procesados en useEffect');
    } catch (error) {
      console.error('🔥 Error al obtener servicios del técnico:', error);
      setTechnicianError('Error al cargar los servicios del técnico');
    }
  }, [technicianProfile, fetchServices]);

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

  // useEffect para cargar perfil del técnico
  useEffect(() => {
    if (user?.token && user?.role === 'TECHNICIAN') {
      console.log('🔥 Cargando perfil del técnico');
      getCurrentTechnician();
    }
  }, [user, getCurrentTechnician]);

  // useEffect para cargar servicios después de obtener el perfil
  useEffect(() => {
    if (technicianProfile?.id) {
      console.log('🔥 Cargando servicios del técnico');
      getTechnicianServices();
    }
  }, [technicianProfile, getTechnicianServices]);

  // useEffect para procesar servicios del estado global cuando cambien
  useEffect(() => {
    if (services && Array.isArray(services) && technicianProfile?.id) {
      console.log('🔥 Procesando servicios del estado global:', services.length, 'servicios');
      console.log('🔥 Filtrando para técnico ID:', technicianProfile.id);
      
      // Filtrar servicios que pertenecen al técnico actual
      const filteredServices = services.filter(service => {
        console.log('🔥 Servicio ID:', service.id, '- TechnicianId:', service.technicianId, '- Coincide:', service.technicianId === technicianProfile.id);
        return service.technicianId === technicianProfile.id;
      });
      
      console.log('🔥 Servicios filtrados para el técnico:', filteredServices.length);
      setTechnicianServices(filteredServices);
    }
  }, [services, technicianProfile]);

  // Calcular estadísticas del técnico basadas en sus servicios
  const technicianStats = useMemo(() => {
    if (!technicianServices || technicianServices.length === 0) {
      return {
        pendingServices: 0,
        completedServices: 0,
        scheduledServices: 0,
        averageRating: technicianProfile?.rating || 0
      };
    }

    console.log('🔥 Calculando estadísticas con', technicianServices.length, 'servicios del técnico');
    
    // Contadores actualizados según nueva lógica
    const pendingServices = technicianServices.filter(service => 
      service.status === 'PENDING'
    ).length;

    const inProgressServices = technicianServices.filter(service => 
      service.status === 'IN_PROGRESS'
    ).length;

    const completedServices = technicianServices.filter(service => 
      service.status === 'COMPLETED'
    ).length;

    const confirmedServices = technicianServices.filter(service => 
      service.status === 'CONFIRMED'
    ).length;

    // Usar rating del perfil del técnico o calcular desde evaluaciones
    const servicesWithRating = technicianServices.filter(service => 
      service.clientRating && service.clientRating > 0
    );
    const averageRating = servicesWithRating.length > 0 
      ? servicesWithRating.reduce((sum, service) => sum + service.clientRating, 0) / servicesWithRating.length
      : (technicianProfile?.rating || 0);

    const stats = {
      pendingServices,
      inProgressServices,
      completedServices,
      confirmedServices,
      averageRating: Math.round(averageRating * 10) / 10
    };

    console.log('🔥 Estadísticas calculadas del técnico:', stats);
    console.log('🔥 Servicios por estado:', {
      total: technicianServices.length,
      pending: technicianServices.filter(s => s.status === 'PENDING').length,
      confirmed: technicianServices.filter(s => s.status === 'CONFIRMED').length,
      inProgress: technicianServices.filter(s => s.status === 'IN_PROGRESS').length,
      completed: technicianServices.filter(s => s.status === 'COMPLETED').length,
    });

    return stats;
  }, [technicianServices, technicianProfile]);

  // Servicios asignados (PENDING e IN_PROGRESS)
  const assignedServices = useMemo(() => {
    if (!technicianServices || technicianServices.length === 0) {
      return [];
    }

    return technicianServices
      .filter(service => 
        service.status === 'PENDING' || 
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

  // Próximas visitas (CONFIRMED e IN_PROGRESS)
  const upcomingVisits = useMemo(() => {
    if (!technicianServices || technicianServices.length === 0) {
      return [];
    }

    return technicianServices
      .filter(service => 
        service.status === 'CONFIRMED' || 
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
          title="En Progreso" 
          value={technicianStats.inProgressServices} 
          icon={<FiClock className="text-white" />}
          iconBg="bg-info"
        />
        <StatsCard 
          title="Servicios Completados" 
          value={technicianStats.completedServices} 
          icon={<FiCheckCircle className="text-white" />}
          iconBg="bg-success"
        />
        <StatsCard 
          title="Calificación Promedio" 
          value={technicianStats.averageRating.toFixed(1)} 
          icon={<FiStar className="text-white" />}
          iconBg="bg-primary"
        />
      </div>
      
      {/* Servicios Asignados (PENDING e IN_PROGRESS) */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Mis Servicios Asignados ({assignedServices.length})
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Servicios pendientes de aceptar y en progreso
        </p>
        {assignedServices.length > 0 ? (
          <ServicesList services={assignedServices} />
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tienes servicios asignados en este momento.
          </p>
        )}
      </div>
      
      {/* Próximas visitas (CONFIRMED e IN_PROGRESS) */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Próximas Visitas ({upcomingVisits.length})
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Servicios confirmados y en progreso
        </p>
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
                      service.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      service.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status === 'confirmed' ? 'Confirmado' :
                       service.status === 'in_progress' ? 'En Progreso' :
                       service.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No tienes visitas confirmadas o en progreso.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;