import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getClientDisplayName } from '../../utils/clientUtils';
import { useApp } from '../../hooks/useApp';

const ServicesTable = ({ services, onView, onEdit, onDelete, isLoading }) => {
  console.log('🔥🔥🔥 1. SERVICES TABLE: Renderizando tabla con', services?.length || 0, 'servicios');

  // Obtener clientes y técnicos del contexto para resolver IDs
  const { clients, technicians } = useApp();

  console.log('🔥🔥🔥 2. SERVICES TABLE: Datos del contexto', {
    clientsCount: clients?.length || 0,
    techniciansCount: technicians?.length || 0,
    firstService: services?.[0] || null
  });

  // Función para resolver clientId a nombre
  const resolveClientName = (clientId) => {
    if (!clientId) return 'Sin cliente';
    
    const client = clients?.find(c => c.id === clientId);
    if (!client) return `Cliente ID: ${clientId}`;
    
    return getClientDisplayName(client);
  };

  // Función para resolver technicianId a nombre
  const resolveTechnicianName = (technicianId) => {
    if (!technicianId) return 'Sin asignar';
    
    const technician = technicians?.find(t => t.id === technicianId);
    if (!technician) return `Técnico ID: ${technicianId}`;
    
    return `${technician.firstName} ${technician.lastName}`;
  };

  // Función para formatear fecha colombiana
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('🔥🔥🔥 ERROR formateando fecha:', error);
      return dateString;
    }
  };

  // Función para obtener badge de estado
  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Pendiente'
      },
      'IN_PROGRESS': {
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'En Progreso'
      },
      'COMPLETED': {
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Completado'
      },
      'CANCELLED': {
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Cancelado'
      },
      'ON_HOLD': {
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        label: 'En Espera'
      },
      'SCHEDULED': {
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Programado'
      }
    };

    const config = statusConfig[status] || {
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      label: status || 'Desconocido'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Función para obtener badge de tipo
  const getTypeBadge = (type) => {
    const typeConfig = {
      'MAINTENANCE': {
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        label: 'Mantenimiento'
      },
      'REPAIR': {
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'Reparación'
      },
      'INSTALLATION': {
        className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        label: 'Instalación'
      },
      'INSPECTION': {
        className: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        label: 'Inspección'
      },
      'EMERGENCY': {
        className: 'bg-rose-100 text-rose-800 border-rose-200',
        label: 'Emergencia'
      },
      'CLEANING': {
        className: 'bg-teal-100 text-teal-800 border-teal-200',
        label: 'Limpieza'
      },
      'CONSULTATION': {
        className: 'bg-violet-100 text-violet-800 border-violet-200',
        label: 'Consultoría'
      }
    };

    const config = typeConfig[type] || {
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      label: type || 'Desconocido'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Función para obtener indicador de prioridad
  const getPriorityIndicator = (priority) => {
    const priorityConfig = {
      'LOW': {
        icon: '🟢',
        className: 'text-green-600',
        label: 'Baja'
      },
      'MEDIUM': {
        icon: '🟡',
        className: 'text-yellow-600',
        label: 'Media'
      },
      'HIGH': {
        icon: '🟠',
        className: 'text-orange-600',
        label: 'Alta'
      },
      'URGENT': {
        icon: '🔴',
        className: 'text-red-600',
        label: 'Urgente'
      }
    };

    const config = priorityConfig[priority] || {
      icon: '⚪',
      className: 'text-gray-600',
      label: priority || 'Sin definir'
    };

    return (
      <span className={`inline-flex items-center space-x-1 ${config.className}`} title={config.label}>
        <span className="text-lg">{config.icon}</span>
        <span className="text-xs font-medium">{config.label}</span>
      </span>
    );
  };

  // Función para truncar texto con tooltip
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    
    return (
      <span title={text} className="cursor-help">
        {text.substring(0, maxLength)}...
      </span>
    );
  };

  // Función para formatear ID corto
  const formatServiceId = (id) => {
    if (!id) return '-';
    // Si el ID es un CUID, mostrar solo los últimos 6 caracteres
    return id.length > 8 ? `...${id.slice(-6)}` : id;
  };

  console.log('🔥🔥🔥 3. SERVICES TABLE: Renderizando tabla');

  return (
    <div className="overflow-x-auto w-full">
      {/* Vista de tabla para pantallas medianas y grandes */}
      <table className="w-full border-collapse mb-4 hidden md:table">
        <thead>
          <tr>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[200px]">
              Título
            </th>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[150px]">
              Cliente
            </th>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[130px]">
              Técnico
            </th>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[130px]">
              Tipo
            </th>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[120px]">
              Estado
            </th>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[100px]">
              Prioridad
            </th>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[150px]">
              Fecha Programada
            </th>
            <th className="py-3 px-4 text-left bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200 min-w-[120px]">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {services && services.length > 0 ? (
            services.map((service, index) => {
              console.log('🔥🔥🔥 4. SERVICES TABLE: Renderizando servicio', {
                index,
                serviceId: service.id,
                clientId: service.clientId,
                technicianId: service.technicianId,
                status: service.status,
                type: service.type,
                priority: service.priority
              });

              return (
                <tr key={service.id || index} className="hover:bg-gray-50 transition-colors">
                  {/* Título */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="font-medium text-gray-900">
                      {truncateText(service.title, 40)}
                    </div>
                    {service.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {truncateText(service.description, 50)}
                      </div>
                    )}
                  </td>

                  {/* Cliente */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      {truncateText(resolveClientName(service.clientId), 25)}
                    </div>
                  </td>

                  {/* Técnico */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="text-sm text-gray-700">
                      {truncateText(resolveTechnicianName(service.technicianId), 20)}
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    {getTypeBadge(service.type)}
                  </td>

                  {/* Estado */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    {getStatusBadge(service.status)}
                  </td>

                  {/* Prioridad */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    {getPriorityIndicator(service.priority)}
                  </td>

                  {/* Fecha Programada */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="text-sm text-gray-700">
                      {formatDate(service.scheduledDate)}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          console.log('🔥🔥🔥 5. SERVICES TABLE: Ver servicio', service.id);
                          onView && onView(service);
                        }}
                        className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        title="Ver detalles"
                        disabled={isLoading}
                      >
                        <FaEye className="text-blue-600 text-sm" />
                      </button>
                      <button 
                        onClick={() => {
                          console.log('🔥🔥🔥 6. SERVICES TABLE: Editar servicio', service.id);
                          onEdit && onEdit(service);
                        }}
                        className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                        title="Editar"
                        disabled={isLoading}
                      >
                        <FaEdit className="text-green-600 text-sm" />
                      </button>
                      <button 
                        onClick={() => {
                          console.log('🔥🔥🔥 7. SERVICES TABLE: Eliminar servicio', service.id);
                          onDelete && onDelete(service);
                        }}
                        className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200"
                        title="Eliminar"
                        disabled={isLoading}
                      >
                        <FaTrash className="text-red-600 text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="py-8 text-center text-gray-500 border-b border-gray-200">
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span>Cargando servicios...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg">📋</div>
                    <div>No se encontraron servicios</div>
                    <div className="text-sm text-gray-400">
                      Intenta ajustar los filtros o crear un nuevo servicio
                    </div>
                  </div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Vista de tarjetas para móviles */}
      <div className="md:hidden space-y-4">
        {services && services.length > 0 ? (
          services.map((service, index) => (
            <div key={service.id || index} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{truncateText(service.title, 40)}</h3>
                {getPriorityIndicator(service.priority)}
              </div>
              
              {service.description && (
                <p className="text-sm text-gray-500">{truncateText(service.description, 50)}</p>
              )}
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Cliente:</span>
                  <p className="text-gray-900">{truncateText(resolveClientName(service.clientId), 25)}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Técnico:</span>
                  <p className="text-gray-900">{truncateText(resolveTechnicianName(service.technicianId), 20)}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Tipo:</span>
                  <div className="mt-1">{getTypeBadge(service.type)}</div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Estado:</span>
                  <div className="mt-1">{getStatusBadge(service.status)}</div>
                </div>
                
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Fecha Programada:</span>
                  <p className="text-gray-900">{formatDate(service.scheduledDate)}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 mt-3">
                <button 
                  onClick={() => onView && onView(service)}
                  className="px-3 py-1.5 rounded-md flex items-center justify-center border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-xs font-medium"
                  disabled={isLoading}
                >
                  <FaEye className="text-blue-600 text-xs mr-1" />
                  Ver
                </button>
                <button 
                  onClick={() => onEdit && onEdit(service)}
                  className="px-3 py-1.5 rounded-md flex items-center justify-center border border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-xs font-medium"
                  disabled={isLoading}
                >
                  <FaEdit className="text-green-600 text-xs mr-1" />
                  Editar
                </button>
                <button 
                  onClick={() => onDelete && onDelete(service)}
                  className="px-3 py-1.5 rounded-md flex items-center justify-center border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-xs font-medium"
                  disabled={isLoading}
                >
                  <FaTrash className="text-red-600 text-xs mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Cargando servicios...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg">📋</div>
                <div>No se encontraron servicios</div>
                <div className="text-sm text-gray-400">
                  Intenta ajustar los filtros o crear un nuevo servicio
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {services && services.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Mostrando {services.length} servicio{services.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ServicesTable;