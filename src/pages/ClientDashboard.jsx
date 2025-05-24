import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import { FiFileText, FiTool, FiPackage, FiClock } from 'react-icons/fi';

const ClientDashboard = () => {
  // Datos simulados para el dashboard del cliente
  const clientStats = {
    activeQuotes: 2,
    scheduledServices: 1,
    registeredEquipment: 5,
    pendingRequests: 0
  };

  // Datos simulados de cotizaciones y servicios recientes
  const recentQuotes = [
    {
      id: 1,
      service: 'Mantenimiento preventivo',
      equipment: 'Refrigerador Industrial #103',
      date: '20/10/2023',
      status: 'pendiente',
      amount: '$380.00'
    },
    {
      id: 2,
      service: 'Reparación compresor',
      equipment: 'Cámara de Refrigeración #201',
      date: '15/10/2023',
      status: 'aprobada',
      amount: '$650.00'
    }
  ];

  const upcomingServices = [
    {
      id: 1,
      type: 'Mantenimiento preventivo',
      equipment: 'Refrigerador Industrial #103',
      date: '25/10/2023',
      time: '10:00 AM',
      technician: 'Carlos Mendoza',
      status: 'programado'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Cliente</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Cotizaciones Activas" 
          value={clientStats.activeQuotes} 
          icon={<FiFileText className="text-white" />}
          iconBg="bg-primary"
        />
        <StatsCard 
          title="Servicios Programados" 
          value={clientStats.scheduledServices} 
          icon={<FiClock className="text-white" />}
          iconBg="bg-warning"
        />
        <StatsCard 
          title="Equipos Registrados" 
          value={clientStats.registeredEquipment} 
          icon={<FiPackage className="text-white" />}
          iconBg="bg-info"
        />
        <StatsCard 
          title="Solicitudes Pendientes" 
          value={clientStats.pendingRequests} 
          icon={<FiTool className="text-white" />}
          iconBg="bg-success"
        />
      </div>
      
      {/* Cotizaciones Recientes */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cotizaciones Recientes</h2>
          <button className="text-primary hover:underline">Ver todas</button>
        </div>
        
        {recentQuotes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay cotizaciones recientes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Equipo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map(quote => (
                  <tr key={quote.id}>
                    <td>{quote.service}</td>
                    <td>{quote.equipment}</td>
                    <td>{quote.date}</td>
                    <td>
                      <span className={`status-badge ${quote.status}`}>
                        {quote.status === 'pendiente' ? 'Pendiente' : 
                         quote.status === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    </td>
                    <td>{quote.amount}</td>
                    <td>
                      <button className="text-primary hover:underline">Ver detalles</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Próximos Servicios */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Próximos Servicios</h2>
          <button className="text-primary hover:underline">Ver todos</button>
        </div>
        
        {upcomingServices.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay servicios programados</p>
        ) : (
          <div className="space-y-4">
            {upcomingServices.map(service => (
              <div key={service.id} className="border-l-4 border-warning pl-4 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{service.type}</div>
                    <div className="text-sm text-gray-600">{service.equipment}</div>
                    <div className="mt-2 flex items-center">
                      <span className="text-sm bg-secondary py-1 px-2 rounded text-gray-700">
                        Técnico: {service.technician}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{service.date}</div>
                    <div className="text-sm text-gray-600">{service.time}</div>
                    <div className="mt-2">
                      <span className="status-badge en-progreso">Programado</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Acciones Rápidas */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4 text-center hover:border-primary hover:shadow-md transition duration-300">
            <FiTool className="w-12 h-12 mx-auto text-primary mb-2" />
            <h3 className="font-semibold">Solicitar Servicio</h3>
            <p className="text-sm text-gray-600 mb-3">Programa un nuevo servicio para tus equipos</p>
            <button className="btn btn-primary">Solicitar</button>
          </div>
          <div className="border rounded p-4 text-center hover:border-primary hover:shadow-md transition duration-300">
            <FiPackage className="w-12 h-12 mx-auto text-primary mb-2" />
            <h3 className="font-semibold">Registrar Equipo</h3>
            <p className="text-sm text-gray-600 mb-3">Añade un nuevo equipo a tu inventario</p>
            <button className="btn btn-primary">Registrar</button>
          </div>
          <div className="border rounded p-4 text-center hover:border-primary hover:shadow-md transition duration-300">
            <FiFileText className="w-12 h-12 mx-auto text-primary mb-2" />
            <h3 className="font-semibold">Ver Historial</h3>
            <p className="text-sm text-gray-600 mb-3">Consulta el historial de servicios realizados</p>
            <button className="btn btn-primary">Ver</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;