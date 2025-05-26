import React, { useMemo } from 'react';
import { FaFilter, FaEraser, FaTimes } from 'react-icons/fa';
import { getClientDisplayName } from '../../utils/clientUtils';

const ServiceFilters = ({ filters, onFilterChange, technicians, clients }) => {
  console.log('🔥🔥🔥 1. SERVICE FILTERS: Renderizando filtros', {
    filtersCount: Object.keys(filters).length,
    clientsCount: clients?.length || 0,
    techniciansCount: technicians?.length || 0,
    currentFilters: filters
  });

  // Configuración de opciones para cada filtro
  const statusOptions = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'IN_PROGRESS', label: 'En Progreso' },
    { value: 'COMPLETED', label: 'Completado' },
    { value: 'CANCELLED', label: 'Cancelado' },
    { value: 'ON_HOLD', label: 'En Espera' },
    { value: 'SCHEDULED', label: 'Programado' }
  ];

  const typeOptions = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'MAINTENANCE', label: 'Mantenimiento' },
    { value: 'REPAIR', label: 'Reparación' },
    { value: 'INSTALLATION', label: 'Instalación' },
    { value: 'INSPECTION', label: 'Inspección' },
    { value: 'EMERGENCY', label: 'Emergencia' },
    { value: 'CLEANING', label: 'Limpieza' },
    { value: 'CONSULTATION', label: 'Consultoría' }
  ];

  const priorityOptions = [
    { value: 'todos', label: 'Todas las prioridades' },
    { value: 'LOW', label: '🟢 Baja' },
    { value: 'MEDIUM', label: '🟡 Media' },
    { value: 'HIGH', label: '🟠 Alta' },
    { value: 'URGENT', label: '🔴 Urgente' }
  ];

  // Función para manejar cambios en los filtros
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('🔥🔥🔥 2. SERVICE FILTERS: Cambio de filtro', { name, value });
    
    const newFilters = { ...filters, [name]: value };
    console.log('🔥🔥🔥 3. SERVICE FILTERS: Nuevos filtros enviados al padre:', newFilters);
    onFilterChange(newFilters);
  };

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    console.log('🔥🔥🔥 4. SERVICE FILTERS: Limpiando todos los filtros');
    
    const clearedFilters = {
      status: 'todos',
      type: 'todos',
      priority: 'todos',
      client: 'todos',
      technician: 'todos',
      startDate: '',
      endDate: ''
    };
    
    console.log('🔥🔥🔥 5. SERVICE FILTERS: Filtros limpiados enviados:', clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Función para remover un filtro específico
  const handleRemoveFilter = (filterName) => {
    console.log('🔥🔥🔥 6. SERVICE FILTERS: Removiendo filtro específico:', filterName);
    
    const resetValue = ['startDate', 'endDate'].includes(filterName) ? '' : 'todos';
    const newFilters = { ...filters, [filterName]: resetValue };
    
    console.log('🔥🔥🔥 7. SERVICE FILTERS: Filtro removido, nuevos filtros:', newFilters);
    onFilterChange(newFilters);
  };

  // Contar filtros activos (que no sean 'todos' o vacíos)
  const activeFiltersCount = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => {
      return value && value !== 'todos' && value !== '';
    });
    
    console.log('🔥🔥🔥 8. SERVICE FILTERS: Filtros activos:', activeFilters);
    return activeFilters.length;
  }, [filters]);

  // Función para obtener etiqueta de filtro activo
  const getActiveFilterLabel = (key, value) => {
    switch (key) {
      case 'status':
        return statusOptions.find(opt => opt.value === value)?.label || value;
      case 'type':
        return typeOptions.find(opt => opt.value === value)?.label || value;
      case 'priority':
        return priorityOptions.find(opt => opt.value === value)?.label || value;
      case 'client':
        const client = clients?.find(c => c.id === value);
        return client ? getClientDisplayName(client) : value;
      case 'technician':
        const technician = technicians?.find(t => t.id === value);
        return technician ? `${technician.firstName} ${technician.lastName}` : value;
      case 'startDate':
        return `Desde: ${new Date(value).toLocaleDateString('es-CO')}`;
      case 'endDate':
        return `Hasta: ${new Date(value).toLocaleDateString('es-CO')}`;
      default:
        return value;
    }
  };

  console.log('🔥🔥🔥 9. SERVICE FILTERS: Renderizando componente con', activeFiltersCount, 'filtros activos');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Título y contador de filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Botón limpiar filtros */}
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <FaEraser className="text-xs" />
            <span>Limpiar todo</span>
          </button>
        )}
      </div>

      {/* Filtros activos (badges) */}
      {activeFiltersCount > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === 'todos' || value === '') return null;
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  <span>{getActiveFilterLabel(key, value)}</span>
                  <button
                    onClick={() => handleRemoveFilter(key)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Controles de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Estado */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            name="status"
            value={filters.status || 'todos'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Servicio
          </label>
          <select
            name="type"
            value={filters.type || 'todos'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Prioridad
          </label>
          <select
            name="priority"
            value={filters.priority || 'todos'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <select
            name="client"
            value={filters.client || 'todos'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="todos">Todos los clientes</option>
            {clients && clients.length > 0 ? (
              clients.map(client => (
                <option key={client.id} value={client.id}>
                  {getClientDisplayName(client)}
                </option>
              ))
            ) : (
              <option disabled>Cargando clientes...</option>
            )}
          </select>
        </div>

        {/* Técnico */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Técnico Asignado
          </label>
          <select
            name="technician"
            value={filters.technician || 'todos'}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            <option value="todos">Todos los técnicos</option>
            {technicians && technicians.length > 0 ? (
              technicians.map(technician => (
                <option key={technician.id} value={technician.id}>
                  {technician.firstName} {technician.lastName}
                </option>
              ))
            ) : (
              <option disabled>Cargando técnicos...</option>
            )}
          </select>
        </div>

        {/* Fecha Desde */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Fecha Desde
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Fecha Hasta
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ''}
            onChange={handleChange}
            min={filters.startDate || undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Mensaje de ayuda */}
      {activeFiltersCount === 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 text-center">
            💡 Usa los filtros para encontrar servicios específicos más rápidamente
          </p>
        </div>
      )}

      {/* Resumen de filtros aplicados */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>{activeFiltersCount}</strong> filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}.
            Los resultados se actualizan automáticamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceFilters;