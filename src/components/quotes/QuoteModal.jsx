import React, { useState, useEffect, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { getClientDisplayName } from '../../utils/clientUtils';

const QuoteModal = ({ isOpen, onClose, onSave, editingQuote }) => {
  const { clients } = useContext(AppContext);
  const isEditing = !!editingQuote;

  // 1. ESTADO INICIAL COMPLETO
  const initialState = {
    title: '',
    description: '',
    clientId: '',
    amount: '',
    validUntil: '',
    notes: '',
    serviceId: '' // Opcional - para futuro uso
  };

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');

  // 2. EFECTO PARA LLENAR EL FORMULARIO EN MODO EDICIÓN
  useEffect(() => {
    if (isEditing && editingQuote) {
      setFormData({
        title: editingQuote.title || '',
        description: editingQuote.description || '',
        clientId: editingQuote.clientId || '',
        amount: editingQuote.amount || '',
        validUntil: editingQuote.validUntil ? editingQuote.validUntil.split('T')[0] : '', // Convertir fecha ISO a YYYY-MM-DD
        notes: editingQuote.notes || '',
        serviceId: editingQuote.serviceId || ''
      });
    } else {
      setFormData(initialState);
    }
  }, [editingQuote, isEditing, isOpen]);

  // 3. MANEJADOR DE CAMBIOS GENÉRICO Y CORRECTO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 4. MANEJADOR DE ENVÍO QUE VALIDA Y PASA LOS DATOS
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    console.log('🔥🔥🔥 1. MODAL: Estado formData completo:', formData);

    // Validaciones básicas
    if (!formData.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!formData.clientId) {
      setError('Debe seleccionar un cliente.');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('El monto debe ser mayor a 0.');
      return;
    }
    if (!formData.validUntil) {
      setError('La fecha de validez es obligatoria.');
      return;
    }

    // Validar que la fecha de validez sea futura
    const validUntilDate = new Date(formData.validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    
    if (validUntilDate < today) {
      setError('La fecha de validez debe ser hoy o una fecha futura.');
      return;
    }

    if (isEditing) {
      // Para edición, enviar datos directos sin reestructurar
      const editPayload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        amount: parseFloat(formData.amount),
        validUntil: new Date(formData.validUntil).toISOString(),
        notes: formData.notes.trim() || undefined,
      };
      
      console.log('🔥🔥🔥 1. MODAL: Payload para EDICIÓN:', editPayload);
      onSave(editPayload);
    } else {
      // Para creación, usar estructura plana que espera el backend
      const createPayload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        clientId: formData.clientId,
        amount: parseFloat(formData.amount),
        validUntil: new Date(formData.validUntil).toISOString(),
        notes: formData.notes.trim() || undefined,
      };

      // Solo incluir serviceId si tiene valor
      if (formData.serviceId) {
        createPayload.serviceId = formData.serviceId;
      }
      
      console.log('🔥🔥🔥 1. MODAL: Payload para CREACIÓN:', createPayload);
      onSave(createPayload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{isEditing ? 'Editar Cotización' : 'Nueva Cotización'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* INFORMACIÓN BÁSICA */}
          <fieldset className="border p-4 rounded-md mb-4">
            <legend className="text-md font-semibold px-2">Información Básica</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="input w-full" 
                  required 
                  placeholder="Ej: Cotización mantenimiento preventivo"
                />
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select 
                  name="clientId" 
                  value={formData.clientId} 
                  onChange={handleChange} 
                  className="input w-full" 
                  required
                  disabled={isEditing} // No permitir cambiar cliente en edición
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {getClientDisplayName(client)}
                    </option>
                  ))}
                </select>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">No se puede cambiar el cliente en modo edición</p>
                )}
              </div>

              {/* Monto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto (S/) *</label>
                <input 
                  type="number" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleChange} 
                  className="input w-full" 
                  required 
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                />
              </div>

              {/* Fecha de Validez */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Válido Hasta *</label>
                <input 
                  type="date" 
                  name="validUntil" 
                  value={formData.validUntil} 
                  onChange={handleChange} 
                  className="input w-full" 
                  required
                  min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
                />
              </div>

              {/* Servicio (Opcional - para futuro) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Servicio (Opcional)</label>
                <input 
                  type="text" 
                  name="serviceId" 
                  value={formData.serviceId} 
                  onChange={handleChange} 
                  className="input w-full" 
                  placeholder="ID del servicio asociado"
                />
                <p className="text-xs text-gray-500 mt-1">Solo si está asociada a un servicio específico</p>
              </div>
            </div>
          </fieldset>

          {/* DETALLES */}
          <fieldset className="border p-4 rounded-md mb-4">
            <legend className="text-md font-semibold px-2">Detalles</legend>
            <div className="space-y-4">
              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="input w-full" 
                  rows="3"
                  placeholder="Describe el trabajo a realizar, equipos involucrados, etc."
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  className="input w-full" 
                  rows="2"
                  placeholder="Observaciones, condiciones especiales, etc."
                />
              </div>
            </div>
          </fieldset>

          {/* Mostrar error si existe */}
          {error && <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded">{error}</p>}

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;