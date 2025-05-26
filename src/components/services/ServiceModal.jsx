import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getClientDisplayName } from '../../utils/clientUtils';

const ServiceModal = ({ onSave, onClose, editingService, clients, technicians }) => {
  const [formData, setFormData] = useState({
    client: '',
    type: 'Programado',
    equipment: [''],
    description: '',
    technician: '',
    date: '',
    time: '',
    status: 'pendiente'
  });

  useEffect(() => {
    if (editingService) {
      setFormData({
        client: editingService.client || '',
        type: editingService.type || 'Programado',
        equipment: editingService.equipment?.length > 0 ? editingService.equipment : [''],
        description: editingService.description || '',
        technician: editingService.technician || '',
        date: editingService.date || '',
        time: editingService.time || '',
        status: editingService.status || 'pendiente'
      });
    }
  }, [editingService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddEquipment = () => {
    setFormData({
      ...formData,
      equipment: [...formData.equipment, ''],
    });
  };

  const handleEquipmentChange = (index, value) => {
    const updatedEquipment = [...formData.equipment];
    updatedEquipment[index] = value;
    setFormData({
      ...formData,
      equipment: updatedEquipment,
    });
  };

  const handleRemoveEquipment = (index) => {
    const updatedEquipment = formData.equipment.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      equipment: updatedEquipment,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredEquipment = formData.equipment.filter(eq => eq.trim() !== '');
    
    const serviceData = {
      ...formData,
      equipment: filteredEquipment,
    };
    
    onSave(serviceData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Cliente *</label>
          <select 
            name="client" 
            value={formData.client}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          >
            <option value="">Seleccionar cliente</option>
            {clients && clients.map((client) => (
              <option key={client.id} value={getClientDisplayName(client)}>
                {getClientDisplayName(client)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Tipo de servicio */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Tipo de Servicio *</label>
          <select 
            name="type" 
            value={formData.type}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          >
            <option value="Programado">Programado</option>
            <option value="Correctivo">Correctivo</option>
            <option value="Emergencia">Emergencia</option>
          </select>
        </div>
        
        {/* Técnico */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Técnico *</label>
          <select 
            name="technician" 
            value={formData.technician}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          >
            <option value="">Seleccionar técnico</option>
            {technicians && technicians.map((tech) => (
              <option key={tech.id} value={tech.name}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Estado *</label>
          <select 
            name="status" 
            value={formData.status}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en-progreso">En Progreso</option>
            <option value="completado">Completado</option>
          </select>
        </div>
        
        {/* Fecha */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Fecha *</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        {/* Hora */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Hora *</label>
          <input 
            type="time" 
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      
      {/* Equipos */}
      <div className="mt-6">
        <label className="text-sm text-gray-600 mb-1">Equipos *</label>
        {formData.equipment.map((equipment, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input 
              type="text" 
              value={equipment}
              onChange={(e) => handleEquipmentChange(index, e.target.value)}
              placeholder="Nombre/modelo del equipo"
              required
              className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none flex-1"
            />
            {formData.equipment.length > 1 && (
              <button 
                type="button"
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600" 
                onClick={() => handleRemoveEquipment(index)}
              >
                <FaTimes />
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          onClick={handleAddEquipment}
        >
          + Agregar otro equipo
        </button>
      </div>
      
      {/* Descripción */}
      <div className="mt-6">
        <label className="text-sm text-gray-600 mb-1">Descripción</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describa brevemente el servicio a realizar..."
          className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none w-full"
        ></textarea>
      </div>
      
      {/* Botones */}
      <div className="mt-8 flex justify-end gap-3">
        <button 
          type="button" 
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editingService ? 'Actualizar Servicio' : 'Guardar Servicio'}
        </button>
      </div>
    </form>
  );
};

export default ServiceModal;