import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useApp } from '../../hooks/useApp';
import { getClientDisplayName } from '../../utils/clientUtils';

const ServiceModal = ({ onSave, onClose, editingService, clients, technicians, isLoading }) => {
  console.log('🔥🔥🔥 1. SERVICE MODAL: Iniciando modal', { editingService: !!editingService });

  // Obtener equipos del contexto
  const { equipment, fetchEquipment } = useApp();

  // Estado del formulario principal
  const [formData, setFormData] = useState({
    // SECCIÓN 1: Información Básica
    title: '',
    description: '',
    type: 'MAINTENANCE',
    priority: 'MEDIUM',
    clientId: '',
    scheduledDate: '',

    // SECCIÓN 2: Ubicación y Contacto
    address: '',
    contactPhone: '',
    emergencyContact: '',
    accessInstructions: '',

    // SECCIÓN 3: Asignación
    technicianId: '',
    equipmentIds: [],
    estimatedDuration: '',

    // SECCIÓN 4: Completar Servicio (solo en edición)
    workPerformed: '',
    timeSpent: '',
    materialsUsed: [],
    technicianNotes: '',
    clientSignature: false
  });

  // Estados para UI
  const [selectedClientEquipment, setSelectedClientEquipment] = useState([]);
  const [showCompletionSection, setShowCompletionSection] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', unit: '', cost: '' });

  console.log('🔥🔥🔥 2. SERVICE MODAL: Estado inicial', {
    formData: formData,
    clientsCount: clients?.length || 0,
    techniciansCount: technicians?.length || 0,
    equipmentCount: equipment?.length || 0
  });

  // Cargar datos del servicio en edición
  useEffect(() => {
    console.log('🔥🔥🔥 3. SERVICE MODAL: useEffect editingService', { editingService });
    
    if (editingService) {
      // Convertir scheduledDate de DateTime a input datetime-local
      const scheduledDate = editingService.scheduledDate 
        ? new Date(editingService.scheduledDate).toISOString().slice(0, 16)
        : '';

      // Parsear materialsUsed si es string JSON
      let materialsUsed = [];
      if (editingService.materialsUsed) {
        try {
          materialsUsed = typeof editingService.materialsUsed === 'string' 
            ? JSON.parse(editingService.materialsUsed)
            : editingService.materialsUsed;
        } catch (e) {
          console.error('Error parseando materialsUsed:', e);
          materialsUsed = [];
        }
      }

      const updatedFormData = {
        // SECCIÓN 1: Información Básica
        title: editingService.title || '',
        description: editingService.description || '',
        type: editingService.type || 'MAINTENANCE',
        priority: editingService.priority || 'MEDIUM',
        clientId: editingService.clientId || '',
        scheduledDate: scheduledDate,

        // SECCIÓN 2: Ubicación y Contacto
        address: editingService.address || '',
        contactPhone: editingService.contactPhone || '',
        emergencyContact: editingService.emergencyContact || '',
        accessInstructions: editingService.accessInstructions || '',

        // SECCIÓN 3: Asignación
        technicianId: editingService.technicianId || '',
        equipmentIds: editingService.equipmentIds || [],
        estimatedDuration: editingService.estimatedDuration || '',

        // SECCIÓN 4: Completar Servicio
        workPerformed: editingService.workPerformed || '',
        timeSpent: editingService.timeSpent || '',
        materialsUsed: materialsUsed,
        technicianNotes: editingService.technicianNotes || '',
        clientSignature: !!editingService.clientSignature
      };

      console.log('🔥🔥🔥 4. SERVICE MODAL: Datos cargados para edición:', updatedFormData);
      setFormData(updatedFormData);

      // Mostrar sección de completar si el servicio no está completado
      setShowCompletionSection(editingService.status !== 'COMPLETED');
    }
  }, [editingService]);

  // Cargar equipos del cliente seleccionado
  useEffect(() => {
    console.log('🔥🔥🔥 5. SERVICE MODAL: Cliente cambió, cargando equipos', { clientId: formData.clientId });
    
    if (formData.clientId && fetchEquipment) {
      fetchEquipment({ clientId: formData.clientId });
    }
  }, [formData.clientId, fetchEquipment]);

  // Filtrar equipos por cliente
  useEffect(() => {
    if (equipment && formData.clientId) {
      const clientEquipment = equipment.filter(eq => eq.clientId === formData.clientId);
      console.log('🔥🔥🔥 6. SERVICE MODAL: Equipos del cliente filtrados:', clientEquipment);
      setSelectedClientEquipment(clientEquipment);
    } else {
      setSelectedClientEquipment([]);
    }
  }, [equipment, formData.clientId]);

  // Handlers para campos normales
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log('🔥🔥🔥 7. SERVICE MODAL: Campo cambiado:', { name, value, type });
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler para equipmentIds (multi-select)
  const handleEquipmentChange = (equipmentId) => {
    console.log('🔥🔥🔥 8. SERVICE MODAL: Cambiando equipo:', equipmentId);
    
    setFormData(prev => {
      const newEquipmentIds = prev.equipmentIds.includes(equipmentId)
        ? prev.equipmentIds.filter(id => id !== equipmentId)
        : [...prev.equipmentIds, equipmentId];
      
      console.log('🔥🔥🔥 9. SERVICE MODAL: Nuevos equipmentIds:', newEquipmentIds);
      return { ...prev, equipmentIds: newEquipmentIds };
    });
  };

  // Handlers para materiales
  const handleAddMaterial = () => {
    console.log('🔥🔥🔥 10. SERVICE MODAL: Agregando material:', newMaterial);
    
    if (newMaterial.name && newMaterial.quantity) {
      setFormData(prev => ({
        ...prev,
        materialsUsed: [...prev.materialsUsed, { ...newMaterial }]
      }));
      setNewMaterial({ name: '', quantity: '', unit: '', cost: '' });
    }
  };

  const handleRemoveMaterial = (index) => {
    console.log('🔥🔥🔥 11. SERVICE MODAL: Removiendo material en índice:', index);
    
    setFormData(prev => ({
      ...prev,
      materialsUsed: prev.materialsUsed.filter((_, i) => i !== index)
    }));
  };

  // Validaciones
  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Título es obligatorio');
    if (!formData.clientId) errors.push('Cliente es obligatorio');
    if (!formData.scheduledDate) errors.push('Fecha programada es obligatoria');
    if (!formData.address.trim()) errors.push('Dirección es obligatoria');
    if (!formData.contactPhone.trim()) errors.push('Teléfono de contacto es obligatorio');
    
    // Validar duración estimada
    if (formData.estimatedDuration && parseInt(formData.estimatedDuration) < 15) {
      errors.push('La duración estimada debe ser mínimo 15 minutos');
    }
    
    if (errors.length > 0) {
      alert('Errores de validación:\n' + errors.join('\n'));
      return false;
    }
    
    return true;
  };

  // Submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔥🔥🔥 12. SERVICE MODAL: Enviando formulario');
    
    if (!validateForm()) {
      console.log('🔥🔥🔥 13. SERVICE MODAL: Validación falló');
      return;
    }

    // Preparar datos para el backend
    const serviceData = {
      title: formData.title,
      description: formData.description || null,
      type: formData.type,
      priority: formData.priority,
      clientId: formData.clientId,
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
      address: formData.address,
      contactPhone: formData.contactPhone,
      emergencyContact: formData.emergencyContact || null,
      accessInstructions: formData.accessInstructions || '',
      technicianId: formData.technicianId || null,
      equipmentIds: formData.equipmentIds,
      estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : null,
    };

    // Agregar campos de completar servicio si están presentes
    if (showCompletionSection && editingService) {
      if (formData.workPerformed) serviceData.workPerformed = formData.workPerformed;
      if (formData.timeSpent) serviceData.timeSpent = parseInt(formData.timeSpent);
      if (formData.materialsUsed.length > 0) serviceData.materialsUsed = formData.materialsUsed;
      if (formData.technicianNotes) serviceData.technicianNotes = formData.technicianNotes;
      if (formData.clientSignature) serviceData.clientSignature = 'confirmed';
    }

    console.log('🔥🔥🔥 14. SERVICE MODAL: Datos enviados al backend:', serviceData);
    onSave(serviceData);
  };

  console.log('🔥🔥🔥 15. SERVICE MODAL: Renderizando componente');

  return (
    <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
      {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
          📝 Información Básica
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del Servicio *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ej: Mantenimiento preventivo aire acondicionado"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="REPAIR">Reparación</option>
              <option value="INSTALLATION">Instalación</option>
              <option value="INSPECTION">Inspección</option>
              <option value="EMERGENCY">Emergencia</option>
              <option value="CLEANING">Limpieza</option>
              <option value="CONSULTATION">Consultoría</option>
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente *
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar cliente</option>
              {clients?.map((client) => (
                <option key={client.id} value={client.id}>
                  {getClientDisplayName(client)}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha programada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora Programada *
            </label>
            <input
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe el servicio a realizar..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: UBICACIÓN Y CONTACTO */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
          📍 Ubicación y Contacto
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Dirección completa del servicio"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Teléfono de contacto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de Contacto *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              placeholder="+57 300 123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Contacto de emergencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contacto de Emergencia
            </label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="+57 301 123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Instrucciones de acceso */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrucciones de Acceso
            </label>
            <textarea
              name="accessInstructions"
              value={formData.accessInstructions}
              onChange={handleChange}
              rows="2"
              placeholder="Instrucciones para llegar al lugar, códigos, etc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: ASIGNACIÓN */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
          👨‍🔧 Asignación
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Técnico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Técnico Asignado
            </label>
            <select
              name="technicianId"
              value={formData.technicianId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sin asignar</option>
              {technicians?.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.firstName} {technician.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Duración estimada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración Estimada (minutos)
            </label>
            <input
              type="number"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              min="15"
              placeholder="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Mínimo 15 minutos</p>
          </div>

          {/* Equipos del cliente */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipos a Atender
            </label>
            
            {selectedClientEquipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {selectedClientEquipment.map((equipment) => (
                  <label key={equipment.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.equipmentIds.includes(equipment.id)}
                      onChange={() => handleEquipmentChange(equipment.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {equipment.name} - {equipment.model} ({equipment.brand})
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm py-2">
                {formData.clientId 
                  ? 'Este cliente no tiene equipos registrados'
                  : 'Selecciona un cliente para ver sus equipos'
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: COMPLETAR SERVICIO (Solo en edición) */}
      {editingService && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              ✅ Completar Servicio
            </h4>
            <button
              type="button"
              onClick={() => setShowCompletionSection(!showCompletionSection)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showCompletionSection ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showCompletionSection && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trabajo realizado */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trabajo Realizado
                  </label>
                  <textarea
                    name="workPerformed"
                    value={formData.workPerformed}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe el trabajo que se realizó..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tiempo gastado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo Gastado (minutos)
                  </label>
                  <input
                    type="number"
                    name="timeSpent"
                    value={formData.timeSpent}
                    onChange={handleChange}
                    min="0"
                    placeholder="90"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Firma del cliente */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="clientSignature"
                      checked={formData.clientSignature}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Cliente confirmó el servicio
                    </span>
                  </label>
                </div>

                {/* Materiales utilizados */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Materiales Utilizados
                  </label>
                  
                  {/* Lista de materiales */}
                  {formData.materialsUsed.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {formData.materialsUsed.map((material, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm">
                            {material.name} - {material.quantity} {material.unit} 
                            {material.cost && ` - $${material.cost}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Agregar nuevo material */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Material"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={newMaterial.quantity}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, quantity: e.target.value }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Unidad"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, unit: e.target.value }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Costo"
                      value={newMaterial.cost}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, cost: e.target.value }))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FaPlus /> <span>Agregar Material</span>
                  </button>
                </div>

                {/* Notas del técnico */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas del Técnico
                  </label>
                  <textarea
                    name="technicianNotes"
                    value={formData.technicianNotes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Notas adicionales del técnico..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOTONES */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
          <span>
            {editingService ? 'Actualizar Servicio' : 'Crear Servicio'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default ServiceModal;