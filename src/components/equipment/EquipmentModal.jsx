import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';

const EquipmentModal = ({ isOpen, onClose, onSave, equipment }) => {
  console.log('🔥🔥🔥 EquipmentModal rendered:', { isOpen, equipment: !!equipment });
  
  const { clients } = useApp();
  const { user } = useAuth();
  const isEditing = !!equipment;

  // Estado inicial del formulario
  const getInitialState = () => {
    const baseState = {
      name: '',
      type: '',
      brand: '',
      model: '',
      serialNumber: '',
      location: '',
      installDate: '',
      warrantyExpiry: '',
      status: 'ACTIVE',
      notes: ''
    };
    
    // Solo incluir clientId si el usuario NO es CLIENT
    if (user?.role !== 'CLIENT') {
      baseState.clientId = '';
    }
    
    return baseState;
  };
  
  const [formData, setFormData] = useState(getInitialState());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llenar formulario en modo edición
  useEffect(() => {
    if (isEditing && equipment) {
      console.log('🔥🔥🔥 Loading equipment data for editing:', equipment);
      const editData = {
        name: equipment.name || '',
        type: equipment.type || '',
        brand: equipment.brand || '',
        model: equipment.model || '',
        serialNumber: equipment.serialNumber || '',
        location: equipment.location || '',
        installDate: equipment.installDate ? equipment.installDate.split('T')[0] : '',
        warrantyExpiry: equipment.warrantyExpiry ? equipment.warrantyExpiry.split('T')[0] : '',
        status: equipment.status || 'ACTIVE',
        notes: equipment.notes || ''
      };
      
      // Solo incluir clientId si el usuario NO es CLIENT
      if (user?.role !== 'CLIENT') {
        editData.clientId = equipment.clientId || '';
      }
      
      setFormData(editData);
    } else {
      setFormData(getInitialState());
    }
    setError('');
  }, [equipment, isEditing, isOpen, user?.role]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('🔥🔥🔥 Form field changed:', name, '=', value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validaciones del formulario
  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('El nombre del equipo es obligatorio');
    if (!formData.type.trim()) errors.push('El tipo de equipo es obligatorio');
    if (!formData.brand.trim()) errors.push('La marca es obligatoria');
    
    // Solo validar clientId si el usuario no es CLIENT (para CLIENTs se asigna automáticamente)
    if (user?.role !== 'CLIENT' && !formData.clientId) {
      errors.push('Debe seleccionar un cliente');
    }
    
    // Validar fecha de instalación no sea futura
    if (formData.installDate) {
      const installDate = new Date(formData.installDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (installDate > today) {
        errors.push('La fecha de instalación no puede ser futura');
      }
    }

    // Validar que fecha de garantía sea posterior a instalación
    if (formData.installDate && formData.warrantyExpiry) {
      const installDate = new Date(formData.installDate);
      const warrantyDate = new Date(formData.warrantyExpiry);
      if (warrantyDate <= installDate) {
        errors.push('La fecha de vencimiento de garantía debe ser posterior a la instalación');
      }
    }
    
    return errors;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    console.log('🔥🔥🔥 Equipment form submitted:', formData);

    // Validar formulario
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'));
      setIsSubmitting(false);
      return;
    }

    try {
      // Preparar datos para el backend
      const equipmentData = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim() || undefined,
        serialNumber: formData.serialNumber.trim() || undefined,
        // Solo incluir clientId si el usuario no es CLIENT (para CLIENTs se asigna automáticamente en backend)
        ...(user?.role !== 'CLIENT' && { clientId: formData.clientId }),
        location: formData.location.trim() || undefined,
        installDate: formData.installDate ? new Date(formData.installDate).toISOString() : undefined,
        warrantyExpiry: formData.warrantyExpiry ? new Date(formData.warrantyExpiry).toISOString() : undefined,
        status: formData.status,
        notes: formData.notes.trim() || undefined
      };

      console.log('🔥🔥🔥 Equipment data for backend:', equipmentData);
      await onSave(equipmentData);
      
    } catch (error) {
      console.error('🔥🔥🔥 Error saving equipment:', error);
      setError(error.message || 'Error al guardar el equipo');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar modal
  const handleClose = () => {
    if (!isSubmitting) {
      console.log('🔥🔥🔥 Closing equipment modal');
      setFormData(getInitialState());
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}
          </h3>
          <button 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Información Básica */}
          <fieldset className="border border-gray-300 rounded-md p-4 mb-6">
            <legend className="text-md font-semibold px-2 text-gray-700">Información Básica</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre del Equipo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Equipo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Refrigerador Industrial #103"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Tipo de Equipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Equipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Refrigerador Industrial">Refrigerador Industrial</option>
                  <option value="Congelador Vertical">Congelador Vertical</option>
                  <option value="Cámara Frigorífica">Cámara Frigorífica</option>
                  <option value="Aire Acondicionado">Aire Acondicionado</option>
                  <option value="Vitrina Refrigerada">Vitrina Refrigerada</option>
                  <option value="Enfriador de Agua">Enfriador de Agua</option>
                  <option value="Unidad Condensadora">Unidad Condensadora</option>
                  <option value="Sistema HVAC">Sistema HVAC</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              {/* Cliente - Solo visible para ADMIN y TECHNICIAN */}
              {user?.role !== 'CLIENT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={user?.role !== 'CLIENT'}
                    disabled={isSubmitting || isEditing} // No permitir cambiar cliente en edición
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.clientType === 'COMPANY' 
                          ? client.companyName 
                          : client.contactPerson || `${client.firstName || ''} ${client.lastName || ''}`.trim()
                        }
                      </option>
                    ))}
                  </select>
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">No se puede cambiar el cliente en modo edición</p>
                  )}
                </div>
              )}

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: FrioTech, Samsung, LG"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: RT-500, FR-340L"
                  disabled={isSubmitting}
                />
              </div>

              {/* Número de Serie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Serie
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: FT5089312"
                  disabled={isSubmitting}
                />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Almacén principal, Cocina, Sala de servidores"
                  disabled={isSubmitting}
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="ACTIVE">Operativo</option>
                  <option value="MAINTENANCE">Requiere Mantenimiento</option>
                  <option value="BROKEN">Fuera de Servicio</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Fechas y Garantía */}
          <fieldset className="border border-gray-300 rounded-md p-4 mb-6">
            <legend className="text-md font-semibold px-2 text-gray-700">Fechas y Garantía</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Instalación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Instalación
                </label>
                <input
                  type="date"
                  name="installDate"
                  value={formData.installDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                  disabled={isSubmitting}
                />
              </div>

              {/* Vencimiento de Garantía */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vencimiento de Garantía
                </label>
                <input
                  type="date"
                  name="warrantyExpiry"
                  value={formData.warrantyExpiry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={formData.installDate || undefined} // Debe ser posterior a instalación
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </fieldset>

          {/* Notas Adicionales */}
          <fieldset className="border border-gray-300 rounded-md p-4 mb-6">
            <legend className="text-md font-semibold px-2 text-gray-700">Información Adicional</legend>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas y Observaciones
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Especificaciones técnicas, observaciones, historial de reparaciones anteriores, etc."
                disabled={isSubmitting}
              />
            </div>
          </fieldset>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-700 text-sm whitespace-pre-line">{error}</div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              {isEditing ? 'Actualizar Equipo' : 'Guardar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;