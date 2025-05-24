import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ServicesList from '../components/dashboard/ServicesList';
import { FiClipboard, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';

const TechnicianDashboard = () => {
  // Datos simulados para el dashboard del técnico
  const serviceStats = {
    pendingServices: 8,
    completedServices: 124,
    scheduledServices: 3,
    averageRating: 4.8
  };

  // Servicios activos del técnico
  const activeServices = [
    {
      id: 1,
      client: 'Supermercados ABC',
      type: 'Mantenimiento',
      equipment: 'Refrigerador Industrial',
      date: '2023-10-25',
      time: '09:00 AM',
      status: 'pendiente',
      address: 'Av. Principal 123',
    },
    {
      id: 2,
      client: 'Restaurante El Sabor',
      type: 'Reparación',
      equipment: 'Congelador Vertical',
      date: '2023-10-26',
      time: '10:30 AM',
      status: 'pendiente',
      address: 'Calle Comercial 456',
    },
    {
      id: 3,
      client: 'Hotel Las Palmas',
      type: 'Instalación',
      equipment: 'Sistema de Aire Acondicionado',
      date: '2023-10-27',
      time: '02:00 PM',
      status: 'pendiente',
      address: 'Av. Turística 789',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel del Técnico</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Servicios Pendientes" 
          value={serviceStats.pendingServices} 
          icon={<FiClipboard className="text-white" />}
          iconBg="bg-warning"
        />
        <StatsCard 
          title="Servicios Completados" 
          value={serviceStats.completedServices} 
          icon={<FiCheckCircle className="text-white" />}
          iconBg="bg-success"
        />
        <StatsCard 
          title="Próximos Servicios" 
          value={serviceStats.scheduledServices} 
          icon={<FiClock className="text-white" />}
          iconBg="bg-info"
        />
        <StatsCard 
          title="Calificación Promedio" 
          value={serviceStats.averageRating.toFixed(1)} 
          icon={<FiStar className="text-white" />}
          iconBg="bg-primary"
        />
      </div>
      
      {/* Servicios Activos */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Mis Servicios Asignados</h2>
        <ServicesList services={activeServices} />
      </div>
      
      {/* Próximas visitas */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Próximas Visitas</h2>
        <div className="space-y-4">
          {activeServices.map(service => (
            <div key={service.id} className="border-l-4 border-primary pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{service.client}</h3>
                  <p className="text-sm text-gray-600">{service.equipment} - {service.type}</p>
                  <p className="text-sm text-gray-500">{service.address}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{service.date}</div>
                  <div className="text-sm text-gray-600">{service.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;