import React, { useState } from 'react';
import { FiCalendar, FiFilter, FiMapPin, FiTool, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const WorkHistory = () => {
  // Estado para los filtros
  const [monthFilter, setMonthFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Datos simulados del historial de trabajo
  const workHistory = [
    {
      id: 1,
      client: 'Supermercados ABC',
      equipment: 'Refrigerador Industrial',
      type: 'Mantenimiento',
      address: 'Av. Principal 123',
      date: '15/10/2023',
      time: '09:30 AM - 11:00 AM',
      issues: 'Sistema de refrigeración funcionando a menor capacidad',
      solution: 'Limpieza del condensador y recarga de refrigerante',
      parts: ['Refrigerante R-134a', 'Filtro secador'],
      status: 'exitoso'
    },
    {
      id: 2,
      client: 'Restaurante El Sabor',
      equipment: 'Congelador Vertical',
      type: 'Reparación',
      address: 'Calle Comercial 456',
      date: '10/10/2023',
      time: '14:00 PM - 16:30 PM',
      issues: 'No mantiene temperatura adecuada',
      solution: 'Reemplazo de compresor defectuoso y recarga de refrigerante',
      parts: ['Compresor 1/2 HP', 'Refrigerante R-404A', 'Válvula de expansión'],
      status: 'exitoso'
    },
    {
      id: 3,
      client: 'Panadería Dulce',
      equipment: 'Cámara Frigorífica',
      type: 'Mantenimiento',
      address: 'Av. Central 789',
      date: '05/10/2023',
      time: '08:00 AM - 10:00 AM',
      issues: 'Mantenimiento preventivo programado',
      solution: 'Limpieza general, ajuste de parámetros y verificación de sistemas',
      parts: ['Filtro de aire', 'Lubricante'],
      status: 'exitoso'
    },
    {
      id: 4,
      client: 'Clínica San Juan',
      equipment: 'Aire Acondicionado Split',
      type: 'Reparación',
      address: 'Calle Salud 234',
      date: '28/09/2023',
      time: '11:00 AM - 15:00 PM',
      issues: 'Ruido excesivo y baja eficiencia',
      solution: 'Reparación parcial. Se programó segunda visita para cambio de motor del ventilador',
      parts: ['Capacitor', 'Refrigerante R-410A'],
      status: 'parcial'
    },
    {
      id: 5,
      client: 'Hotel Las Palmas',
      equipment: 'Sistema de Aire Acondicionado',
      type: 'Instalación',
      address: 'Av. Turística 567',
      date: '20/09/2023',
      time: '09:00 AM - 18:00 PM',
      issues: 'Instalación de nuevo sistema',
      solution: 'Instalación completa y configuración del sistema',
      parts: ['Tubería de cobre', 'Aislamiento térmico', 'Soporte de unidad exterior'],
      status: 'exitoso'
    },
  ];

  // Filtrar historial por mes y tipo
  const filteredHistory = workHistory.filter(item => {
    let passMonthFilter = true;
    let passTypeFilter = true;

    if (monthFilter) {
      const [day, month, year] = item.date.split('/');
      passMonthFilter = month === monthFilter;
    }

    if (typeFilter) {
      passTypeFilter = item.type === typeFilter;
    }

    return passMonthFilter && passTypeFilter;
  });

  // Extraer tipos únicos para el filtro
  const uniqueTypes = [...new Set(workHistory.map(item => item.type))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Historial de Trabajos</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="monthFilter">Mes</label>
            <select 
              id="monthFilter" 
              className="form-control"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">Todos los meses</option>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="typeFilter">Tipo de Servicio</label>
            <select 
              id="typeFilter" 
              className="form-control"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {uniqueTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Historial de trabajo */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Servicios Realizados ({filteredHistory.length})</h2>
        
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No hay registros con los filtros seleccionados</p>
        ) : (
          <div className="space-y-8">
            {filteredHistory.map(work => (
              <div key={work.id} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center bg-secondary p-4 border-b">
                  <div>
                    <h3 className="font-semibold">{work.client}</h3>
                    <p className="text-sm text-gray-500">{work.equipment}</p>
                  </div>
                  <div className="flex items-center">
                    {work.status === 'exitoso' ? (
                      <FiCheckCircle className="text-success mr-2" />
                    ) : (
                      <FiAlertTriangle className="text-warning mr-2" />
                    )}
                    <span className={`text-sm font-medium ${work.status === 'exitoso' ? 'text-success' : 'text-warning'}`}>
                      {work.status === 'exitoso' ? 'Servicio Exitoso' : 'Servicio Parcial'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-start mb-2">
                        <FiTool className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Tipo de Servicio</p>
                          <p>{work.type}</p>
                        </div>
                      </div>
                      <div className="flex items-start mb-2">
                        <FiMapPin className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Dirección</p>
                          <p>{work.address}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start mb-2">
                        <FiCalendar className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Fecha</p>
                          <p>{work.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiClock className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Horario</p>
                          <p>{work.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Detalles del Servicio</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Problema</p>
                        <p className="text-gray-700 mb-2">{work.issues}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Solución</p>
                        <p className="text-gray-700 mb-2">{work.solution}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-dark font-medium">Refacciones utilizadas</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {work.parts.map((part, index) => (
                          <span key={index} className="bg-secondary px-2 py-1 rounded text-sm">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHistory;