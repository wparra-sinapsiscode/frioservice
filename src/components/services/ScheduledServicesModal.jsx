import React, { useState, useEffect } from 'react';
import { 
  FiClock, FiMapPin, FiPhone, FiUser, FiTool, FiCalendar, 
  FiX, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiXCircle 
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';

const ScheduledServicesModal = ({ isOpen, onClose, clientId }) => {
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');
  const { user } = useAuth();
  const { services, fetchServices, isLoadingServices } = useApp();


  useEffect(() => {
    if (isOpen) {
      loadServices();
    }
  }, [isOpen]);

  const loadServices = async () => {
    console.log('========== INICIO DEBUG SERVICIOS (MÉTODO CORREGIDO) ==========');
    console.log('1️⃣ Usuario actual:', user);
    console.log('2️⃣ User token disponible:', !!user?.token);
    console.log('3️⃣ Services desde contexto:', services?.length || 0);
    console.log('4️⃣ isLoadingServices:', isLoadingServices);
    
    let debugMessages = [];
    setLoading(true);
    
    try {
      // Si no tenemos servicios en el contexto, intentar cargarlos
      if (!services || services.length === 0) {
        console.log('5️⃣ Cargando servicios desde contexto...');
        debugMessages.push('Cargando servicios desde contexto...');
        await fetchServices();
      }
      
      console.log('6️⃣ Servicios disponibles en contexto:', services?.length || 0);
      debugMessages.push(`Servicios en contexto: ${services?.length || 0}`);
      
      // Filtrar servicios programados (no completados, no cancelados)
      const programmedServices = (services || []).filter(service => 
        ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(service.status)
      );
      
      console.log('7️⃣ Servicios programados filtrados:', programmedServices.length);
      debugMessages.push(`Servicios programados: ${programmedServices.length}`);
      
      if (programmedServices.length > 0) {
        console.log('8️⃣ Primer servicio programado:', programmedServices[0]);
        debugMessages.push(`Sample service: ${programmedServices[0]?.id || 'No ID'}`);
      }
      
      setFilteredServices(programmedServices);
      setDebugInfo(debugMessages.join('\n'));
      
    } catch (error) {
      console.error('❌ ERROR:', error);
      debugMessages.push(`❌ Error: ${error.message}`);
      setFilteredServices([]);
      setDebugInfo(debugMessages.join('\n'));
    } finally {
      setLoading(false);
      console.log('========== FIN DEBUG SERVICIOS ==========');
    }
  };

  // Format date using the same style as dashboard
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time using the same style as dashboard
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status colors matching dashboard theme
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text matching dashboard
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  // Get status icon matching dashboard style
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FiClock className="text-yellow-600" />;
      case 'CONFIRMED':
        return <FiCheckCircle className="text-blue-600" />;
      case 'IN_PROGRESS':
        return <FiTool className="text-orange-600" />;
      case 'COMPLETED':
        return <FiCheckCircle className="text-green-600" />;
      default:
        return <FiAlertCircle className="text-gray-600" />;
    }
  };

  // Get priority border color - using DB enum values
  const getPriorityBorder = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'border-l-red-500';
      case 'HIGH':
        return 'border-l-red-400';
      case 'MEDIUM':
        return 'border-l-orange-500';
      case 'LOW':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  // Get priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'Urgente';
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Media';
      case 'LOW':
        return 'Baja';
      default:
        return 'No definida';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-700';
      case 'HIGH':
        return 'bg-red-100 text-red-700';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-700';
      case 'LOW':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return 'No definida';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header - matching dashboard style */}
        <div className="bg-white border-b p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-blue-600 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Servicios Programados</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadServices}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                <span className="text-sm">Actualizar</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-600">Cargando servicios programados...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiCalendar className="mx-auto mb-3" size={48} />
              <h3 className="text-lg font-semibold mb-2">No hay servicios programados</h3>
              <p className="text-sm">Los servicios que solicites aparecerán aquí</p>
              
              {/* Debug Info */}
              {debugInfo && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                  <h4 className="font-semibold mb-2 text-red-600">🐛 Debug Info:</h4>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                    {debugInfo}
                  </pre>
                  <p className="text-xs text-gray-500 mt-2">
                    ClientId usado: {clientId || 'undefined'}<br/>
                    Token presente: {localStorage.getItem('token') ? 'Sí' : 'No'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className={`border-l-4 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${getPriorityBorder(service.priority)}`}
                >
                  {/* Service Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600">#{service.id}</p>
                      </div>
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle(service.status)}`}>
                      {getStatusText(service.status)}
                    </div>
                  </div>

                  {/* Service Description */}
                  {service.description && (
                    <p className="text-gray-700 mb-3">{service.description}</p>
                  )}

                  {/* Service Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FiCalendar className="text-blue-600" size={14} />
                        <span className="font-medium">Fecha:</span>
                        <span>{formatDate(service.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FiClock className="text-orange-600" size={14} />
                        <span className="font-medium">Hora:</span>
                        <span>{formatTime(service.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FiTool className="text-green-600" size={14} />
                        <span className="font-medium">Duración estimada:</span>
                        <span>{formatDuration(service.estimatedDuration)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <FiMapPin className="text-purple-600 mt-0.5" size={14} />
                        <div>
                          <div className="font-medium">Dirección:</div>
                          <div className="text-gray-600">{service.address}</div>
                        </div>
                      </div>
                      
                      {service.technician ? (
                        <div className="flex items-center gap-2 text-sm">
                          <FiUser className="text-indigo-600" size={14} />
                          <span className="font-medium">Técnico:</span>
                          <span>{service.technician.name || `${service.technician.firstName} ${service.technician.lastName}`.trim() || service.technician.user?.username}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <FiUser className="text-gray-400" size={14} />
                          <span className="font-medium text-gray-500">Técnico:</span>
                          <span className="text-gray-500">Por asignar</span>
                        </div>
                      )}

                      {service.contactPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiPhone className="text-green-600" size={14} />
                          <span className="font-medium">Teléfono contacto:</span>
                          <a 
                            href={`tel:${service.contactPhone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {service.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Priority indicator */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Prioridad:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(service.priority)}`}>
                        {getPriorityText(service.priority)}
                      </span>
                    </div>
                    
                    {service.contactPhone && (
                      <button
                        onClick={() => window.open(`tel:${service.contactPhone}`)}
                        className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                      >
                        <FiPhone size={12} />
                        <span>Llamar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {!loading && filteredServices.length > 0 && (
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total de servicios programados: <strong>{filteredServices.length}</strong></span>
              <span>
                Próximos 7 días: <strong>
                  {filteredServices.filter(s => {
                    const serviceDate = new Date(s.scheduledDate);
                    const now = new Date();
                    const sevenDays = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
                    return serviceDate >= now && serviceDate <= sevenDays;
                  }).length}
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* Debug Footer - Siempre visible cuando hay debugInfo */}
        {!loading && debugInfo && filteredServices.length === 0 && (
          <div className="border-t bg-red-50 p-4">
            <div className="text-xs text-red-700">
              <strong>Debug Mode Activo</strong> - Revisa la consola del navegador para logs detallados
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledServicesModal;