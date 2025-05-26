import React from 'react';
import { FaUndo } from 'react-icons/fa';
import { useApp } from '../../hooks/useApp';
import { getClientDisplayName } from '../../utils/clientUtils';

const QuoteFilters = ({ filters, onFilterChange }) => {
  console.log('🔥🔥🔥 QuoteFilters rendered with filters:', filters);
  
  const { clients } = useApp();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('🔥🔥🔥 Filter change:', name, '=', value);
    onFilterChange({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    console.log('🔥🔥🔥 Clearing all filters');
    onFilterChange({
      status: 'todos',
      client: 'todos',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        
        {/* Status Filter */}
        <div className="flex flex-col min-w-[140px]">
          <label className="text-sm font-medium text-gray-700 mb-1">Estado:</label>
          <select 
            name="status" 
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            value={filters.status || 'todos'}
            onChange={handleChange}
          >
            <option value="todos">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="rejected">Rechazada</option>
            <option value="expired">Expirada</option>
          </select>
        </div>
        
        {/* Client Filter */}
        <div className="flex flex-col min-w-[160px]">
          <label className="text-sm font-medium text-gray-700 mb-1">Cliente:</label>
          <select 
            name="client" 
            className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
            value={filters.client || 'todos'}
            onChange={handleChange}
          >
            <option value="todos">Todos los clientes</option>
            {clients && clients.length > 0 ? (
              clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {getClientDisplayName(client)}
                </option>
              ))
            ) : (
              <option disabled>Cargando clientes...</option>
            )}
          </select>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Rango de fechas:</label>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Desde:</label>
              <input 
                type="date" 
                name="startDate"
                className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                value={filters.startDate || ''}
                onChange={handleChange}
                title="Fecha de inicio del filtro"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Hasta:</label>
              <input 
                type="date" 
                name="endDate"
                className="px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                value={filters.endDate || ''}
                onChange={handleChange}
                title="Fecha de fin del filtro"
                min={filters.startDate || undefined}
              />
            </div>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <div className="flex flex-col justify-end">
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={handleClearFilters}
            title="Limpiar todos los filtros"
          >
            <FaUndo className="text-sm" />
            Limpiar Filtros
          </button>
        </div>
        
      </div>
      
      {/* Active Filters Summary */}
      {(filters.status !== 'todos' || filters.client !== 'todos' || filters.startDate || filters.endDate) && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
            
            {filters.status !== 'todos' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Estado: {filters.status === 'pending' ? 'Pendiente' : 
                        filters.status === 'approved' ? 'Aprobada' : 
                        filters.status === 'rejected' ? 'Rechazada' : 
                        filters.status === 'expired' ? 'Expirada' : filters.status}
              </span>
            )}
            
            {filters.client !== 'todos' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Cliente: {getClientDisplayName(clients.find(c => c.id === filters.client)) || filters.client}
              </span>
            )}
            
            {(filters.startDate || filters.endDate) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Fechas: {filters.startDate || '...'} - {filters.endDate || '...'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteFilters;