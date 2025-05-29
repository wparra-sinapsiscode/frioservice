import React, { useState, useEffect } from 'react';
import { FiFilter, FiFileText, FiPackage, FiCalendar, FiDollarSign, FiCheckCircle, FiXCircle, FiAlertCircle, FiRefreshCw, FiEye } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import ServiceDetailModal from '../components/services/ServiceDetailModal';

const MyQuotes = () => {
  // Hooks para datos del contexto
  const { quotes, isLoadingQuotes, errorQuotes, approveQuote, rejectQuote, fetchQuotes } = useApp();
  const { user } = useAuth();
  
  // Estados del componente
  const [statusFilter, setStatusFilter] = useState('todas');
  const [isSubmitting, setIsSubmitting] = useState({});
  const [expandedQuote, setExpandedQuote] = useState(null);

  // Estados para modal de confirmación
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  
  // Estados para modal de servicio
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoadingService, setIsLoadingService] = useState(false);
  const [errorService, setErrorService] = useState(null);

  // Mapeo de estados del backend a estados del frontend
  const statusMapping = {
    'PENDING': 'pendiente',
    'APPROVED': 'aprobada', 
    'REJECTED': 'rechazada',
    'EXPIRED': 'vencida'
  };

  // Mapeo inverso para filtros
  const backendStatusMapping = {
    'pendiente': 'PENDING',
    'aprobada': 'APPROVED',
    'rechazada': 'REJECTED',
    'vencida': 'EXPIRED'
  };

  // Obtener fecha legible
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Verificar si una cotización está vencida
  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  // Obtener estado efectivo de la cotización
  const getEffectiveStatus = (quote) => {
    if (quote.status === 'PENDING' && isExpired(quote.validUntil)) {
      return 'vencida';
    }
    return statusMapping[quote.status] || 'pendiente';
  };

  // Filtrar cotizaciones por estado
  const filteredQuotes = statusFilter === 'todas' 
    ? quotes 
    : quotes.filter(quote => getEffectiveStatus(quote) === statusFilter);

  // Manejar aprobación de cotización
  const handleApprove = async (quoteId) => {
    setIsSubmitting(prev => ({ ...prev, [quoteId]: true }));
    try {
      await approveQuote(quoteId, actionNotes.trim() || undefined);
      setShowApproveModal(false);
      setSelectedQuote(null);
      setActionNotes('');
    } catch (error) {
      console.error('Error al aprobar cotización:', error);
      alert(`Error al aprobar la cotización: ${error.message}`);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [quoteId]: false }));
    }
  };

  // Manejar rechazo de cotización
  const handleReject = async (quoteId) => {
    setIsSubmitting(prev => ({ ...prev, [quoteId]: true }));
    try {
      await rejectQuote(quoteId, actionNotes.trim() || undefined);
      setShowRejectModal(false);
      setSelectedQuote(null);
      setActionNotes('');
    } catch (error) {
      console.error('Error al rechazar cotización:', error);
      alert(`Error al rechazar la cotización: ${error.message}`);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [quoteId]: false }));
    }
  };

  // Abrir modal de aprobación
  const openApproveModal = (quote) => {
    setSelectedQuote(quote);
    setActionNotes('');
    setShowApproveModal(true);
  };

  // Abrir modal de rechazo  
  const openRejectModal = (quote) => {
    setSelectedQuote(quote);
    setActionNotes('');
    setShowRejectModal(true);
  };

  // Función para obtener datos del servicio y abrir el modal
  const handleViewService = async (serviceId) => {
    setIsLoadingService(true);
    setErrorService(null);
    try {
      const response = await fetch(`http://localhost:3001/api/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del servicio.');
      }
      
      const data = await response.json();
      setSelectedService(data.data || data);
      setShowServiceModal(true);
    } catch (error) {
      console.error('Error al obtener detalles del servicio:', error);
      setErrorService(error.message);
    } finally {
      setIsLoadingService(false);
    }
  };

  // Obtener estadísticas rápidas
  const stats = {
    total: quotes.length,
    pendientes: quotes.filter(q => getEffectiveStatus(q) === 'pendiente').length,
    aprobadas: quotes.filter(q => getEffectiveStatus(q) === 'aprobada').length,
    rechazadas: quotes.filter(q => getEffectiveStatus(q) === 'rechazada').length,
    vencidas: quotes.filter(q => getEffectiveStatus(q) === 'vencida').length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Cotizaciones</h1>
        <button
          onClick={() => fetchQuotes()}
          disabled={isLoadingQuotes}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <FiRefreshCw className={isLoadingQuotes ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.aprobadas}</div>
          <div className="text-sm text-gray-600">Aprobadas</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.rechazadas}</div>
          <div className="text-sm text-gray-600">Rechazadas</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.vencidas}</div>
          <div className="text-sm text-gray-600">Vencidas</div>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              statusFilter === 'todas' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('todas')}
          >
            Todas ({stats.total})
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              statusFilter === 'pendiente' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('pendiente')}
          >
            Pendientes ({stats.pendientes})
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              statusFilter === 'aprobada' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('aprobada')}
          >
            Aprobadas ({stats.aprobadas})
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              statusFilter === 'rechazada' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('rechazada')}
          >
            Rechazadas ({stats.rechazadas})
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              statusFilter === 'vencida' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('vencida')}
          >
            Vencidas ({stats.vencidas})
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorQuotes && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <span>Error al cargar cotizaciones: {errorQuotes}</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoadingQuotes ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cotizaciones...</p>
        </div>
      ) : (
        /* Lista de Cotizaciones */
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Cotizaciones ({filteredQuotes.length})
          </h2>
          
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-8">
              <FiFileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg mb-2">
                {statusFilter === 'todas' 
                  ? 'No tienes cotizaciones registradas' 
                  : `No hay cotizaciones ${statusFilter}`
                }
              </p>
              <p className="text-gray-400 text-sm">
                Las cotizaciones aparecerán aquí cuando nuestro equipo las genere para tus servicios solicitados.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuotes.map(quote => {
                const effectiveStatus = getEffectiveStatus(quote);
                const isQuoteExpanded = expandedQuote === quote.id;
                
                return (
                  <div key={quote.id} className="border rounded-lg overflow-hidden">
                    {/* Header de la cotización */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 border-b">
                      <div className="flex items-center">
                        <FiFileText className="text-blue-600 mr-3" size={20} />
                        <div>
                          <h3 className="font-semibold text-lg">{quote.title}</h3>
                          <p className="text-sm text-gray-500">
                            Cotización #{quote.id} • {formatDate(quote.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          effectiveStatus === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          effectiveStatus === 'aprobada' ? 'bg-green-100 text-green-800' :
                          effectiveStatus === 'rechazada' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {effectiveStatus === 'pendiente' ? '⏳ Pendiente' :
                           effectiveStatus === 'aprobada' ? '✅ Aprobada' :
                           effectiveStatus === 'rechazada' ? '❌ Rechazada' : '⏰ Vencida'}
                        </div>
                        <button
                          onClick={() => setExpandedQuote(isQuoteExpanded ? null : quote.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </div>
                    
                    {/* Contenido de la cotización */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Monto */}
                        <div className="flex items-center">
                          <FiDollarSign className="text-green-600 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Monto</p>
                            <p className="font-bold text-xl text-green-600">
                              S/ {quote.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Válida hasta */}
                        <div className="flex items-center">
                          <FiCalendar className="text-orange-600 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Válida hasta</p>
                            <p className={isExpired(quote.validUntil) ? 'text-red-600 font-medium' : ''}>
                              {formatDate(quote.validUntil)}
                            </p>
                            {isExpired(quote.validUntil) && quote.status === 'PENDING' && (
                              <p className="text-xs text-red-500">Cotización vencida</p>
                            )}
                          </div>
                        </div>

                        {/* Servicio relacionado */}
                        {quote.service && (
                          <div className="flex items-center">
                            <FiPackage className="text-blue-600 mr-2" />
                            <div>
                              <p className="text-sm text-gray-600 font-medium">Servicio</p>
                              <p className="text-sm">{quote.service.title}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Descripción */}
                      {quote.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 font-medium mb-1">Descripción</p>
                          <p className="text-gray-700">{quote.description}</p>
                        </div>
                      )}

                      {/* Detalles expandidos */}
                      {isQuoteExpanded && (
                        <div className="border-t pt-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Fechas importantes */}
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Fechas importantes</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Creada:</span>
                                  <span>{formatDate(quote.createdAt)}</span>
                                </div>
                                {quote.approvedAt && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Aprobada:</span>
                                    <span className="text-green-600">{formatDate(quote.approvedAt)}</span>
                                  </div>
                                )}
                                {quote.rejectedAt && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Rechazada:</span>
                                    <span className="text-red-600">{formatDate(quote.rejectedAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Notas adicionales */}
                            {quote.notes && (
                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">Notas adicionales</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {quote.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Acciones */}
                    <div className="border-t bg-gray-50 p-4 flex justify-end space-x-3">
                      {effectiveStatus === 'pendiente' && !isExpired(quote.validUntil) && (
                        <>
                          <button 
                            onClick={() => openApproveModal(quote)}
                            disabled={isSubmitting[quote.id]}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            <FiCheckCircle />
                            {isSubmitting[quote.id] ? 'Aprobando...' : 'Aprobar'}
                          </button>
                          <button 
                            onClick={() => openRejectModal(quote)}
                            disabled={isSubmitting[quote.id]}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            <FiXCircle />
                            {isSubmitting[quote.id] ? 'Rechazando...' : 'Rechazar'}
                          </button>
                        </>
                      )}
                      {effectiveStatus === 'aprobada' && quote.service && (
                        <button 
                          onClick={() => handleViewService(quote.service.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <FiPackage />
                          Ver Servicio
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de aprobación */}
      {showApproveModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Aprobar Cotización</h3>
            <p className="text-gray-600 mb-4">
              ¿Está seguro que desea aprobar la cotización por <strong>S/ {selectedQuote.amount.toFixed(2)}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Agregar comentarios o instrucciones especiales..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleApprove(selectedQuote.id)}
                disabled={isSubmitting[selectedQuote.id]}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting[selectedQuote.id] ? 'Aprobando...' : 'Aprobar Cotización'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rechazo */}
      {showRejectModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Rechazar Cotización</h3>
            <p className="text-gray-600 mb-4">
              ¿Está seguro que desea rechazar esta cotización?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del rechazo
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
                placeholder="Explique por qué rechaza esta cotización..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReject(selectedQuote.id)}
                disabled={isSubmitting[selectedQuote.id] || !actionNotes.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting[selectedQuote.id] ? 'Rechazando...' : 'Rechazar Cotización'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del servicio */}
      {showServiceModal && selectedService && (
        <ServiceDetailModal
          service={selectedService}
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
        />
      )}
      
      {/* Mensaje de error al cargar servicio */}
      {errorService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Error</h3>
            <p className="text-gray-700 mb-4">{errorService}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorService(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuotes;