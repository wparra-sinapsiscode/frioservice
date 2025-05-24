import React, { useState } from 'react';
import { FiFilter, FiCalendar, FiMapPin, FiClock, FiTool } from 'react-icons/fi';

const MyServices = () => {
  // Estado para los filtros
  const [statusFilter, setStatusFilter] = useState('todos');
  
  // Datos simulados de servicios del técnico
  const myServices = [
    {
      id: 1,
      client: 'Supermercados ABC',
      equipment: 'Refrigerador Industrial',
      type: 'Mantenimiento',
      address: 'Av. Principal 123',
      date: '25/10/2023',
      time: '09:00 AM',
      status: 'pendiente',
    },
    {
      id: 2,
      client: 'Restaurante El Sabor',
      equipment: 'Congelador Vertical',
      type: 'Reparación',
      address: 'Calle Comercial 456',
      date: '26/10/2023',
      time: '10:30 AM',
      status: 'pendiente',
    },
    {
      id: 3,
      client: 'Panadería Dulce',
      equipment: 'Cámara Frigorífica',
      type: 'Mantenimiento',
      address: 'Av. Central 789',
      date: '20/10/2023',
      time: '11:00 AM',
      status: 'completado',
    },
    {
      id: 4,
      client: 'Clínica San Juan',
      equipment: 'Aire Acondicionado Split',
      type: 'Reparación',
      address: 'Calle Salud 234',
      date: '18/10/2023',
      time: '02:00 PM',
      status: 'completado',
    },
    {
      id: 5,
      client: 'Hotel Las Palmas',
      equipment: 'Sistema de Aire Acondicionado',
      type: 'Instalación',
      address: 'Av. Turística 567',
      date: '27/10/2023',
      time: '02:00 PM',
      status: 'en-progreso',
    },
  ];

  // Filtrar servicios por estado
  const filteredServices = statusFilter === 'todos' 
    ? myServices 
    : myServices.filter(service => service.status === statusFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Servicios</h1>
      
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
            Todos
          </button>
          <button 
            className={`btn ${statusFilter === 'pendiente' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('pendiente')}
          >
            Pendientes
          </button>
          <button 
            className={`btn ${statusFilter === 'en-progreso' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('en-progreso')}
          >
            En Progreso
          </button>
          <button 
            className={`btn ${statusFilter === 'completado' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('completado')}
          >
            Completados
          </button>
        </div>
      </div>
      
      {/* Lista de Servicios */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Servicios Asignados ({filteredServices.length})</h2>
        
        {filteredServices.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No hay servicios con los filtros seleccionados</p>
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
                    <button className="btn btn-primary">Iniciar Servicio</button>
                  )}
                  {service.status === 'en-progreso' && (
                    <button className="btn btn-primary">Completar Servicio</button>
                  )}
                  <button className="btn btn-outline">Ver Detalles</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;