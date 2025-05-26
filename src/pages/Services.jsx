import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaPlus, FaList, FaThLarge } from 'react-icons/fa';
import ServiceFilters from '../components/services/ServiceFilters';
import ServicesTable from '../components/services/ServicesTable';
import ServiceCard from '../components/services/ServiceCard';
import ServiceModal from '../components/services/ServiceModal';
import { useApp } from '../hooks/useApp';

const Services = () => {
  console.log('🔥🔥🔥 1. SERVICES PAGE: Componente Services iniciado');

  // 1. CONECTAR CON APPCONTEXT - Obtener datos y funciones de la API
  const {
    // Estados de servicios
    services,
    isLoadingServices,
    errorServices,
    // Funciones CRUD de servicios
    addService,
    updateService,
    deleteService,
    fetchServices,
    // Datos relacionados para selects
    clients,
    technicians
  } = useApp();

  // 2. ESTADOS LOCALES PARA UI
  const [filters, setFilters] = useState({
    status: 'todos',
    type: 'todos',
    technician: 'todos',
    client: 'todos',
    startDate: '',
    endDate: '',
  });
  
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'card'
  const [viewingService, setViewingService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('🔥🔥🔥 2. SERVICES PAGE: Estados inicializados', {
    servicesCount: services?.length || 0,
    isLoadingServices,
    errorServices,
    clientsCount: clients?.length || 0,
    techniciansCount: technicians?.length || 0
  });

  // 3. CARGAR SERVICIOS AL MONTAR EL COMPONENTE
  useEffect(() => {
    console.log('🔥🔥🔥 3. SERVICES PAGE: useEffect inicial - cargando servicios');
    if (fetchServices) {
      fetchServices(filters);
    }
  }, []); // Solo al montar

  // 4. APLICAR FILTROS - Recargar cuando cambien los filtros
  useEffect(() => {
    console.log('🔥🔥🔥 4. SERVICES PAGE: Filtros cambiaron, recargando servicios', filters);
    if (fetchServices) {
      // Convertir filtros del frontend al formato del backend
      const backendFilters = {
        status: filters.status !== 'todos' ? filters.status : undefined,
        type: filters.type !== 'todos' ? filters.type : undefined,
        clientId: filters.client !== 'todos' ? filters.client : undefined,
        technicianId: filters.technician !== 'todos' ? filters.technician : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };
      
      // Remover propiedades undefined
      const cleanFilters = Object.fromEntries(
        Object.entries(backendFilters).filter(([_, value]) => value !== undefined)
      );
      
      console.log('🔥🔥🔥 5. SERVICES PAGE: Filtros backend enviados:', cleanFilters);
      fetchServices(cleanFilters);
    }
  }, [filters, fetchServices]);

  // 5. HANDLERS PARA FILTROS
  const handleFilterChange = (newFilters) => {
    console.log('🔥🔥🔥 6. SERVICES PAGE: Cambio de filtros recibido:', newFilters);
    setFilters(newFilters);
  };
  
  // 6. CAMBIAR MODO DE VISUALIZACIÓN
  const toggleViewMode = (mode) => {
    console.log('🔥🔥🔥 7. SERVICES PAGE: Cambio de vista a:', mode);
    setViewMode(mode);
  };

  // 7. NUEVO SERVICIO
  const handleNewService = () => {
    console.log('🔥🔥🔥 8. SERVICES PAGE: Abriendo modal para nuevo servicio');
    setEditingService(null);
    setIsModalOpen(true);
  };

  // 8. VER DETALLES DE SERVICIO
  const handleViewService = (service) => {
    console.log('🔥🔥🔥 9. SERVICES PAGE: Viendo detalles del servicio:', service.id);
    setViewingService(service);
  };

  // 9. EDITAR SERVICIO
  const handleEditService = (service) => {
    console.log('🔥🔥🔥 10. SERVICES PAGE: Editando servicio:', service.id);
    setEditingService(service);
    setIsModalOpen(true);
  };

  // 10. ELIMINAR SERVICIO
  const handleDeleteService = async (service) => {
    console.log('🔥🔥🔥 11. SERVICES PAGE: Intentando eliminar servicio:', service.id);
    
    if (window.confirm(`¿Está seguro de eliminar el servicio ${service.id}?`)) {
      setIsLoading(true);
      try {
        console.log('🔥🔥🔥 12. SERVICES PAGE: Llamando deleteService API');
        await deleteService(service.id);
        console.log('🔥🔥🔥 13. SERVICES PAGE: Servicio eliminado exitosamente');
      } catch (error) {
        console.error('🔥🔥🔥 ERROR en handleDeleteService:', error);
        alert(`Error al eliminar el servicio: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 11. GUARDAR SERVICIO (NUEVO O EDITADO)
  const handleSaveService = async (serviceData) => {
    console.log('🔥🔥🔥 14. SERVICES PAGE: Guardando servicio', { editingService: !!editingService, serviceData });
    
    setIsLoading(true);
    try {
      if (editingService) {
        console.log('🔥🔥🔥 15. SERVICES PAGE: Actualizando servicio existente:', editingService.id);
        await updateService(editingService.id, serviceData);
        console.log('🔥🔥🔥 16. SERVICES PAGE: Servicio actualizado exitosamente');
        setEditingService(null);
      } else {
        console.log('🔥🔥🔥 17. SERVICES PAGE: Creando nuevo servicio');
        await addService(serviceData);
        console.log('🔥🔥🔥 18. SERVICES PAGE: Servicio creado exitosamente');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('🔥🔥🔥 ERROR en handleSaveService:', error);
      alert(`Error al guardar el servicio: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 12. CERRAR MODAL
  const handleCloseModal = () => {
    console.log('🔥🔥🔥 19. SERVICES PAGE: Cerrando modal');
    setIsModalOpen(false);
    setEditingService(null);
  };

  // 13. MOSTRAR ESTADOS DE CARGA Y ERROR
  if (isLoadingServices && (!services || services.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando servicios...</div>
      </div>
    );
  }

  if (errorServices) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-lg">Error: {errorServices}</div>
      </div>
    );
  }

  console.log('🔥🔥🔥 20. SERVICES PAGE: Renderizando componente con', services?.length || 0, 'servicios');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0">Gestión de Servicios</h2>
          <p className="text-sm text-gray-600 mt-1">
            {services?.length || 0} servicio(s) encontrado(s)
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/calendario-servicios"
            className="btn btn-primary flex items-center gap-2"
          >
            <FaCalendarAlt /> Calendario
          </Link>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={handleNewService}
            disabled={isLoading}
          >
            <FaPlus /> Nuevo Servicio
          </button>
        </div>
      </div>
      
      {/* Toggle de vista */}
      <div className="flex gap-2 mb-4">
        <button 
          className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => toggleViewMode('list')}
        >
          <FaList />
        </button>
        <button 
          className={`btn ${viewMode === 'card' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => toggleViewMode('card')}
        >
          <FaThLarge />
        </button>
      </div>
      
      {/* Filtros */}
      <ServiceFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        technicians={technicians || []}
        clients={clients || []}
      />
      
      {/* Indicador de carga */}
      {isLoadingServices && services && services.length > 0 && (
        <div className="text-center py-2 text-blue-600">
          Actualizando servicios...
        </div>
      )}
      
      {/* Vista de tabla */}
      {viewMode === 'list' && (
        <div className="bg-white rounded shadow p-4">
          <ServicesTable 
            services={services || []} 
            onView={handleViewService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            isLoading={isLoading}
          />
        </div>
      )}
      
      {/* Vista de tarjetas */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(services || []).map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onView={handleViewService}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          ))}
          
          {(!services || services.length === 0) && !isLoadingServices && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No se encontraron servicios con los filtros seleccionados
            </div>
          )}
        </div>
      )}
      
      {/* Paginación - TODO: Implementar paginación real en el backend */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          <button className="btn btn-outline">
            <FaList className="rotate-180" />
          </button>
          <button className="btn btn-primary">1</button>
          <button className="btn btn-outline">2</button>
          <button className="btn btn-outline">3</button>
          <button className="btn btn-outline">
            <FaList />
          </button>
        </div>
      </div>

      {/* Modal para nuevo/editar servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button 
                onClick={handleCloseModal} 
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <ServiceModal 
              onSave={handleSaveService}
              onClose={handleCloseModal}
              editingService={editingService}
              clients={clients || []}
              technicians={technicians || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {viewingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold">Detalles de Servicio {viewingService.id}</h3>
              <button 
                onClick={() => setViewingService(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Cliente:</strong> {viewingService.client?.name || viewingService.clientId}</div>
                <div><strong>Tipo:</strong> {viewingService.type}</div>
                <div><strong>Técnico:</strong> {viewingService.technician?.name || viewingService.technicianId || 'Sin asignar'}</div>
                <div><strong>Fecha:</strong> {new Date(viewingService.scheduledDate).toLocaleDateString()}</div>
                <div><strong>Estado:</strong> <span className="capitalize">{viewingService.status?.toLowerCase()}</span></div>
                <div><strong>Prioridad:</strong> {viewingService.priority}</div>
              </div>
              
              {viewingService.address && (
                <div className="mt-4">
                  <strong>Dirección:</strong>
                  <p className="mt-1">{viewingService.address}</p>
                </div>
              )}
              
              {viewingService.equipmentIds && viewingService.equipmentIds.length > 0 && (
                <div className="mt-4">
                  <strong>Equipos:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {viewingService.equipmentIds.map((equipmentId, index) => (
                      <li key={index}>{equipmentId}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {viewingService.description && (
                <div className="mt-4">
                  <strong>Descripción:</strong>
                  <p className="mt-2">{viewingService.description}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setViewingService(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;