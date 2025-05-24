import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaPlus, FaList, FaThLarge } from 'react-icons/fa';
import ServiceFilters from '../components/services/ServiceFilters';
import ServicesTable from '../components/services/ServicesTable';
import ServiceCard from '../components/services/ServiceCard';
import ServiceModal from '../components/services/ServiceModal';
import { servicesData, filterServices } from '../utils/servicesMockData';
import { technicianData, clientData } from '../utils/mockData';

const Services = () => {
  const [filters, setFilters] = useState({
    status: 'todos',
    type: 'todos',
    technician: 'todos',
    client: 'todos',
    startDate: '',
    endDate: '',
  });
  
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'card'
  const [services, setServices] = useState(servicesData);
  const [viewingService, setViewingService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtrar servicios según los filtros aplicados
  const filteredServices = filterServices(services, filters);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Cambiar modo de visualización
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Nuevo servicio
  const handleNewService = () => {
    setIsModalOpen(true);
  };

  // Ver detalles de servicio
  const handleViewService = (service) => {
    setViewingService(service);
  };

  // Editar servicio
  const handleEditService = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  // Eliminar servicio
  const handleDeleteService = (service) => {
    if (window.confirm(`¿Está seguro de eliminar el servicio ${service.id}?`)) {
      setServices(services.filter(s => s.id !== service.id));
    }
  };

  // Guardar servicio (nuevo o editado)
  const handleSaveService = (serviceData) => {
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id ? { ...serviceData, id: editingService.id } : service
      ));
      setEditingService(null);
    } else {
      const newId = `S${(Math.max(...services.map(s => parseInt(s.id.replace('S', '')))) + 1).toString().padStart(3, '0')}`;
      setServices([{ ...serviceData, id: newId }, ...services]);
    }
    setIsModalOpen(false);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0">Gestión de Servicios</h2>
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
        technicians={technicianData}
        clients={clientData}
      />
      
      {/* Vista de tabla */}
      {viewMode === 'list' && (
        <div className="bg-white rounded shadow p-4">
          <ServicesTable 
            services={filteredServices} 
            onView={handleViewService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
        </div>
      )}
      
      {/* Vista de tarjetas */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
          
          {filteredServices.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray">
              No se encontraron servicios con los filtros seleccionados
            </div>
          )}
        </div>
      )}
      
      {/* Paginación */}
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <ServiceModal 
              onSave={handleSaveService}
              onClose={handleCloseModal}
              editingService={editingService}
              clients={clientData}
              technicians={technicianData}
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
                <div><strong>Cliente:</strong> {viewingService.client}</div>
                <div><strong>Tipo:</strong> {viewingService.type}</div>
                <div><strong>Técnico:</strong> {viewingService.technician}</div>
                <div><strong>Fecha:</strong> {viewingService.date}</div>
                <div><strong>Hora:</strong> {viewingService.time}</div>
                <div><strong>Estado:</strong> <span className="capitalize">{viewingService.status}</span></div>
              </div>
              <div className="mt-4">
                <strong>Equipos:</strong>
                <ul className="list-disc list-inside mt-2">
                  {viewingService.equipment.map((eq, index) => (
                    <li key={index}>{eq}</li>
                  ))}
                </ul>
              </div>
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