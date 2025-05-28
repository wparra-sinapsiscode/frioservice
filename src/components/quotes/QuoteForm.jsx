import React, { useState, useEffect, useContext } from 'react';
import { FaTimes, FaUser, FaUserTie, FaCog, FaCheck, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { getClientDisplayName } from '../../utils/clientUtils';

const QuoteForm = ({ isOpen, onClose, onSave, editingQuote }) => {
  const { clients } = useContext(AppContext);
  const isEditing = !!editingQuote;

  // ============ ESTADO PRINCIPAL ============
  // Estados de selección en cascada
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');

  // Datos obtenidos dinámicamente
  const [assignedTechnicians, setAssignedTechnicians] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [servicesByTechnician, setServicesByTechnician] = useState({});

  // Estados de carga
  const [isLoadingClientData, setIsLoadingClientData] = useState(false);

  // Estados de auto-selección para feedback visual
  const [autoSelectedTechnician, setAutoSelectedTechnician] = useState(false);
  const [autoSelectedService, setAutoSelectedService] = useState(false);

  // Formulario principal
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    validUntil: '',
    notes: ''
  });

  const [error, setError] = useState('');

  // ============ EFECTOS ============
  
  // Cargar datos en modo edición
  useEffect(() => {
    if (isEditing && editingQuote) {
      setFormData({
        title: editingQuote.title || '',
        description: editingQuote.description || '',
        amount: editingQuote.amount || '',
        validUntil: editingQuote.validUntil ? editingQuote.validUntil.split('T')[0] : '',
        notes: editingQuote.notes || ''
      });
      setSelectedClientId(editingQuote.clientId || '');
      setSelectedTechnicianId(editingQuote.technicianId || '');
      setSelectedServiceId(editingQuote.serviceId || '');
    } else {
      // Reset para nueva cotización
      setFormData({
        title: '',
        description: '',
        amount: '',
        validUntil: '',
        notes: ''
      });
      setSelectedClientId('');
      setSelectedTechnicianId('');
      setSelectedServiceId('');
    }
  }, [editingQuote, isEditing, isOpen]);

  // Efecto principal: cuando cambia el cliente seleccionado
  useEffect(() => {
    if (!selectedClientId) {
      resetTechnicianAndServices();
      return;
    }
    fetchClientQuoteOptions(selectedClientId);
  }, [selectedClientId]);

  // Efecto: cuando cambia el técnico seleccionado
  useEffect(() => {
    if (!selectedTechnicianId || !servicesByTechnician[selectedTechnicianId]) {
      setAvailableServices([]);
      setSelectedServiceId('');
      return;
    }

    const servicesForTechnician = servicesByTechnician[selectedTechnicianId];
    setAvailableServices(servicesForTechnician);
    
    // Auto-selección si hay un solo servicio
    if (servicesForTechnician.length === 1) {
      setSelectedServiceId(servicesForTechnician[0].id);
      setAutoSelectedService(true);
      setTimeout(() => setAutoSelectedService(false), 2000);
    } else {
      setSelectedServiceId('');
      setAutoSelectedService(false);
    }
  }, [selectedTechnicianId, servicesByTechnician]);

  // ============ FUNCIONES DE API ============
  
  const fetchClientQuoteOptions = async (clientId) => {
    try {
      setIsLoadingClientData(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/clients/${clientId}/quote-options`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error cargando datos del cliente');
      }

      const { assignedTechnicians, servicesByTechnician } = data.data;
      
      setAssignedTechnicians(assignedTechnicians);
      setServicesByTechnician(servicesByTechnician);
      
      // Auto-selección si hay un solo técnico
      if (assignedTechnicians.length === 1) {
        setSelectedTechnicianId(assignedTechnicians[0].id);
        setAutoSelectedTechnician(true);
        setTimeout(() => setAutoSelectedTechnician(false), 2000);
      } else {
        setSelectedTechnicianId('');
        setAutoSelectedTechnician(false);
      }

    } catch (error) {
      console.error('Error fetching client quote options:', error);
      setError(error.message || 'Error cargando datos del cliente');
      setAssignedTechnicians([]);
      setServicesByTechnician({});
    } finally {
      setIsLoadingClientData(false);
    }
  };

  // ============ FUNCIONES AUXILIARES ============
  
  const resetTechnicianAndServices = () => {
    setAssignedTechnicians([]);
    setAvailableServices([]);
    setSelectedTechnicianId('');
    setSelectedServiceId('');
    setServicesByTechnician({});
    setAutoSelectedTechnician(false);
    setAutoSelectedService(false);
  };

  const handleClientChange = (clientId) => {
    setSelectedClientId(clientId);
    setError('');
  };

  const handleTechnicianChange = (technicianId) => {
    setSelectedTechnicianId(technicianId);
    setAutoSelectedTechnician(false);
  };

  const handleServiceChange = (serviceId) => {
    setSelectedServiceId(serviceId);
    setAutoSelectedService(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!selectedClientId) {
      setError('Debe seleccionar un cliente');
      return;
    }
    if (!selectedTechnicianId) {
      setError('Debe seleccionar un técnico');
      return;
    }
    if (!selectedServiceId) {
      setError('Debe seleccionar un servicio');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }
    if (!formData.validUntil) {
      setError('La fecha de validez es obligatoria');
      return;
    }

    // Validar fecha futura
    const validUntilDate = new Date(formData.validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (validUntilDate < today) {
      setError('La fecha de validez debe ser hoy o una fecha futura');
      return;
    }

    // Preparar datos finales
    const finalQuoteData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      clientId: selectedClientId,
      technicianId: selectedTechnicianId,
      serviceId: selectedServiceId,
      amount: parseFloat(formData.amount),
      validUntil: new Date(formData.validUntil).toISOString(),
      notes: formData.notes.trim() || undefined
    };

    onSave(finalQuoteData);
  };

  // ============ COMPONENTES DE UI ============
  
  const SkeletonSelect = () => (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-md"></div>
    </div>
  );

  const AutoSelectionBadge = ({ show, text }) => (
    show && (
      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 z-10">
        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center animate-pulse">
          <FaCheck size={10} className="mr-1" />
          {text}
        </div>
      </div>
    )
  );

  const InfoMessage = ({ type, message, icon: Icon }) => (
    <div className={`mt-2 p-3 rounded-md flex items-start space-x-2 text-sm ${
      type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
      type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
      'bg-blue-50 text-blue-700 border border-blue-200'
    }`}>
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );

  // Función para mostrar técnico(s)
  const renderTechnicianField = () => {
    if (!selectedClientId) {
      return (
        <div className="opacity-60">
          <input
            type="text"
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-400"
            placeholder="Primero seleccione un cliente"
          />
        </div>
      );
    }

    if (isLoadingClientData) {
      return <SkeletonSelect />;
    }

    if (assignedTechnicians.length === 0) {
      return (
        <div>
          <input
            type="text"
            disabled
            className="w-full px-3 py-2 border border-red-200 rounded-md bg-red-50 text-red-700"
            value="Sin técnicos asignados"
          />
          <InfoMessage 
            type="error" 
            message="Este cliente no tiene técnicos asignados" 
            icon={FaExclamationCircle} 
          />
        </div>
      );
    }

    if (assignedTechnicians.length === 1) {
      const technician = assignedTechnicians[0];
      return (
        <div className="relative">
          <input
            type="text"
            disabled
            className={`w-full px-3 py-2 border rounded-md bg-green-50 text-green-700 font-medium ${
              autoSelectedTechnician ? 'border-green-500 bg-green-100' : 'border-green-200'
            }`}
            value={`${technician.name} - ${technician.specialty}`}
          />
          <AutoSelectionBadge 
            show={autoSelectedTechnician} 
            text="Auto-asignado" 
          />
        </div>
      );
    }

    // Múltiples técnicos - mostrar dropdown
    return (
      <div className="relative">
        <select
          value={selectedTechnicianId}
          onChange={(e) => handleTechnicianChange(e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            autoSelectedTechnician ? 'border-green-500 bg-green-50' : ''
          }`}
          required
        >
          <option value="">Seleccionar técnico...</option>
          {assignedTechnicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.name} - {technician.specialty}
            </option>
          ))}
        </select>
        <AutoSelectionBadge 
          show={autoSelectedTechnician} 
          text="Auto-seleccionado" 
        />
      </div>
    );
  };

  // Función para mostrar servicio(s)
  const renderServiceField = () => {
    if (!selectedTechnicianId) {
      return (
        <div className="opacity-60">
          <input
            type="text"
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-400"
            placeholder="Primero seleccione un técnico"
          />
        </div>
      );
    }

    if (availableServices.length === 0) {
      return (
        <div>
          <input
            type="text"
            disabled
            className="w-full px-3 py-2 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-700"
            value="Sin servicios disponibles"
          />
          <InfoMessage 
            type="warning" 
            message="No hay servicios disponibles para esta combinación" 
            icon={FaInfoCircle} 
          />
        </div>
      );
    }

    if (availableServices.length === 1) {
      const service = availableServices[0];
      return (
        <div className="relative">
          <input
            type="text"
            disabled
            className={`w-full px-3 py-2 border rounded-md bg-green-50 text-green-700 font-medium ${
              autoSelectedService ? 'border-green-500 bg-green-100' : 'border-green-200'
            }`}
            value={`${service.title} (${service.type})`}
          />
          <AutoSelectionBadge 
            show={autoSelectedService} 
            text="Auto-seleccionado" 
          />
        </div>
      );
    }

    // Múltiples servicios - mostrar dropdown
    return (
      <div className="relative">
        <select
          value={selectedServiceId}
          onChange={(e) => handleServiceChange(e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            autoSelectedService ? 'border-green-500 bg-green-50' : ''
          }`}
          required
        >
          <option value="">Seleccionar servicio...</option>
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title} ({service.type})
            </option>
          ))}
        </select>
        <AutoSelectionBadge 
          show={autoSelectedService} 
          text="Auto-seleccionado" 
        />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Cotización' : 'Nueva Cotización'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Información Básica */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Información Básica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la Cotización *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Mantenimiento preventivo - Enero 2024"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descripción detallada del trabajo a realizar..."
                />
              </div>
            </div>
          </div>

          {/* Selección en Cascada */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Selección de Servicio</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Paso 1: Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-blue-600" />
                  1. Cliente *
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {getClientDisplayName(client)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Paso 2: Técnico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserTie className="inline mr-2 text-green-600" />
                  2. Técnico *
                </label>
                {renderTechnicianField()}
              </div>

              {/* Paso 3: Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCog className="inline mr-2 text-purple-600" />
                  3. Servicio *
                </label>
                {renderServiceField()}
              </div>
            </div>
          </div>

          {/* Detalles Finales */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la Cotización</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Total *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Válida Hasta *
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Términos y condiciones, descuentos, observaciones..."
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;