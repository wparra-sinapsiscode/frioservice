import React, { useState } from 'react';
import { FiFilter, FiFileText, FiPackage, FiCalendar, FiDollarSign, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const MyQuotes = () => {
  // Estado para los filtros
  const [statusFilter, setStatusFilter] = useState('todas');
  
  // Datos simulados de cotizaciones
  const quotes = [
    {
      id: 1,
      service: 'Mantenimiento preventivo',
      equipment: 'Refrigerador Industrial #103',
      description: 'Mantenimiento preventivo anual que incluye limpieza de condensador, verificación de presiones y ajuste de temperatura',
      date: '20/10/2023',
      expirationDate: '03/11/2023',
      status: 'pendiente',
      amount: 380.00
    },
    {
      id: 2,
      service: 'Reparación compresor',
      equipment: 'Cámara de Refrigeración #201',
      description: 'Reparación de compresor dañado incluyendo diagnóstico, reemplazo de piezas y recarga de refrigerante',
      date: '15/10/2023',
      expirationDate: '30/10/2023',
      status: 'aprobada',
      amount: 650.00
    },
    {
      id: 3,
      service: 'Instalación aire acondicionado',
      equipment: 'Minisplit 12,000 BTU (Oficina gerencia)',
      description: 'Instalación completa de equipo minisplit en oficina, incluye materiales y mano de obra',
      date: '10/10/2023',
      expirationDate: '25/10/2023',
      status: 'aprobada',
      amount: 450.00
    },
    {
      id: 4,
      service: 'Diagnóstico sistema de refrigeración',
      equipment: 'Congelador Vertical #305',
      description: 'Diagnóstico completo del sistema de refrigeración por fallas reportadas',
      date: '01/10/2023',
      expirationDate: '16/10/2023',
      status: 'rechazada',
      amount: 120.00
    },
    {
      id: 5,
      service: 'Mantenimiento preventivo',
      equipment: 'Aire Acondicionado Central',
      description: 'Mantenimiento completo del sistema central de aire acondicionado, incluye limpieza de ductos',
      date: '25/09/2023',
      expirationDate: '10/10/2023',
      status: 'vencida',
      amount: 850.00
    }
  ];

  // Filtrar cotizaciones por estado
  const filteredQuotes = statusFilter === 'todas' 
    ? quotes 
    : quotes.filter(quote => quote.status === statusFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Cotizaciones</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className={`btn ${statusFilter === 'todas' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('todas')}
          >
            Todas
          </button>
          <button 
            className={`btn ${statusFilter === 'pendiente' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('pendiente')}
          >
            Pendientes
          </button>
          <button 
            className={`btn ${statusFilter === 'aprobada' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('aprobada')}
          >
            Aprobadas
          </button>
          <button 
            className={`btn ${statusFilter === 'rechazada' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('rechazada')}
          >
            Rechazadas
          </button>
          <button 
            className={`btn ${statusFilter === 'vencida' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('vencida')}
          >
            Vencidas
          </button>
        </div>
      </div>
      
      {/* Lista de Cotizaciones */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Cotizaciones ({filteredQuotes.length})</h2>
        
        {filteredQuotes.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No hay cotizaciones con los filtros seleccionados</p>
        ) : (
          <div className="space-y-6">
            {filteredQuotes.map(quote => (
              <div key={quote.id} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center bg-secondary p-4 border-b">
                  <div className="flex items-center">
                    <FiFileText className="text-primary mr-2" />
                    <div>
                      <h3 className="font-semibold">{quote.service}</h3>
                      <p className="text-sm text-gray-500">Cotización #{quote.id}</p>
                    </div>
                  </div>
                  <div className="status-badge">
                    <span className={quote.status}>{
                      quote.status === 'pendiente' ? 'Pendiente' :
                      quote.status === 'aprobada' ? 'Aprobada' :
                      quote.status === 'rechazada' ? 'Rechazada' : 'Vencida'
                    }</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start">
                      <FiPackage className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Equipo</p>
                        <p>{quote.equipment}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiCalendar className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Fecha de cotización</p>
                        <p>{quote.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-dark font-medium mb-1">Descripción</p>
                    <p className="text-gray-700">{quote.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FiCalendar className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Válida hasta</p>
                        <p>{quote.expirationDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiDollarSign className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Monto</p>
                        <p className="font-semibold text-primary">${quote.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t p-4 flex justify-end space-x-2">
                  {quote.status === 'pendiente' && (
                    <>
                      <button className="btn flex items-center">
                        <FiCheckCircle className="mr-1" />
                        Aprobar
                      </button>
                      <button className="btn flex items-center">
                        <FiXCircle className="mr-1" />
                        Rechazar
                      </button>
                    </>
                  )}
                  <button className="btn btn-primary">Ver Detalles</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuotes;