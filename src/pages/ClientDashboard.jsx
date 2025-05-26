import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { 
  FiFileText, 
  FiTool, 
  FiPackage, 
  FiClock, 
  FiCalendar,
  FiUser,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiArrowRight
} from 'react-icons/fi';
import ServiceDetailModal from '../components/services/ServiceDetailModal';
import ScheduledServicesModal from '../components/services/ScheduledServicesModal';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduledServicesModalOpen, setIsScheduledServicesModalOpen] = useState(false);
  const { user } = useAuth();
  const { 
    equipment, 
    isLoadingEquipment,
    services,
    isLoadingServices,
    quotes,
    isLoadingQuotes,
    fetchEquipment,
    fetchServices,
    fetchQuotes
  } = useApp();

  // Calcular estadísticas en tiempo real
  const stats = useMemo(() => {
    const now = new Date();
    
    // Equipos
    const totalEquipment = equipment.length;
    const activeEquipment = equipment.filter(eq => eq.status === 'ACTIVE').length;
    const maintenanceEquipment = equipment.filter(eq => eq.status === 'MAINTENANCE').length;
    const brokenEquipment = equipment.filter(eq => eq.status === 'BROKEN').length;

    // Servicios
    const totalServices = services.length;
    const pendingServices = services.filter(s => s.status === 'PENDING').length;
    const confirmedServices = services.filter(s => s.status === 'CONFIRMED').length;
    const inProgressServices = services.filter(s => s.status === 'IN_PROGRESS').length;
    const completedServices = services.filter(s => s.status === 'COMPLETED').length;
    const scheduledServices = pendingServices + confirmedServices + inProgressServices;

    // Servicios próximos (próximos 7 días)
    const upcoming = services.filter(s => {
      if (!['PENDING', 'CONFIRMED'].includes(s.status)) return false;
      const serviceDate = new Date(s.scheduledDate);
      const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
      return serviceDate >= now && serviceDate <= sevenDaysFromNow;
    });

    // Cotizaciones
    const totalQuotes = quotes.length;
    const pendingQuotes = quotes.filter(q => {
      if (q.status !== 'PENDING') return false;
      return new Date(q.validUntil) > now; // No vencidas
    }).length;
    const approvedQuotes = quotes.filter(q => q.status === 'APPROVED').length;
    const rejectedQuotes = quotes.filter(q => q.status === 'REJECTED').length;

    // Cotizaciones recientes (últimas 5)
    const recentQuotes = quotes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Servicios próximos (próximos 5)
    const upcomingServices = upcoming
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(0, 5);

    // Alertas
    const alerts = [];
    
    // Equipos que requieren atención
    if (brokenEquipment > 0) {
      alerts.push({
        type: 'error',
        title: 'Equipos fuera de servicio',
        message: `${brokenEquipment} equipo(s) necesitan reparación urgente`,
        action: () => navigate('/cliente/mis-equipos')
      });
    }
    
    if (maintenanceEquipment > 0) {
      alerts.push({
        type: 'warning', 
        title: 'Mantenimiento requerido',
        message: `${maintenanceEquipment} equipo(s) requieren mantenimiento`,
        action: () => navigate('/cliente/mis-equipos')
      });
    }

    // Cotizaciones pendientes
    if (pendingQuotes > 0) {
      alerts.push({
        type: 'info',
        title: 'Cotizaciones pendientes',
        message: `${pendingQuotes} cotización(es) esperan tu aprobación`,
        action: () => navigate('/cliente/mis-cotizaciones')
      });
    }

    // Servicios próximos
    if (upcoming.length > 0) {
      alerts.push({
        type: 'success',
        title: 'Servicios programados',
        message: `${upcoming.length} servicio(s) programados esta semana`,
        action: () => setIsScheduledServicesModalOpen(true)
      });
    }

    return {
      equipment: {
        total: totalEquipment,
        active: activeEquipment,
        maintenance: maintenanceEquipment,
        broken: brokenEquipment
      },
      services: {
        total: totalServices,
        pending: pendingServices,
        scheduled: scheduledServices,
        completed: completedServices,
        upcoming: upcoming.length
      },
      quotes: {
        total: totalQuotes,
        pending: pendingQuotes,
        approved: approvedQuotes,
        rejected: rejectedQuotes,
        recent: recentQuotes
      },
      upcomingServices,
      alerts
    };
  }, [equipment, services, quotes, navigate]);

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formatear hora
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener estado efectivo de cotización
  const getQuoteStatus = (quote) => {
    if (quote.status === 'PENDING' && new Date(quote.validUntil) < new Date()) {
      return 'vencida';
    }
    return {
      'PENDING': 'pendiente',
      'APPROVED': 'aprobada',
      'REJECTED': 'rechazada',
      'EXPIRED': 'vencida'
    }[quote.status] || 'pendiente';
  };

  // Manejar clic en servicio
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  // Manejar actualización manual
  const handleRefresh = async () => {
    try {
      await Promise.all([
        fetchEquipment(),
        fetchServices(),
        fetchQuotes()
      ]);
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    }
  };

  const isLoading = isLoadingEquipment || isLoadingServices || isLoadingQuotes;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Cliente</h1>
          <p className="text-gray-600">
            Bienvenido, {user?.profile?.companyName || user?.profile?.contactPerson || user?.username}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Alertas importantes */}
      {stats.alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {stats.alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                alert.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                alert.type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                'bg-green-50 border-green-500 text-green-700'
              }`}
              onClick={alert.action}
            >
              <div className="flex items-center gap-3">
                {alert.type === 'error' ? <FiXCircle /> :
                 alert.type === 'warning' ? <FiAlertCircle /> :
                 alert.type === 'info' ? <FiFileText /> :
                 <FiCheckCircle />}
                <div>
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-sm">{alert.message}</div>
                </div>
              </div>
              <FiArrowRight />
            </div>
          ))}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Cotizaciones Pendientes" 
          value={stats.quotes.pending}
          type="quotes"
          trend={stats.quotes.pending > 0 ? { positive: true, text: 'Requieren aprobación' } : null}
        />
        <div onClick={() => setIsScheduledServicesModalOpen(true)} className="cursor-pointer">
          <StatsCard 
            title="Servicios Programados" 
            value={stats.services.scheduled}
            type="pending"
            trend={stats.services.upcoming > 0 ? { positive: true, text: `${stats.services.upcoming} esta semana` } : null}
          />
        </div>
        <StatsCard 
          title="Equipos Registrados" 
          value={stats.equipment.total}
          type="completed"
          trend={stats.equipment.active > 0 ? { positive: true, text: `${stats.equipment.active} operativos` } : null}
        />
        <StatsCard 
          title="Servicios Completados" 
          value={stats.services.completed}
          type="income"
          trend={stats.services.completed > 0 ? { positive: true, text: 'Servicios finalizados' } : null}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cotizaciones Recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Cotizaciones Recientes
            </h2>
            <button 
              onClick={() => navigate('/cliente/mis-cotizaciones')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              Ver todas <FiArrowRight size={14} />
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando cotizaciones...</p>
            </div>
          ) : stats.quotes.recent.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiFileText className="mx-auto mb-2" size={32} />
              <p>No hay cotizaciones recientes</p>
              <p className="text-sm">Las cotizaciones aparecerán aquí cuando las genere nuestro equipo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.quotes.recent.map(quote => {
                const status = getQuoteStatus(quote);
                return (
                  <div key={quote.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{quote.title}</h3>
                        <p className="text-sm text-gray-600">{formatDate(quote.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">S/ {quote.amount.toFixed(2)}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          status === 'aprobada' ? 'bg-green-100 text-green-800' :
                          status === 'rechazada' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status === 'pendiente' ? 'Pendiente' :
                           status === 'aprobada' ? 'Aprobada' :
                           status === 'rechazada' ? 'Rechazada' : 'Vencida'}
                        </div>
                      </div>
                    </div>
                    {quote.description && (
                      <p className="text-sm text-gray-700 mb-2">{quote.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Válida hasta: {formatDate(quote.validUntil)}
                      </span>
                      <button 
                        onClick={() => navigate('/cliente/mis-cotizaciones')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Próximos Servicios */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FiClock className="text-orange-600" />
              Próximos Servicios
            </h2>
            <button 
              onClick={() => setIsScheduledServicesModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              Ver todos <FiArrowRight size={14} />
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando servicios...</p>
            </div>
          ) : stats.upcomingServices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiClock className="mx-auto mb-2" size={32} />
              <p>No hay servicios programados</p>
              <p className="text-sm">Solicita un nuevo servicio para tus equipos</p>
              <button 
                onClick={() => navigate('/cliente/solicitar-servicio')}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Solicitar Servicio
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.upcomingServices.map(service => (
                <div 
                  key={service.id} 
                  className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 rounded-r cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{service.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{service.description}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          {formatDate(service.scheduledDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={14} />
                          {formatTime(service.scheduledDate)}
                        </span>
                        {service.technician && (
                          <span className="flex items-center gap-1">
                            <FiUser size={14} />
                            {service.technician.name || 'Por asignar'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        service.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        service.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        service.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {service.status === 'PENDING' ? 'Pendiente' :
                         service.status === 'CONFIRMED' ? 'Confirmado' :
                         service.status === 'IN_PROGRESS' ? 'En Progreso' : 'Completado'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resumen de Equipos */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiPackage className="text-green-600" />
          Estado de Equipos
        </h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando equipos...</p>
          </div>
        ) : stats.equipment.total === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiPackage className="mx-auto mb-2" size={32} />
            <p>No tienes equipos registrados</p>
            <p className="text-sm">Registra tus equipos para poder solicitar servicios</p>
            <button 
              onClick={() => navigate('/cliente/mis-equipos')}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Registrar Equipo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.equipment.active}</div>
              <div className="text-sm text-green-700">Operativos</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.equipment.maintenance}</div>
              <div className="text-sm text-yellow-700">En Mantenimiento</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.equipment.broken}</div>
              <div className="text-sm text-red-700">Fuera de Servicio</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.equipment.total}</div>
              <div className="text-sm text-blue-700">Total Registrados</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Acciones Rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/cliente/solicitar-servicio')}
            className="border rounded-lg p-6 text-center hover:border-blue-500 hover:shadow-md transition-all duration-300 group"
          >
            <FiTool className="w-12 h-12 mx-auto text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Solicitar Servicio</h3>
            <p className="text-sm text-gray-600 mb-4">Programa un nuevo servicio para tus equipos</p>
            <div className="bg-blue-600 text-white px-4 py-2 rounded group-hover:bg-blue-700 transition-colors">
              Solicitar
            </div>
          </button>
          
          <button
            onClick={() => navigate('/cliente/mis-equipos')}
            className="border rounded-lg p-6 text-center hover:border-green-500 hover:shadow-md transition-all duration-300 group"
          >
            <FiPackage className="w-12 h-12 mx-auto text-green-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Gestionar Equipos</h3>
            <p className="text-sm text-gray-600 mb-4">Añade o administra tus equipos registrados</p>
            <div className="bg-green-600 text-white px-4 py-2 rounded group-hover:bg-green-700 transition-colors">
              Gestionar
            </div>
          </button>
          
          <button
            onClick={() => navigate('/cliente/mis-cotizaciones')}
            className="border rounded-lg p-6 text-center hover:border-purple-500 hover:shadow-md transition-all duration-300 group"
          >
            <FiFileText className="w-12 h-12 mx-auto text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Ver Cotizaciones</h3>
            <p className="text-sm text-gray-600 mb-4">Revisa y gestiona tus cotizaciones</p>
            <div className="bg-purple-600 text-white px-4 py-2 rounded group-hover:bg-purple-700 transition-colors">
              Ver Todas
            </div>
          </button>
        </div>
      </div>

      {/* Modal de Detalles del Servicio */}
      <ServiceDetailModal 
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Modal de Servicios Programados */}
      <ScheduledServicesModal 
        isOpen={isScheduledServicesModalOpen}
        onClose={() => setIsScheduledServicesModalOpen(false)}
        clientId={user?.id}
      />
    </div>
  );
};

export default ClientDashboard;