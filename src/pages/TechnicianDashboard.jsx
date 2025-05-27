import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import { 
  Clipboard, 
  CheckCircle, 
  Clock, 
  Star, 
  MapPin, 
  User, 
  Hammer,
  Calendar,
  ArrowRight,
  Wrench,
  Settings,
  Zap
} from 'lucide-react';
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
  const navigate = useNavigate();

  // Estados locales para datos específicos del técnico
  const [technicianProfile, setTechnicianProfile] = useState(null);
  const [technicianServices, setTechnicianServices] = useState([]);
  const [loadingTechnician, setLoadingTechnician] = useState(true);
  const [technicianError, setTechnicianError] = useState(null);

  // Utilidades para los servicios
  const getServiceIcon = (type) => {
    const iconMap = {
      'MAINTENANCE': Wrench,
      'REPAIR': Hammer,
      'INSTALLATION': Settings,
      'INSPECTION': CheckCircle,
      'EMERGENCY': Zap,
      'CLEANING': Hammer,
      'CONSULTATION': User
    };
    return iconMap[type] || Hammer;
  };

  const getServiceTypeLabel = (type) => {
    const typeMap = {
      'MAINTENANCE': 'Mantenimiento',
      'REPAIR': 'Reparación',
      'INSTALLATION': 'Instalación',
      'INSPECTION': 'Inspección',
      'EMERGENCY': 'Emergencia',
      'CLEANING': 'Limpieza',
      'CONSULTATION': 'Consultoría'
    };
    return typeMap[type] || type;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { label: 'Pendiente', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'CONFIRMED': { label: 'Confirmado', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'IN_PROGRESS': { label: 'En Proceso', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'ON_HOLD': { label: 'En Espera', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'COMPLETED': { label: 'Completado', class: 'bg-green-100 text-green-800 border-green-200' }
    };
    return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Sin hora';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Componente de tarjeta de servicio
  const ServiceCard = ({ service, onClick }) => {
    const ServiceIcon = getServiceIcon(service.type);
    const statusBadge = getStatusBadge(service.status);
    const clientName = service.client?.companyName || service.client?.contactPerson || service.clientName || 'Cliente no especificado';

    return (
      <div 
        onClick={onClick}
        className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1 hover:border-blue-200 group"
      >
        {/* Header con ícono, tipo de servicio y badge de estado */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
              <ServiceIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                {getServiceTypeLabel(service.type)}
              </h3>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.class}`}>
            {statusBadge.label}
          </span>
        </div>

        {/* Nombre del cliente destacado */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
            {clientName}
          </h2>
        </div>

        {/* Información de ubicación y fecha */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{service.address || 'Dirección no especificada'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDate(service.scheduledDate)} • {formatTime(service.scheduledDate)}</span>
          </div>
        </div>

        {/* Descripción opcional */}
        {service.description && (
          <p className="text-sm text-gray-500 mb-3 overflow-hidden" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {service.description}
          </p>
        )}

        {/* Footer con ID y flecha */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="text-xs text-gray-400">
            ID: {service.id.slice(-8)}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    );
  };

  // Componente de estado vacío
  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );

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
          icon={<Clipboard className="text-white" />}
          iconBg="bg-warning"
        />
        <StatsCard 
          title="En Progreso" 
          value={technicianStats.inProgressServices} 
          icon={<Clock className="text-white" />}
          iconBg="bg-info"
        />
        <StatsCard 
          title="Servicios Completados" 
          value={technicianStats.completedServices} 
          icon={<CheckCircle className="text-white" />}
          iconBg="bg-success"
        />
        <StatsCard 
          title="Calificación Promedio" 
          value={technicianStats.averageRating.toFixed(1)} 
          icon={<Star className="text-white" />}
          iconBg="bg-primary"
        />
      </div>
      
      {/* Servicios Asignados (PENDING e IN_PROGRESS) */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Mis Servicios Asignados
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {assignedServices.length} servicios pendientes y en progreso
            </p>
          </div>
          {assignedServices.length > 0 && (
            <button 
              onClick={() => navigate('/technician/services')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {assignedServices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {assignedServices.slice(0, 4).map(service => (
              <ServiceCard 
                key={service.id} 
                service={service}
                onClick={() => navigate('/technician/services')}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Clipboard}
            title="No hay servicios asignados"
            description="Los nuevos servicios aparecerán aquí cuando sean asignados por el administrador"
          />
        )}
      </div>
      
      {/* Próximas visitas (CONFIRMED e IN_PROGRESS) */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Próximas Visitas
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {upcomingVisits.length} servicios confirmados y en progreso
            </p>
          </div>
          {upcomingVisits.length > 0 && (
            <button 
              onClick={() => navigate('/technician/services')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {upcomingVisits.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingVisits.slice(0, 4).map(service => (
              <ServiceCard 
                key={service.id} 
                service={service}
                onClick={() => navigate('/technician/services')}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Calendar}
            title="No hay próximas visitas"
            description="Las visitas confirmadas y programadas aparecerán aquí"
          />
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;