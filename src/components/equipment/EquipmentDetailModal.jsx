import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaTrash, FaTools, FaHistory, FaExclamationTriangle, FaCheckCircle, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useApp } from '../../hooks/useApp';

const EquipmentDetailModal = ({ equipment, isOpen, onClose, onEdit, onDelete, onStatusChange }) => {
  console.log('🔥🔥🔥 EquipmentDetailModal rendered:', { isOpen, equipment: !!equipment });
  
  const { clients, services } = useApp();
  const [equipmentServices, setEquipmentServices] = useState([]);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  // Cargar servicios relacionados al equipo
  useEffect(() => {
    if (equipment?.id && services) {
      console.log('🔥🔥🔥 Loading services for equipment:', equipment.id);
      // Filtrar servicios que incluyen este equipo en equipmentIds
      const relatedServices = services.filter(service => 
        service.equipmentIds && service.equipmentIds.includes(equipment.id)
      );
      console.log('🔥🔥🔥 Found related services:', relatedServices.length);
      setEquipmentServices(relatedServices.slice(0, 10)); // Últimos 10 servicios
    } else {
      setEquipmentServices([]);
    }
  }, [equipment, services]);

  // Obtener información del cliente
  const getClientInfo = () => {
    if (!equipment?.clientId || !clients) return null;
    
    const client = clients.find(c => c.id === equipment.clientId);
    if (!client) return null;
    
    return {
      name: client.clientType === 'COMPANY' ? client.companyName : client.contactPerson,
      type: client.clientType === 'COMPANY' ? 'Empresa' : 'Persona Natural',
      email: client.email,
      phone: client.phone
    };
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('🔥🔥🔥 Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  // Formatear fecha con hora
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('🔥🔥🔥 Error formatting datetime:', error);
      return 'Fecha inválida';
    }
  };

  // Obtener información del estado
  const getStatusInfo = (status) => {
    const statusMap = {
      'ACTIVE': { 
        label: 'Operativo', 
        icon: FaCheckCircle, 
        color: 'text-green-600', 
        bg: 'bg-green-100', 
        border: 'border-green-200' 
      },
      'MAINTENANCE': { 
        label: 'Requiere Mantenimiento', 
        icon: FaTools, 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100', 
        border: 'border-yellow-200' 
      },
      'BROKEN': { 
        label: 'Fuera de Servicio', 
        icon: FaExclamationTriangle, 
        color: 'text-red-600', 
        bg: 'bg-red-100', 
        border: 'border-red-200' 
      },
      'INACTIVE': { 
        label: 'Inactivo', 
        icon: FaClock, 
        color: 'text-gray-600', 
        bg: 'bg-gray-100', 
        border: 'border-gray-200' 
      }
    };
    return statusMap[status] || statusMap['INACTIVE'];
  };

  // Verificar si la garantía está vigente
  const getWarrantyStatus = () => {
    if (!equipment?.warrantyExpiry) return null;
    
    const warrantyDate = new Date(equipment.warrantyExpiry);
    const today = new Date();
    const diffTime = warrantyDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return { status: 'valid', message: `Válida por ${diffDays} días más`, color: 'text-green-600' };
    } else if (diffDays > 0) {
      return { status: 'expiring', message: `Vence en ${diffDays} días`, color: 'text-yellow-600' };
    } else {
      return { status: 'expired', message: `Vencida hace ${Math.abs(diffDays)} días`, color: 'text-red-600' };
    }
  };

  // Manejar cambio de estado
  const handleStatusChange = async (newStatus) => {
    console.log('🔥🔥🔥 Changing equipment status to:', newStatus);
    setIsChangingStatus(true);
    try {
      await onStatusChange(equipment.id, newStatus);
    } catch (error) {
      console.error('🔥🔥🔥 Error changing status:', error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Obtener badge de estado de servicio
  const getServiceStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      'IN_PROGRESS': { label: 'En Progreso', className: 'bg-blue-100 text-blue-800' },
      'COMPLETED': { label: 'Completado', className: 'bg-green-100 text-green-800' },
      'CANCELLED': { label: 'Cancelado', className: 'bg-gray-100 text-gray-800' },
      'SCHEDULED': { label: 'Programado', className: 'bg-purple-100 text-purple-800' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (!isOpen || !equipment) return null;

  const statusInfo = getStatusInfo(equipment.status);
  const StatusIcon = statusInfo.icon;
  const clientInfo = getClientInfo();
  const warrantyStatus = getWarrantyStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-gray-800">{equipment.name}</h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
              <StatusIcon size={16} />
              <span className="text-sm font-medium">{statusInfo.label}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal - Información del Equipo */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Básica */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaTools className="mr-2 text-blue-600" />
                  Información Técnica
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tipo:</label>
                    <p className="text-gray-900 font-medium">{equipment.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Marca:</label>
                    <p className="text-gray-900 font-medium">{equipment.brand}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Modelo:</label>
                    <p className="text-gray-900">{equipment.model || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Número de Serie:</label>
                    <p className="text-gray-900 font-mono text-sm">{equipment.serialNumber || 'No especificado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      Ubicación:
                    </label>
                    <p className="text-gray-900">{equipment.location || 'No especificada'}</p>
                  </div>
                </div>
              </div>

              {/* Fechas y Garantía */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaClock className="mr-2 text-blue-600" />
                  Fechas Importantes
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Fecha de Instalación:</label>
                    <p className="text-gray-900">{formatDate(equipment.installDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Vencimiento de Garantía:</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900">{formatDate(equipment.warrantyExpiry)}</p>
                      {warrantyStatus && (
                        <span className={`text-sm font-medium ${warrantyStatus.color}`}>
                          ({warrantyStatus.message})
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Registrado:</label>
                    <p className="text-gray-900">{formatDate(equipment.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Última Actualización:</label>
                    <p className="text-gray-900">{formatDate(equipment.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {equipment.notes && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Notas y Observaciones</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{equipment.notes}</p>
                </div>
              )}

              {/* Historial de Servicios */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaHistory className="mr-2 text-blue-600" />
                  Historial de Servicios ({equipmentServices.length})
                </h4>
                
                {equipmentServices.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {equipmentServices.map((service) => (
                      <div key={service.id} className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">{service.title}</h5>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                          {getServiceStatusBadge(service.status)}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Programado: {formatDateTime(service.scheduledDate)}</span>
                          <span>Tipo: {service.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaHistory className="mx-auto text-4xl mb-2 opacity-50" />
                    <p>No hay servicios registrados para este equipo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Cliente y Acciones */}
            <div className="space-y-6">
              {/* Información del Cliente */}
              {clientInfo && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Cliente</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Nombre:</label>
                      <p className="text-gray-900 font-medium">{clientInfo.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Tipo:</label>
                      <p className="text-gray-900">{clientInfo.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email:</label>
                      <p className="text-gray-900">{clientInfo.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Teléfono:</label>
                      <p className="text-gray-900">{clientInfo.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cambiar Estado */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Estado</h4>
                <select
                  value={equipment.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isChangingStatus}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="ACTIVE">Operativo</option>
                  <option value="MAINTENANCE">Requiere Mantenimiento</option>
                  <option value="BROKEN">Fuera de Servicio</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
                {isChangingStatus && (
                  <p className="text-sm text-blue-600 mt-2">Actualizando estado...</p>
                )}
              </div>

              {/* Acciones */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Acciones</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onEdit(equipment)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit className="mr-2" />
                    Editar Equipo
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Está seguro de eliminar el equipo "${equipment.name}"?`)) {
                        onDelete(equipment);
                      }
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Eliminar Equipo
                  </button>
                </div>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Servicios:</span>
                    <span className="font-medium">{equipmentServices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Servicios Completados:</span>
                    <span className="font-medium">
                      {equipmentServices.filter(s => s.status === 'COMPLETED').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo en Sistema:</span>
                    <span className="font-medium">
                      {Math.ceil((new Date() - new Date(equipment.createdAt)) / (1000 * 60 * 60 * 24))} días
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailModal;