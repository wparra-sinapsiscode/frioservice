import React, { useState, useEffect } from 'react';
import { 
  FiClock, FiMapPin, FiPhone, FiMessageSquare, FiCamera,
  FiUser, FiTool, FiAlertCircle, FiCheckCircle, FiRefreshCw,
  FiEdit3, FiTrash2, FiPlus, FiFilter, FiSearch, FiCalendar
} from 'react-icons/fi';

const ScheduledServicesPanel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  const mockServices = [
    {
      id: 'SRV-2025-001',
      status: 'urgent',
      title: 'Reparación de Emergencia',
      date: '2025-05-28',
      time: '10:00 - 12:00',
      equipment: 'Refrigerador Industrial RI-2024-01',
      location: 'Cámara Fría #3',
      technician: 'Juan Pérez',
      rating: 5,
      phone: '+57 300 123 4567',
      issue: 'Temperatura elevada detectada (-2°C → +5°C)',
      priority: 'high'
    },
    {
      id: 'SRV-2025-002',
      status: 'scheduled',
      title: 'Mantenimiento Preventivo Programado',
      date: '2025-05-29',
      time: '14:00 - 16:00',
      equipment: 'Sistema de Ventilación SV-2023-05',
      location: 'Área Principal',
      technician: null,
      autoAssign: '2h',
      tasks: 'Limpieza filtros, revisión motores, calibración',
      priority: 'medium'
    },
    {
      id: 'SRV-2025-003',
      status: 'confirmed',
      title: 'Instalación de Componente Nuevo',
      date: '2025-05-31',
      time: '09:00 - 11:00',
      equipment: 'Congelador Comercial CC-2024-12',
      location: 'Cocina',
      technician: 'María González',
      rating: 5,
      components: 'Termostato digital, sensores IoT',
      confirmed: true,
      priority: 'low'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      urgent: 'bg-red-50 border-l-red-500 border-red-200',
      scheduled: 'bg-orange-50 border-l-orange-500 border-orange-200',
      confirmed: 'bg-blue-50 border-l-blue-500 border-blue-200',
      completed: 'bg-green-50 border-l-green-500 border-green-200'
    };
    return colors[status] || colors.scheduled;
  };

  const getStatusIcon = (status) => {
    const icons = {
      urgent: <FiAlertCircle className="text-red-500" />,
      scheduled: <FiClock className="text-orange-500" />,
      confirmed: <FiCheckCircle className="text-blue-500" />,
      completed: <FiCheckCircle className="text-green-500" />
    };
    return icons[status] || icons.scheduled;
  };

  const getStatusLabel = (status) => {
    const labels = {
      urgent: 'URGENTE',
      scheduled: 'PRÓXIMO',
      confirmed: 'CONFIRMADO',
      completed: 'COMPLETADO'
    };
    return labels[status] || 'PROGRAMADO';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-orange-500',
      low: 'bg-blue-500'
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'HOY';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'MAÑANA';
    } else {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'short' 
      }).toUpperCase();
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando servicios programados...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiCalendar className="text-blue-500 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-900">MIS SERVICIOS PROGRAMADOS</h1>
            </div>
            <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
              <FiRefreshCw className="text-sm" />
              <span>Sincronizar</span>
            </button>
          </div>
        </div>

        {/* Smart Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiFilter className="mr-2 text-blue-500" />
            FILTROS INTELIGENTES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>🗓️ Esta Semana</option>
              <option>📅 Próximos 7 días</option>
              <option>🗓️ Este Mes</option>
              <option>📆 Personalizado</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>📍 Todas las ubicaciones</option>
              <option>🏠 Cocina</option>
              <option>❄️ Cámara Fría</option>
              <option>🏢 Área Principal</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>⏱️ Todos</option>
              <option>🔴 Urgente</option>
              <option>🟡 Próximo</option>
              <option>🟢 Confirmado</option>
            </select>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por equipo o técnico..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            🚀 SERVICIOS PRÓXIMOS ({services.length})
          </h3>

          <div className="space-y-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`rounded-lg border-l-4 border-2 p-6 hover:shadow-lg transition-all duration-300 ${getStatusColor(service.status)}`}
              >
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(service.priority)}`}></div>
                    <span className="font-bold text-gray-900">{service.id}</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      {getStatusLabel(service.status)}
                    </span>
                  </div>
                  {getStatusIcon(service.status)}
                </div>

                {/* Decorative Line */}
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full mb-4 opacity-20"></div>

                {/* Service Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <FiCalendar className="text-blue-500 mr-2" />
                      <span className="font-semibold">{formatDate(service.date)}</span>
                      <span className="mx-2">|</span>
                      <span>{service.date}</span>
                      <span className="mx-2">|</span>
                      <FiClock className="text-orange-500 mr-1" />
                      <span>{service.time}</span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <FiTool className="text-green-500 mr-2" />
                      <span className="font-medium">{service.title}</span>
                    </div>

                    <div className="flex items-center mb-2">
                      <span className="mr-2">❄️</span>
                      <span>{service.equipment}</span>
                      {service.location && (
                        <>
                          <span className="mx-2">|</span>
                          <span className="text-gray-600">{service.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    {service.technician ? (
                      <div className="flex items-center mb-2">
                        <FiUser className="text-purple-500 mr-2" />
                        <span>Técnico: {service.technician}</span>
                        {service.rating && (
                          <span className="ml-2">{renderStars(service.rating)}</span>
                        )}
                        {service.phone && (
                          <>
                            <span className="mx-2">|</span>
                            <FiPhone className="text-green-500 mr-1" />
                            <span className="text-sm">{service.phone}</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center mb-2">
                        <FiUser className="text-gray-400 mr-2" />
                        <span className="text-gray-600">Por asignar</span>
                        {service.autoAssign && (
                          <>
                            <span className="mx-2">|</span>
                            <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                              🤖 Asignación automática en {service.autoAssign}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {service.issue && (
                      <div className="flex items-start mb-2">
                        <span className="mr-2">💡</span>
                        <span className="text-sm">Problema: {service.issue}</span>
                      </div>
                    )}

                    {service.tasks && (
                      <div className="flex items-start mb-2">
                        <span className="mr-2">📋</span>
                        <span className="text-sm">Tareas: {service.tasks}</span>
                      </div>
                    )}

                    {service.components && (
                      <div className="flex items-start mb-2">
                        <span className="mr-2">📦</span>
                        <span className="text-sm">Componentes: {service.components}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {service.status === 'urgent' && (
                    <>
                      <button className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiPhone className="text-xs" />
                        <span>Contactar</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiMapPin className="text-xs" />
                        <span>Ubicación</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiEdit3 className="text-xs" />
                        <span>Detalles</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiRefreshCw className="text-xs" />
                        <span>Reprogramar</span>
                      </button>
                    </>
                  )}

                  {service.status === 'scheduled' && (
                    <>
                      <button className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiEdit3 className="text-xs" />
                        <span>Modificar</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiTool className="text-xs" />
                        <span>Checklist</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiClock className="text-xs" />
                        <span>Historia</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiTrash2 className="text-xs" />
                        <span>Cancelar</span>
                      </button>
                    </>
                  )}

                  {service.status === 'confirmed' && (
                    <>
                      <button className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiPhone className="text-xs" />
                        <span>Contactar</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiMapPin className="text-xs" />
                        <span>Mapa</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiCamera className="text-xs" />
                        <span>Galería</span>
                      </button>
                      <button className="flex items-center space-x-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        <FiMessageSquare className="text-xs" />
                        <span>Chat</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📊 RESUMEN SEMANAL
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-gray-600">🎯 Esta semana</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">8h</div>
              <div className="text-gray-600">⏱️ Tiempo total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">$2,850,000</div>
              <div className="text-gray-600">💰 Valor estimado</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-700">
              📈 Próximos 7 días: 2 servicios más programados
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            ACCIONES RÁPIDAS
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
              <FiPlus />
              <span>Solicitar Servicio</span>
            </button>
            <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors">
              <FiPhone />
              <span>Emergencia 24h</span>
            </button>
            <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
              <FiMessageSquare />
              <span>Chat Soporte</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduledServicesPanel;