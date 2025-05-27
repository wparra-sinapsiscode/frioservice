import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus, FaCheck, FaClock, FaTools, FaStickyNote, FaSignature } from 'react-icons/fa';

const ServiceCompletionModal = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  service, 
  isLoading 
}) => {
  console.log('🔥 ServiceCompletionModal - Props:', { isOpen, service, isLoading });

  // Estado del formulario
  const [formData, setFormData] = useState({
    workPerformed: '',
    timeSpent: '',
    materialsUsed: [],
    technicianNotes: '',
    clientSignature: false
  });

  // Estados para UI
  const [newMaterial, setNewMaterial] = useState({ 
    name: '', 
    quantity: '', 
    unit: 'unidad', 
    cost: '' 
  });
  const [errors, setErrors] = useState({});

  // Resetear formulario cuando se abre/cierra el modal o cambia el servicio
  useEffect(() => {
    if (isOpen && service) {
      console.log('🔥 ServiceCompletionModal - Cargando datos del servicio:', service);
      
      // Si el servicio ya tiene datos de completion, cargarlos
      const materialsUsed = service.materialsUsed || [];
      
      setFormData({
        workPerformed: service.workPerformed || '',
        timeSpent: service.timeSpent || '',
        materialsUsed: Array.isArray(materialsUsed) ? materialsUsed : [],
        technicianNotes: service.technicianNotes || '',
        clientSignature: !!service.clientSignature
      });
      setErrors({});
    }
  }, [isOpen, service]);

  // Handlers para campos normales
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('🔥 ServiceCompletionModal - Campo cambiado:', { name, value, type });
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handlers para materiales
  const handleMaterialChange = (field, value) => {
    setNewMaterial(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMaterial = () => {
    console.log('🔥 ServiceCompletionModal - Agregando material:', newMaterial);
    
    if (!newMaterial.name.trim() || !newMaterial.quantity) {
      alert('Nombre y cantidad del material son obligatorios');
      return;
    }

    const material = {
      name: newMaterial.name.trim(),
      quantity: parseFloat(newMaterial.quantity),
      unit: newMaterial.unit || 'unidad',
      cost: newMaterial.cost ? parseFloat(newMaterial.cost) : 0
    };

    setFormData(prev => ({
      ...prev,
      materialsUsed: [...prev.materialsUsed, material]
    }));

    // Resetear formulario de material
    setNewMaterial({ name: '', quantity: '', unit: 'unidad', cost: '' });
  };

  const handleRemoveMaterial = (index) => {
    console.log('🔥 ServiceCompletionModal - Removiendo material en índice:', index);
    
    setFormData(prev => ({
      ...prev,
      materialsUsed: prev.materialsUsed.filter((_, i) => i !== index)
    }));
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    // Trabajo realizado es obligatorio
    if (!formData.workPerformed.trim()) {
      newErrors.workPerformed = 'El trabajo realizado es obligatorio';
    }

    // Tiempo gastado es obligatorio
    if (!formData.timeSpent || parseInt(formData.timeSpent) <= 0) {
      newErrors.timeSpent = 'El tiempo gastado debe ser mayor a 0 minutos';
    }

    // Validar que el tiempo no sea excesivo (más de 12 horas = 720 minutos)
    if (formData.timeSpent && parseInt(formData.timeSpent) > 720) {
      newErrors.timeSpent = 'El tiempo no puede ser mayor a 720 minutos (12 horas)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔥 ServiceCompletionModal - Enviando formulario de completar servicio');
    
    if (!validateForm()) {
      console.log('🔥 ServiceCompletionModal - Validación falló:', errors);
      return;
    }

    // Preparar datos para el backend (serviceId NO se incluye en el payload)
    const completionData = {
      workPerformed: formData.workPerformed.trim(),
      timeSpent: parseInt(formData.timeSpent),
      materialsUsed: formData.materialsUsed.map(material => ({
        ...material,
        quantity: parseFloat(material.quantity) || 0,
        cost: parseFloat(material.cost) || 0
      })),
      ...(formData.technicianNotes.trim() && { technicianNotes: formData.technicianNotes.trim() }),
      ...(formData.clientSignature && { clientSignature: 'confirmed' })
    };

    console.log('🔥 ServiceCompletionModal - Datos de completar servicio enviados:', completionData);
    onComplete(completionData);
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FaCheck className="text-green-600 text-xl" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Completar Servicio
              </h3>
              <p className="text-sm text-gray-600">
                {service?.title || 'Servicio sin título'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          
          {/* Información del servicio */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Información del Servicio</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Cliente:</strong> {service?.client?.name || service?.clientName || 'No especificado'}</p>
              <p><strong>Tipo:</strong> {service?.serviceType || service?.type || 'No especificado'}</p>
              <p><strong>Fecha:</strong> {service?.scheduledDate ? new Date(service.scheduledDate).toLocaleDateString() : 'No programada'}</p>
              {service?.description && <p><strong>Descripción:</strong> {service.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Columna Izquierda */}
            <div className="space-y-6">
              
              {/* Trabajo Realizado */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FaTools className="text-blue-600" />
                  <span>Trabajo Realizado *</span>
                </label>
                <textarea
                  name="workPerformed"
                  value={formData.workPerformed}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Describe detalladamente el trabajo que realizaste..."
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.workPerformed ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.workPerformed && (
                  <p className="text-red-500 text-sm mt-1">{errors.workPerformed}</p>
                )}
              </div>

              {/* Tiempo Gastado */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="text-green-600" />
                  <span>Tiempo Gastado (minutos) *</span>
                </label>
                <input
                  type="number"
                  name="timeSpent"
                  value={formData.timeSpent}
                  onChange={handleChange}
                  min="1"
                  max="720"
                  required
                  placeholder="90"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.timeSpent ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.timeSpent && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeSpent}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Máximo 720 minutos (12 horas)</p>
              </div>

              {/* Notas del Técnico */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FaStickyNote className="text-yellow-600" />
                  <span>Notas del Técnico</span>
                </label>
                <textarea
                  name="technicianNotes"
                  value={formData.technicianNotes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Observaciones, recomendaciones, problemas encontrados..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Confirmación del Cliente */}
              <div>
                <label className="flex items-center space-x-3">
                  <FaSignature className="text-purple-600" />
                  <input
                    type="checkbox"
                    name="clientSignature"
                    checked={formData.clientSignature}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Cliente confirmó y aceptó el servicio realizado
                  </span>
                </label>
              </div>

            </div>

            {/* Columna Derecha - Materiales */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                <FaTools className="text-orange-600" />
                <span>Materiales Utilizados</span>
              </label>

              {/* Lista de materiales agregados */}
              {formData.materialsUsed.length > 0 && (
                <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
                  {formData.materialsUsed.map((material, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{material.name}</div>
                        <div className="text-sm text-gray-600">
                          {material.quantity} {material.unit}
                          {material.cost > 0 && ` - $${material.cost.toLocaleString()}`}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar material"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar nuevo material */}
              <div className="border border-dashed border-gray-300 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Agregar Material</h5>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre del material"
                    value={newMaterial.name}
                    onChange={(e) => handleMaterialChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={newMaterial.quantity}
                      onChange={(e) => handleMaterialChange('quantity', e.target.value)}
                      min="0"
                      step="0.1"
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={newMaterial.unit}
                      onChange={(e) => handleMaterialChange('unit', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="unidad">Unidad</option>
                      <option value="metro">Metro</option>
                      <option value="litro">Litro</option>
                      <option value="kg">Kilogramo</option>
                      <option value="caja">Caja</option>
                      <option value="paquete">Paquete</option>
                      <option value="galón">Galón</option>
                      <option value="botella">Botella</option>
                    </select>
                  </div>
                  
                  <input
                    type="number"
                    placeholder="Costo (opcional)"
                    value={newMaterial.cost}
                    onChange={(e) => handleMaterialChange('cost', e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    disabled={!newMaterial.name.trim() || !newMaterial.quantity}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <FaPlus />
                    <span>Agregar Material</span>
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            )}
            <FaCheck />
            <span>Completar Servicio</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCompletionModal;