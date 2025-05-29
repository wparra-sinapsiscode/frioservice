import React, { useState } from 'react';
import { X, Calendar, User, MapPin, FileText, Wrench, AlertCircle, Star, MessageSquare } from 'lucide-react';

const ServiceDetailModal = ({ service, isOpen, onClose }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  if (!isOpen || !service) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'CONFIRMED': return 'Confirmado';
      case 'IN_PROGRESS': return 'En Progreso';
      case 'COMPLETED': return 'Completado';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const getServiceTypeText = (type) => {
    switch (type) {
      case 'MAINTENANCE': return 'Mantenimiento';
      case 'REPAIR': return 'Reparación';
      case 'INSTALLATION': return 'Instalación';
      case 'INSPECTION': return 'Inspección';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // Obtener el token del localStorage/sessionStorage
      const userJson = sessionStorage.getItem('currentUser');
      const user = userJson ? JSON.parse(userJson) : null;
      const token = user?.token;
      
      if (!token) {
        throw new Error('No se pudo autenticar. Por favor inicie sesión nuevamente.');
      }
      
      const response = await fetch(`http://localhost:3001/api/services/${service.id}/rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment.trim()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar la evaluación');
      }
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowCommentForm(false);
      }, 2000);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const canRate = service.status === 'COMPLETED' && !service.clientRating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Wrench className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Detalles del Servicio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <h3 className="text-lg font-medium text-gray-900">
              {service.title || 'Sin título'}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(service.status)}`}>
              {getStatusText(service.status)}
            </span>
          </div>

          {/* Service Type */}
          <div className="flex items-center space-x-3">
            <Wrench className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Tipo de Servicio</p>
              <p className="text-gray-900">{getServiceTypeText(service.type)}</p>
            </div>
          </div>

          {/* Scheduled Date */}
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Fecha Programada</p>
              <p className="text-gray-900">{formatDate(service.scheduledDate)}</p>
            </div>
          </div>

          {/* Assigned Technician */}
          {service.assignedTechnician && (
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Técnico Asignado</p>
                <p className="text-gray-900">
                  {service.assignedTechnician.user?.name || 'Sin asignar'}
                </p>
                {service.assignedTechnician.user?.email && (
                  <p className="text-sm text-gray-500">
                    {service.assignedTechnician.user.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {service.description && (
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Descripción</p>
                <p className="text-gray-900 whitespace-pre-wrap">{service.description}</p>
              </div>
            </div>
          )}

          {/* Location */}
          {service.location && (
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Ubicación</p>
                <p className="text-gray-900">{service.location}</p>
              </div>
            </div>
          )}

          {/* Client Notes */}
          {service.clientNotes && (
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Notas del Cliente</p>
                <p className="text-gray-900 whitespace-pre-wrap">{service.clientNotes}</p>
              </div>
            </div>
          )}

          {/* Equipment Information */}
          {service.equipment && service.equipment.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Equipos Relacionados</h4>
              <div className="space-y-3">
                {service.equipment.map((equipment, index) => (
                  <div key={equipment.id || index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{equipment.name}</p>
                        <p className="text-sm text-gray-600">{equipment.brand} - {equipment.model}</p>
                        <p className="text-sm text-gray-500">Serie: {equipment.serialNumber}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        equipment.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {equipment.status === 'ACTIVE' ? 'Activo' : equipment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700 font-medium">Fecha de Creación</p>
                <p className="text-gray-900">{formatDate(service.createdAt)}</p>
              </div>
              {service.updatedAt && (
                <div>
                  <p className="text-gray-700 font-medium">Última Actualización</p>
                  <p className="text-gray-900">{formatDate(service.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de comentarios y evaluación */}
        {service.status === 'COMPLETED' && (
          <div className="border-t border-gray-200 pt-6 px-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Evaluación del servicio
                  </div>
                </h4>
                {service.technician && (
                  <p className="text-sm text-gray-600 mt-1">
                    Técnico: <span className="font-medium">{service.technician.name || `${service.technician.firstName || ''} ${service.technician.lastName || ''}`}</span>
                    {service.technician.specialty ? ` • ${service.technician.specialty}` : ''}
                  </p>
                )}
              </div>
              {service.clientRating ? (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < service.clientRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium text-gray-700">{service.clientRating.toFixed(1)}</span>
                </div>
              ) : canRate ? (
                <button 
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {showCommentForm ? 'Cancelar' : 'Añadir evaluación'}
                </button>
              ) : null}
            </div>
            
            {service.clientComment && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{service.clientComment}</p>
                <p className="text-sm text-gray-500 mt-2">Enviado el {formatDate(service.ratedAt)}</p>
              </div>
            )}
            
            {showCommentForm && canRate && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <form onSubmit={handleSubmitComment}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                    <div className="flex items-center gap-1">
                      {[5, 4, 3, 2, 1].map((value) => (
                        <button 
                          key={value} 
                          type="button"
                          onClick={() => setRating(value)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-6 w-6 ${value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-700">{rating}/5</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentario para el técnico
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Comparta su experiencia con el servicio..."
                      required
                    />
                  </div>
                  
                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                      {submitError}
                    </div>
                  )}
                  
                  {submitSuccess && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                      ¡Gracias por su evaluación!
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCommentForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !comment.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar evaluación'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;