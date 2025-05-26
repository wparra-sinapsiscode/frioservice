import React from 'react';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock, 
  FaTools, 
  FaCheckCircle,
  FaUser,
  FaCalendarAlt
} from 'react-icons/fa';
import { getClientDisplayName } from '../../utils/clientUtils';
import { useApp } from '../../hooks/useApp';

const ServiceCard = ({ service, onView, onEdit, onDelete }) => {
  console.log('🔥🔥🔥 1. SERVICE CARD: Renderizando tarjeta para servicio', service?.id);

  // Obtener clientes y técnicos del contexto para resolver IDs
  const { clients, technicians } = useApp();

  console.log('🔥🔥🔥 2. SERVICE CARD: Datos del servicio', {
    serviceId: service?.id,
    clientId: service?.clientId,
    technicianId: service?.technicianId,
    status: service?.status,
    type: service?.type,
    priority: service?.priority
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

  // Función para formatear fecha amigable
  const formatFriendlyDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const formattedDate = date.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      const formattedTime = date.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      let relativeText = '';
      if (diffDays === 0) relativeText = 'Hoy';
      else if (diffDays === 1) relativeText = 'Mañana';
      else if (diffDays === -1) relativeText = 'Ayer';
      else if (diffDays > 1) relativeText = `En ${diffDays} días`;
      else if (diffDays < -1) relativeText = `Hace ${Math.abs(diffDays)} días`;

      return { formattedDate, formattedTime, relativeText };
    } catch (error) {
      console.error('🔥🔥🔥 ERROR formateando fecha:', error);
      return { formattedDate: dateString, formattedTime: '', relativeText: '' };
    }
  };

  // Configuración de colores de cabecera por tipo
  const getHeaderClass = (type) => {
    const typeConfig = {
      'MAINTENANCE': 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'REPAIR': 'bg-gradient-to-r from-red-500 to-red-600',
      'INSTALLATION': 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      'INSPECTION': 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      'EMERGENCY': 'bg-gradient-to-r from-rose-500 to-rose-600',
      'CLEANING': 'bg-gradient-to-r from-teal-500 to-teal-600',
      'CONSULTATION': 'bg-gradient-to-r from-violet-500 to-violet-600'
    };
    
    return typeConfig[type] || 'bg-gradient-to-r from-gray-500 to-gray-600';
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

  // Función para obtener icono y label de tipo
  const getTypeInfo = (type) => {
    const typeConfig = {
      'MAINTENANCE': { icon: FaTools, label: 'Mantenimiento' },
      'REPAIR': { icon: FaTools, label: 'Reparación' },
      'INSTALLATION': { icon: FaTools, label: 'Instalación' },
      'INSPECTION': { icon: FaEye, label: 'Inspección' },
      'EMERGENCY': { icon: FaTools, label: 'Emergencia' },
      'CLEANING': { icon: FaTools, label: 'Limpieza' },
      'CONSULTATION': { icon: FaUser, label: 'Consultoría' }
    };
    
    return typeConfig[type] || { icon: FaTools, label: type || 'Desconocido' };
  };

  // Función para obtener indicador de prioridad
  const getPriorityIndicator = (priority) => {
    const priorityConfig = {
      'LOW': { icon: '🟢', label: 'Baja', color: 'text-green-600' },
      'MEDIUM': { icon: '🟡', label: 'Media', color: 'text-yellow-600' },
      'HIGH': { icon: '🟠', label: 'Alta', color: 'text-orange-600' },
      'URGENT': { icon: '🔴', label: 'Urgente', color: 'text-red-600' }
    };

    const config = priorityConfig[priority] || { 
      icon: '⚪', 
      label: priority || 'Sin definir', 
      color: 'text-gray-600' 
    };

    return (
      <span className={`inline-flex items-center space-x-1 ${config.color}`}>
        <span className="text-sm">{config.icon}</span>
        <span className="text-xs font-medium">{config.label}</span>
      </span>
    );
  };

  // Función para formatear duración
  const formatDuration = (minutes) => {
    if (!minutes) return null;
    
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Función para formatear ID corto
  const formatServiceId = (id) => {
    if (!id) return '-';
    return id.length > 8 ? `...${id.slice(-6)}` : id;
  };

  const dateInfo = formatFriendlyDate(service.scheduledDate);
  const typeInfo = getTypeInfo(service.type);
  const TypeIcon = typeInfo.icon;
  const isEmergency = service.type === 'EMERGENCY';
  const isCompleted = service.status === 'COMPLETED';

  console.log('🔥🔥🔥 3. SERVICE CARD: Renderizando tarjeta');

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
      isEmergency ? 'ring-2 ring-red-500 ring-opacity-50' : ''
    }`}>
      {/* Cabecera con gradiente según tipo */}
      <div className={`${getHeaderClass(service.type)} text-white p-4 relative`}>
        {/* ID del servicio */}
        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm py-1 px-2 rounded-md text-xs font-mono">
          {formatServiceId(service.id)}
        </span>
        
        {/* Indicador de emergencia */}
        {isEmergency && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
            URGENTE
          </div>
        )}
        
        {/* Indicador de completado */}
        {isCompleted && (
          <FaCheckCircle className="absolute top-3 left-3 text-green-300 text-lg" />
        )}

        {/* Título del servicio */}
        <div className="mt-2">
          <h3 className="text-lg font-semibold mb-2 pr-16 line-clamp-2" title={service.title}>
            {service.title}
          </h3>
          
          {/* Cliente */}
          <div className="flex items-center space-x-2 text-white/90">
            <FaUser className="text-sm" />
            <span className="text-sm font-medium">
              {resolveClientName(service.clientId)}
            </span>
          </div>
        </div>
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="p-4 space-y-4">
        {/* Información principal */}
        <div className="grid grid-cols-2 gap-3">
          {/* Fecha programada */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-gray-600">
              <FaCalendarAlt className="text-xs" />
              <span className="text-xs font-medium">Programado</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {dateInfo.formattedDate}
            </div>
            <div className="text-xs text-gray-600">
              {dateInfo.formattedTime}
            </div>
            {dateInfo.relativeText && (
              <div className="text-xs text-blue-600 font-medium">
                {dateInfo.relativeText}
              </div>
            )}
          </div>

          {/* Técnico asignado */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-gray-600">
              <FaUser className="text-xs" />
              <span className="text-xs font-medium">Técnico</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {resolveTechnicianName(service.technicianId)}
            </div>
          </div>
        </div>

        {/* Tipo y Prioridad */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TypeIcon className="text-gray-500 text-sm" />
            <span className="text-sm text-gray-700">{typeInfo.label}</span>
          </div>
          <div>
            {getPriorityIndicator(service.priority)}
          </div>
        </div>

        {/* Duración estimada */}
        {service.estimatedDuration && (
          <div className="flex items-center space-x-2 text-gray-600">
            <FaClock className="text-xs" />
            <span className="text-sm">
              Duración: {formatDuration(service.estimatedDuration)}
            </span>
          </div>
        )}

        {/* Información de contacto */}
        <div className="space-y-2">
          {/* Dirección */}
          {service.address && (
            <div className="flex items-start space-x-2 text-gray-600">
              <FaMapMarkerAlt className="text-xs mt-1 flex-shrink-0" />
              <span className="text-sm line-clamp-2" title={service.address}>
                {service.address}
              </span>
            </div>
          )}

          {/* Teléfono */}
          {service.contactPhone && (
            <div className="flex items-center space-x-2 text-gray-600">
              <FaPhone className="text-xs" />
              <span className="text-sm">
                {service.contactPhone}
              </span>
            </div>
          )}
        </div>

        {/* Equipos asignados */}
        {service.equipmentIds && service.equipmentIds.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <FaTools className="text-xs" />
              <span className="text-xs font-medium">
                Equipos ({service.equipmentIds.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {service.equipmentIds.slice(0, 3).map((equipmentId, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                  title={equipmentId}
                >
                  Equipo {index + 1}
                </span>
              ))}
              {service.equipmentIds.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                  +{service.equipmentIds.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pie de la tarjeta */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        {/* Estado */}
        <div>
          {getStatusBadge(service.status)}
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button 
            onClick={() => {
              console.log('🔥🔥🔥 4. SERVICE CARD: Ver servicio', service.id);
              onView && onView(service);
            }}
            className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            title="Ver detalles"
          >
            <FaEye className="text-blue-600 text-sm" />
          </button>
          <button 
            onClick={() => {
              console.log('🔥🔥🔥 5. SERVICE CARD: Editar servicio', service.id);
              onEdit && onEdit(service);
            }}
            className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
            title="Editar"
          >
            <FaEdit className="text-green-600 text-sm" />
          </button>
          <button 
            onClick={() => {
              console.log('🔥🔥🔥 6. SERVICE CARD: Eliminar servicio', service.id);
              onDelete && onDelete(service);
            }}
            className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-200"
            title="Eliminar"
          >
            <FaTrash className="text-red-600 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;