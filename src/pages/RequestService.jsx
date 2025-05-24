import React, { useState } from 'react';
import { FiCalendar, FiClock, FiPackage, FiMessageSquare, FiMapPin, FiAlertCircle } from 'react-icons/fi';

const RequestService = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    equipment: '',
    serviceType: '',
    description: '',
    preferredDate: '',
    preferredTimeSlot: '',
    urgency: 'normal',
    location: 'registrada',
    address: '',
  });
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');
  
  // Datos simulados de equipos registrados del cliente
  const registeredEquipment = [
    { id: 1, name: 'Refrigerador Industrial #103', type: 'Refrigerador Industrial', location: 'Almacén principal' },
    { id: 2, name: 'Congelador Vertical #201', type: 'Congelador Vertical', location: 'Área de alimentos' },
    { id: 3, name: 'Cámara de Refrigeración #305', type: 'Cámara Frigorífica', location: 'Bodega trasera' },
    { id: 4, name: 'Aire Acondicionado Central', type: 'Sistema HVAC', location: 'Edificio principal' },
    { id: 5, name: 'Minisplit 12,000 BTU (Oficina gerencia)', type: 'Aire Acondicionado', location: 'Oficina gerencia' },
  ];
  
  // Tipos de servicio disponibles
  const serviceTypes = [
    'Instalación',
    'Mantenimiento preventivo',
    'Mantenimiento correctivo',
    'Reparación',
    'Diagnóstico',
    'Consultoría',
  ];
  
  // Horarios disponibles
  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
  ];
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    
    if (!formData.equipment) newErrors.equipment = 'Seleccione un equipo';
    if (!formData.serviceType) newErrors.serviceType = 'Seleccione un tipo de servicio';
    if (!formData.description) newErrors.description = 'Ingrese una descripción del servicio';
    if (!formData.preferredDate) newErrors.preferredDate = 'Seleccione una fecha preferida';
    if (!formData.preferredTimeSlot) newErrors.preferredTimeSlot = 'Seleccione un horario preferido';
    if (formData.location === 'otra' && !formData.address) {
      newErrors.address = 'Ingrese la dirección para el servicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log('Formulario enviado:', formData);
      
      // Mostrar mensaje de éxito
      setSuccessMessage('¡Su solicitud de servicio ha sido enviada con éxito! Nos pondremos en contacto con usted pronto para confirmar los detalles.');
      
      // Resetear formulario
      setFormData({
        equipment: '',
        serviceType: '',
        description: '',
        preferredDate: '',
        preferredTimeSlot: '',
        urgency: 'normal',
        location: 'registrada',
        address: '',
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Solicitar Servicio</h1>
      
      {successMessage ? (
        <div className="bg-success/15 text-success p-4 rounded mb-6">
          <p>{successMessage}</p>
          <button 
            className="text-success underline mt-2"
            onClick={() => setSuccessMessage('')}
          >
            Realizar otra solicitud
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selección de equipo */}
            <div className="form-group">
              <label htmlFor="equipment">Equipo <span className="text-danger">*</span></label>
              <select
                id="equipment"
                name="equipment"
                className={`form-control ${errors.equipment ? 'border-danger' : ''}`}
                value={formData.equipment}
                onChange={handleChange}
              >
                <option value="">Seleccione un equipo</option>
                {registeredEquipment.map(equip => (
                  <option key={equip.id} value={equip.id}>
                    {equip.name}
                  </option>
                ))}
              </select>
              {errors.equipment && <p className="text-danger text-sm mt-1">{errors.equipment}</p>}
            </div>
            
            {/* Tipo de servicio */}
            <div className="form-group">
              <label htmlFor="serviceType">Tipo de Servicio <span className="text-danger">*</span></label>
              <select
                id="serviceType"
                name="serviceType"
                className={`form-control ${errors.serviceType ? 'border-danger' : ''}`}
                value={formData.serviceType}
                onChange={handleChange}
              >
                <option value="">Seleccione un tipo de servicio</option>
                {serviceTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.serviceType && <p className="text-danger text-sm mt-1">{errors.serviceType}</p>}
            </div>
          </div>
          
          {/* Descripción */}
          <div className="form-group mt-4">
            <label htmlFor="description">Descripción del Problema o Servicio <span className="text-danger">*</span></label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`form-control ${errors.description ? 'border-danger' : ''}`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describa el problema o servicio requerido con el mayor detalle posible..."
            ></textarea>
            {errors.description && <p className="text-danger text-sm mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Fecha preferida */}
            <div className="form-group">
              <label htmlFor="preferredDate">Fecha Preferida <span className="text-danger">*</span></label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray" />
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  className={`form-control pl-10 ${errors.preferredDate ? 'border-danger' : ''}`}
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.preferredDate && <p className="text-danger text-sm mt-1">{errors.preferredDate}</p>}
            </div>
            
            {/* Horario preferido */}
            <div className="form-group">
              <label htmlFor="preferredTimeSlot">Horario Preferido <span className="text-danger">*</span></label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-gray" />
                <select
                  id="preferredTimeSlot"
                  name="preferredTimeSlot"
                  className={`form-control pl-10 ${errors.preferredTimeSlot ? 'border-danger' : ''}`}
                  value={formData.preferredTimeSlot}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un horario</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              {errors.preferredTimeSlot && <p className="text-danger text-sm mt-1">{errors.preferredTimeSlot}</p>}
            </div>
          </div>
          
          {/* Urgencia */}
          <div className="form-group mt-4">
            <label>Nivel de Urgencia</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="baja"
                  checked={formData.urgency === 'baja'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Baja</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="normal"
                  checked={formData.urgency === 'normal'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Normal</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="alta"
                  checked={formData.urgency === 'alta'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Alta</span>
              </label>
            </div>
          </div>
          
          {/* Ubicación */}
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
                />
                <span>Otra dirección</span>
              </label>
            </div>
          </div>
          
          {/* Dirección alternativa (si se selecciona 'otra') */}
          {formData.location === 'otra' && (
            <div className="form-group mt-4">
              <label htmlFor="address">Dirección <span className="text-danger">*</span></label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`form-control pl-10 ${errors.address ? 'border-danger' : ''}`}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ingrese la dirección completa..."
                />
              </div>
              {errors.address && <p className="text-danger text-sm mt-1">{errors.address}</p>}
            </div>
          )}
          
          {/* Nota */}
          <div className="mt-6 flex items-start bg-info/10 p-4 rounded">
            <FiAlertCircle className="text-info mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Una vez enviada su solicitud, nuestro equipo revisará los detalles y se pondrá en contacto con usted
              para confirmar la visita técnica y proporcionar un presupuesto si es necesario.
            </p>
          </div>
          
          {/* Botones */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestService;