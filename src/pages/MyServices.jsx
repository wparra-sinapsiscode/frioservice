import React, { useState, useEffect, useCallback } from 'react';
import { FiFilter, FiCalendar, FiMapPin, FiClock, FiTool } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import ServiceCompletionModal from '../components/services/ServiceCompletionModal';

const MyServices = () => {
  // Estado para los filtros
  const [statusFilter, setStatusFilter] = useState('todos');
  const [currentTechnician, setCurrentTechnician] = useState(null);
  const [isLoadingTechnician, setIsLoadingTechnician] = useState(false);
  
  // Estados para el modal de completar servicio
  const [isCompletingService, setIsCompletingService] = useState(false);
  const [completingServiceId, setCompletingServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isCompletingInProgress, setIsCompletingInProgress] = useState(false);

  // Hooks del contexto
  const { 
    services, 
    isLoadingServices, 
    errorServices, 
    fetchServices,
    updateServiceStatus,
    completeService
  } = useApp();
  const { user } = useAuth();

  // Función para obtener información del técnico actual
  const getCurrentTechnician = useCallback(async () => {
    if (user?.token && user?.role === 'TECHNICIAN' && user?.id) {
      setIsLoadingTechnician(true);
      try {
        const response = await fetch(`http://localhost:3001/api/technicians/profile/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          setCurrentTechnician(responseData.data);
          return responseData.data;
        }
      } catch (error) {
        console.error("Error obteniendo técnico actual:", error);
      } finally {
        setIsLoadingTechnician(false);
      }
    }
    return null;
  }, [user]);

  // Cargar información del técnico y sus servicios
  useEffect(() => {
    const loadTechnicianServices = async () => {
      if (user?.role === 'TECHNICIAN' && user?.id) {
        const technician = await getCurrentTechnician();
        if (technician?.id) {
          // Cargar servicios del técnico
          fetchServices({ technicianId: technician.id });
        }
      }
    };

    loadTechnicianServices();
  }, [user, getCurrentTechnician, fetchServices]);

  // Mapear datos del backend a formato UI
  const mapServiceToUI = (service) => ({
    id: service.id,
    client: service.client?.companyName || service.client?.user?.username || 'Cliente no especificado',
    equipment: service.equipmentIds?.length > 0 ? `${service.equipmentIds.length} equipos` : 'Sin equipo especificado',
    type: translateServiceType(service.type),
    address: service.address,
    date: service.scheduledDate ? new Date(service.scheduledDate).toLocaleDateString('es-ES') : 'Sin fecha',
    time: service.scheduledDate ? new Date(service.scheduledDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Sin hora',
    status: translateServiceStatus(service.status),
    originalStatus: service.status,
    originalService: service
  });

  // Función para traducir tipos de servicio
  const translateServiceType = (type) => {
    const translations = {
      'MAINTENANCE': 'Mantenimiento',
      'REPAIR': 'Reparación', 
      'INSTALLATION': 'Instalación',
      'INSPECTION': 'Inspección',
      'EMERGENCY': 'Emergencia',
      'CLEANING': 'Limpieza',
      'CONSULTATION': 'Consultoría'
    };
    return translations[type] || type;
  };

  // Función para traducir estados de servicio
  const translateServiceStatus = (status) => {
    const translations = {
      'PENDING': 'pendiente',
      'CONFIRMED': 'pendiente',
      'IN_PROGRESS': 'en-progreso',
      'ON_HOLD': 'en-progreso',
      'COMPLETED': 'completado',
      'CANCELLED': 'cancelado'
    };
    return translations[status] || 'pendiente';
  };

  // Servicios mapeados para la UI
  const myServices = services ? services.map(mapServiceToUI) : [];

  // Filtrar servicios por estado
  const filteredServices = statusFilter === 'todos' 
    ? myServices 
    : myServices.filter(service => service.status === statusFilter);

  // Función para iniciar servicio
  const handleStartService = async (serviceId) => {
    try {
      await updateServiceStatus(serviceId, 'IN_PROGRESS');
      // Recargar servicios del técnico actual
      if (currentTechnician?.id) {
        fetchServices({ technicianId: currentTechnician.id });
      }
    } catch (error) {
      console.error('Error al iniciar servicio:', error);
      alert('Error al iniciar el servicio. Inténtalo de nuevo.');
    }
  };

  // Función para abrir modal de completar servicio
  const handleCompleteService = (serviceId) => {
    console.log('🔥 MyServices - Abriendo modal para completar servicio:', serviceId);
    
    // Encontrar el servicio completo en la lista
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      console.error('🔥 MyServices - Servicio no encontrado:', serviceId);
      alert('Error: Servicio no encontrado');
      return;
    }
    
    console.log('🔥 MyServices - Servicio seleccionado para completar:', service);
    
    setSelectedService(service);
    setCompletingServiceId(serviceId);
    setIsCompletingService(true);
  };
  
  // Función para cerrar modal de completar servicio
  const handleCloseCompletionModal = () => {
    console.log('🔥 MyServices - Cerrando modal de completar servicio');
    setIsCompletingService(false);
    setCompletingServiceId(null);
    setSelectedService(null);
  };
  
  // Función para procesar la finalización del servicio
  const handleServiceCompletion = async (completionData) => {
    console.log('🔥 MyServices - Procesando finalización de servicio:', completionData);
    
    setIsCompletingInProgress(true);
    
    try {
      // Llamar a la función completeService del contexto
      await completeService(completionData.serviceId, completionData);
      
      console.log('🔥 MyServices - Servicio completado exitosamente');
      
      // Cerrar el modal
      handleCloseCompletionModal();
      
      // Recargar servicios del técnico actual
      if (currentTechnician?.id) {
        fetchServices({ technicianId: currentTechnician.id });
      }
      
      // Mostrar mensaje de éxito
      alert('Servicio completado exitosamente');
      
    } catch (error) {
      console.error('🔥 MyServices - Error al completar servicio:', error);
      alert('Error al completar el servicio. Inténtalo de nuevo.');
    } finally {
      setIsCompletingInProgress(false);
    }
  };

  // Estados de carga y error
  if (isLoadingTechnician || isLoadingServices) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Cargando servicios...</div>
        </div>
      </div>
    );
  }

  if (errorServices) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error al cargar servicios</h3>
          <p className="text-red-600 mt-1">{errorServices}</p>
          <button 
            onClick={() => currentTechnician?.id && fetchServices({ technicianId: currentTechnician.id })}
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Servicios</h1>
          {currentTechnician && (
            <p className="text-gray-600 mt-1">
              Técnico: {currentTechnician.firstName} {currentTechnician.lastName}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total de servicios</p>
          <p className="text-xl font-bold text-primary">{myServices.length}</p>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className={`btn ${statusFilter === 'todos' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('todos')}
          >
            Todos ({myServices.length})
          </button>
          <button 
            className={`btn ${statusFilter === 'pendiente' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('pendiente')}
          >
            Pendientes ({myServices.filter(s => s.status === 'pendiente').length})
          </button>
          <button 
            className={`btn ${statusFilter === 'en-progreso' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('en-progreso')}
          >
            En Progreso ({myServices.filter(s => s.status === 'en-progreso').length})
          </button>
          <button 
            className={`btn ${statusFilter === 'completado' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('completado')}
          >
            Completados ({myServices.filter(s => s.status === 'completado').length})
          </button>
        </div>
      </div>
      
      {/* Lista de Servicios */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Servicios Asignados ({filteredServices.length})</h2>
        
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <FiTool className="mx-auto mb-4 text-4xl text-gray-400" />
            <p className="text-gray-500 text-lg mb-2">
              {statusFilter === 'todos' 
                ? 'No tienes servicios asignados' 
                : `No hay servicios ${statusFilter === 'pendiente' ? 'pendientes' : statusFilter === 'en-progreso' ? 'en progreso' : 'completados'}`
              }
            </p>
            <p className="text-gray-400 text-sm">
              Los servicios aparecerán aquí cuando sean asignados por el administrador
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredServices.map(service => (
              <div key={service.id} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center bg-secondary p-4 border-b">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      service.status === 'pendiente' ? 'bg-warning' :
                      service.status === 'en-progreso' ? 'bg-info' : 'bg-success'
                    }`}></div>
                    <h3 className="font-semibold">{service.client}</h3>
                  </div>
                  <div className="status-badge">
                    <span className={service.status}>{
                      service.status === 'pendiente' ? 'Pendiente' :
                      service.status === 'en-progreso' ? 'En Progreso' : 'Completado'
                    }</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-start mb-2">
                        <FiTool className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Equipo y Servicio</p>
                          <p>{service.equipment} - {service.type}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiMapPin className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Dirección</p>
                          <p>{service.address}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start mb-2">
                        <FiCalendar className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Fecha</p>
                          <p>{service.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiClock className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Hora</p>
                          <p>{service.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t p-4 flex justify-end space-x-2">
                  {service.status === 'pendiente' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleStartService(service.id)}
                    >
                      Iniciar Servicio
                    </button>
                  )}
                  {service.status === 'en-progreso' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleCompleteService(service.id)}
                    >
                      Completar Servicio
                    </button>
                  )}
                  <button className="btn btn-outline">Ver Detalles</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de Completar Servicio */}
      <ServiceCompletionModal 
        isOpen={isCompletingService}
        onClose={handleCloseCompletionModal}
        onComplete={handleServiceCompletion}
        service={selectedService}
        isLoading={isCompletingInProgress}
      />
    </div>
  );
};

export default MyServices;