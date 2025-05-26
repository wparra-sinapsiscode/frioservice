import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiPackage, FiMessageSquare, FiMapPin, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';

const RequestService = () => {
  // Hooks para datos del contexto
  const { equipment, isLoadingEquipment, addService } = useApp();
  const { user } = useAuth();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    equipmentIds: [], // Cambio a array para selección múltiple
    serviceType: '',
    description: '',
    preferredDate: '',
    preferredTimeSlot: '',
    priority: 'MEDIUM', // Mapeo a formato backend
    location: 'registrada',
    address: '',
    contactPhone: '',
    emergencyContact: '',
    accessInstructions: '',
    estimatedDuration: ''
  });
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');
  
  // Estado para loading de envío
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tipos de servicio mapeados al formato del backend
  const serviceTypes = [
    { value: 'MAINTENANCE', label: 'Mantenimiento preventivo' },
    { value: 'REPAIR', label: 'Reparación' },
    { value: 'INSTALLATION', label: 'Instalación' },
    { value: 'INSPECTION', label: 'Inspección/Diagnóstico' },
    { value: 'EMERGENCY', label: 'Emergencia' },
    { value: 'CLEANING', label: 'Limpieza especializada' },
    { value: 'CONSULTATION', label: 'Consultoría' }
  ];

  // Niveles de prioridad
  const priorityLevels = [
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Normal' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'URGENT', label: 'Urgente' }
  ];
  
  // Horarios disponibles
  const timeSlots = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00'
  ];

  // Obtener información del cliente para prellenar datos
  useEffect(() => {
    if (user?.profile) {
      setFormData(prev => ({
        ...prev,
        contactPhone: user.profile.phone || '',
        emergencyContact: user.profile.emergencyContact || '',
        address: user.profile.address || ''
      }));
    }
  }, [user]);
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'equipmentIds') {
      // Manejar selección múltiple de equipos
      const equipmentId = value;
      setFormData(prev => ({
        ...prev,
        equipmentIds: checked 
          ? [...prev.equipmentIds, equipmentId]
          : prev.equipmentIds.filter(id => id !== equipmentId)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error para este campo si existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.equipmentIds.length === 0) {
      newErrors.equipmentIds = 'Seleccione al menos un equipo';
    }
    if (!formData.serviceType) {
      newErrors.serviceType = 'Seleccione un tipo de servicio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Ingrese una descripción del problema o servicio';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Seleccione una fecha preferida';
    }
    if (!formData.preferredTimeSlot) {
      newErrors.preferredTimeSlot = 'Seleccione un horario preferido';
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Ingrese un teléfono de contacto';
    }
    if (formData.location === 'otra' && !formData.address.trim()) {
      newErrors.address = 'Ingrese la dirección para el servicio';
    }
    if (formData.location === 'registrada' && !user?.profile?.address) {
      newErrors.address = 'No tiene una dirección registrada. Seleccione "Otra dirección" e ingrese una.';
    }

    // Validar fecha no sea pasada
    if (formData.preferredDate) {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = 'La fecha no puede ser anterior a hoy';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Preparar datos para el backend según el esquema esperado
      const [startTime, endTime] = formData.preferredTimeSlot.split('-');
      const scheduledDateTime = new Date(`${formData.preferredDate}T${startTime}:00`);
      
      const serviceData = {
        title: `Solicitud de ${serviceTypes.find(t => t.value === formData.serviceType)?.label}`,
        description: formData.description.trim(),
        type: formData.serviceType,
        priority: formData.priority,
        scheduledDate: scheduledDateTime.toISOString(),
        estimatedDuration: parseInt(formData.estimatedDuration) || 120, // 2 horas por defecto
        equipmentIds: formData.equipmentIds,
        address: formData.location === 'registrada' 
          ? user?.profile?.address 
          : formData.address.trim(),
        contactPhone: formData.contactPhone.trim(),
        emergencyContact: formData.emergencyContact.trim() || undefined,
        accessInstructions: formData.accessInstructions.trim() || undefined,
        clientNotes: `Horario preferido: ${formData.preferredTimeSlot}. ${formData.description.trim()}`
      };

      console.log('🔥🔥🔥 Enviando solicitud de servicio:', serviceData);
      
      const result = await addService(serviceData);
      
      // Mostrar mensaje de éxito
      setSuccessMessage(
        `¡Su solicitud de servicio ha sido enviada con éxito! 
        
        📋 **Número de referencia:** ${result.id}
        📅 **Fecha programada:** ${new Date(scheduledDateTime).toLocaleDateString()}
        ⏰ **Horario:** ${formData.preferredTimeSlot}
        🔧 **Equipos:** ${formData.equipmentIds.length} seleccionado(s)
        
        Nos pondremos en contacto con usted pronto para confirmar los detalles y asignar un técnico.`
      );
      
      // Resetear formulario
      setFormData({
        equipmentIds: [],
        serviceType: '',
        description: '',
        preferredDate: '',
        preferredTimeSlot: '',
        priority: 'MEDIUM',
        location: 'registrada',
        address: '',
        contactPhone: user?.profile?.phone || '',
        emergencyContact: user?.profile?.emergencyContact || '',
        accessInstructions: '',
        estimatedDuration: ''
      });
      
    } catch (error) {
      console.error('❌ Error al enviar solicitud:', error);
      setErrors({ 
        submit: `Error al enviar la solicitud: ${error.message}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener equipos seleccionados para mostrar resumen
  const selectedEquipment = equipment.filter(eq => formData.equipmentIds.includes(eq.id));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Solicitar Servicio Técnico</h1>
      
      {successMessage ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg mb-6">
          <div className="flex items-start">
            <FiCheck className="text-green-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold mb-2">¡Solicitud Enviada!</h3>
              <div className="whitespace-pre-line text-sm">{successMessage}</div>
              <button 
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                onClick={() => setSuccessMessage('')}
              >
                Realizar otra solicitud
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          
          {/* Sección de Equipos */}
          <fieldset className="border border-gray-300 rounded-md p-4 mb-6">
            <legend className="text-md font-semibold px-2 text-gray-700">
              <FiPackage className="inline mr-2" />
              Equipos para el Servicio
            </legend>
            
            {isLoadingEquipment ? (
              <div className="text-center py-4">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando sus equipos...</p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FiAlertCircle className="mx-auto mb-2" size={24} />
                <p>No tiene equipos registrados.</p>
                <p className="text-sm">Debe registrar equipos antes de solicitar servicios.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  Seleccione los equipos que requieren servicio (puede seleccionar múltiples):
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded p-3">
                  {equipment.map((eq) => (
                    <label key={eq.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        name="equipmentIds"
                        value={eq.id}
                        checked={formData.equipmentIds.includes(eq.id)}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{eq.name}</div>
                        <div className="text-sm text-gray-500">
                          {eq.type} • {eq.brand} {eq.model && `• ${eq.model}`}
                        </div>
                        {eq.location && (
                          <div className="text-xs text-gray-400">📍 {eq.location}</div>
                        )}
                        <div className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                          eq.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          eq.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                          eq.status === 'BROKEN' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {eq.status === 'ACTIVE' ? 'Operativo' :
                           eq.status === 'MAINTENANCE' ? 'En Mantenimiento' :
                           eq.status === 'BROKEN' ? 'Fuera de Servicio' : 'Inactivo'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Resumen de equipos seleccionados */}
                {selectedEquipment.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Equipos seleccionados ({selectedEquipment.length}):
                    </p>
                    <div className="text-sm text-blue-700">
                      {selectedEquipment.map(eq => eq.name).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {errors.equipmentIds && (
              <p className="text-red-600 text-sm mt-2">{errors.equipmentIds}</p>
            )}
          </fieldset>

          {/* Información del Servicio */}
          <fieldset className="border border-gray-300 rounded-md p-4 mb-6">
            <legend className="text-md font-semibold px-2 text-gray-700">
              <FiMessageSquare className="inline mr-2" />
              Detalles del Servicio
            </legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de servicio */}
              <div className="form-group">
                <label htmlFor="serviceType">
                  Tipo de Servicio <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  className={`form-control ${errors.serviceType ? 'border-red-500' : ''}`}
                  value={formData.serviceType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccione un tipo de servicio</option>
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="text-red-600 text-sm mt-1">{errors.serviceType}</p>
                )}
              </div>

              {/* Prioridad */}
              <div className="form-group">
                <label htmlFor="priority">Nivel de Prioridad</label>
                <select
                  id="priority"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  {priorityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Descripción */}
            <div className="form-group mt-4">
              <label htmlFor="description">
                Descripción del Problema o Servicio <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className={`form-control ${errors.description ? 'border-red-500' : ''}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describa el problema, síntomas, o servicio requerido con el mayor detalle posible..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Duración estimada */}
            <div className="form-group mt-4">
              <label htmlFor="estimatedDuration">Duración Estimada (minutos)</label>
              <select
                id="estimatedDuration"
                name="estimatedDuration"
                className="form-control"
                value={formData.estimatedDuration}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Seleccione duración estimada</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="180">3 horas</option>
                <option value="240">4 horas</option>
                <option value="360">6 horas</option>
                <option value="480">8 horas</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Opcional. Ayuda a planificar mejor la visita técnica.
              </p>
            </div>
          </fieldset>

          {/* Programación */}
          <fieldset className="border border-gray-300 rounded-md p-4 mb-6">
            <legend className="text-md font-semibold px-2 text-gray-700">
              <FiCalendar className="inline mr-2" />
              Programación Preferida
            </legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha preferida */}
              <div className="form-group">
                <label htmlFor="preferredDate">
                  Fecha Preferida <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    className={`form-control pl-10 ${errors.preferredDate ? 'border-red-500' : ''}`}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.preferredDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.preferredDate}</p>
                )}
              </div>
              
              {/* Horario preferido */}
              <div className="form-group">
                <label htmlFor="preferredTimeSlot">
                  Horario Preferido <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-3 text-gray-400" />
                  <select
                    id="preferredTimeSlot"
                    name="preferredTimeSlot"
                    className={`form-control pl-10 ${errors.preferredTimeSlot ? 'border-red-500' : ''}`}
                    value={formData.preferredTimeSlot}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Seleccione un horario</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.preferredTimeSlot && (
                  <p className="text-red-600 text-sm mt-1">{errors.preferredTimeSlot}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Información de Contacto y Ubicación */}
          <fieldset className="border border-gray-300 rounded-md p-4 mb-6">
            <legend className="text-md font-semibold px-2 text-gray-700">
              <FiMapPin className="inline mr-2" />
              Contacto y Ubicación
            </legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono de contacto */}
              <div className="form-group">
                <label htmlFor="contactPhone">
                  Teléfono de Contacto <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  className={`form-control ${errors.contactPhone ? 'border-red-500' : ''}`}
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Ej: +51 999 123 456"
                  disabled={isSubmitting}
                />
                {errors.contactPhone && (
                  <p className="text-red-600 text-sm mt-1">{errors.contactPhone}</p>
                )}
              </div>

              {/* Contacto de emergencia */}
              <div className="form-group">
                <label htmlFor="emergencyContact">Contacto de Emergencia</label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  className="form-control"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Ej: +51 999 654 321"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Ubicación del servicio */}
            <div className="form-group mt-4">
              <label>Ubicación del Servicio</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="location"
                    value="registrada"
                    checked={formData.location === 'registrada'}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={isSubmitting}
                  />
                  <span>Dirección registrada</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="location"
                    value="otra"
                    checked={formData.location === 'otra'}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={isSubmitting}
                  />
                  <span>Otra dirección</span>
                </label>
              </div>
            </div>
            
            {/* Dirección registrada o alternativa */}
            {formData.location === 'registrada' ? (
              <div className="form-group mt-4">
                <label>Dirección Registrada</label>
                <div className="p-3 bg-gray-50 border rounded text-gray-700">
                  {user?.profile?.address || 'No hay dirección registrada en su perfil'}
                </div>
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            ) : (
              <div className="form-group mt-4">
                <label htmlFor="address">
                  Dirección del Servicio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`form-control pl-10 ${errors.address ? 'border-red-500' : ''}`}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ingrese la dirección completa donde se realizará el servicio"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            )}

            {/* Instrucciones de acceso */}
            <div className="form-group mt-4">
              <label htmlFor="accessInstructions">Instrucciones de Acceso</label>
              <textarea
                id="accessInstructions"
                name="accessInstructions"
                rows="3"
                className="form-control"
                value={formData.accessInstructions}
                onChange={handleChange}
                placeholder="Ej: Tocar timbre, preguntar por portería, código de acceso, horarios de disponibilidad, etc."
                disabled={isSubmitting}
              />
            </div>
          </fieldset>
          
          {/* Error de envío */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Nota informativa */}
          <div className="mt-6 flex items-start bg-blue-50 p-4 rounded border border-blue-200">
            <FiAlertCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Importante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Una vez enviada su solicitud, recibirá una confirmación y nuestro equipo se pondrá en contacto con usted.</li>
                <li>Se le asignará un técnico especializado según el tipo de equipo y servicio solicitado.</li>
                <li>El horario final puede variar según disponibilidad del técnico y urgencia del caso.</li>
                <li>Para servicios de emergencia, será contactado dentro de las próximas 2 horas.</li>
              </ul>
            </div>
          </div>
          
          {/* Botones */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting || equipment.length === 0}
            >
              {isSubmitting && (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestService;