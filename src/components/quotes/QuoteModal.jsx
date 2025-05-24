import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const QuoteModal = ({ isOpen, onClose, onSave, clients, technicians, editingQuote }) => {
  const [formData, setFormData] = useState({
    client: '',
    type: 'Programado',
    equipment: [''],
    description: '',
    technician: '',
    amount: '',
  });

  // Efecto para cargar datos cuando se edita
  React.useEffect(() => {
    if (editingQuote) {
      setFormData({
        client: editingQuote.client || '',
        type: editingQuote.type || 'Programado',
        equipment: editingQuote.equipment?.length > 0 ? editingQuote.equipment : [''],
        description: editingQuote.description || '',
        technician: editingQuote.technician || '',
        amount: editingQuote.amount?.replace('S/ ', '') || '',
      });
    } else {
      setFormData({
        client: '',
        type: 'Programado',
        equipment: [''],
        description: '',
        technician: '',
        amount: '',
      });
    }
  }, [editingQuote, isOpen]);

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

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
    
    // Filtrar equipos vacíos
    const filteredEquipment = formData.equipment.filter(eq => eq.trim() !== '');
    
    // Crear objeto de cotización
    const newQuote = {
      ...formData,
      equipment: filteredEquipment,
      date: editingQuote ? editingQuote.date : new Date().toLocaleDateString('es-ES'),
      status: editingQuote ? editingQuote.status : 'pendiente',
      amount: `S/ ${formData.amount}`,
    };

    if (!editingQuote) {
      newQuote.id = `COT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }
    
    onSave(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-light flex justify-between items-center">
          <h3 className="text-xl font-bold">{editingQuote ? 'Editar Cotización' : 'Nueva Cotización'}</h3>
          <button 
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Cliente *</label>
              <select 
                name="client" 
                value={formData.client}
                onChange={handleChange}
                required
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Seleccionar cliente</option>
                {clients && clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tipo de servicio */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Tipo de Servicio *</label>
              <select 
                name="type" 
                value={formData.type}
                onChange={handleChange}
                required
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              >
                <option value="Programado">Programado</option>
                <option value="Correctivo">Correctivo</option>
              </select>
            </div>
            
            {/* Técnico */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Técnico *</label>
              <select 
                name="technician" 
                value={formData.technician}
                onChange={handleChange}
                required
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Seleccionar técnico</option>
                {technicians && technicians.map((tech) => (
                  <option key={tech.id} value={tech.name}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Monto */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Monto Estimado *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate 
                y-1/2">S/</span>
                <input 
                  type="text" 
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="px-3 py-2 pl-8 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Equipos */}
          <div className="mt-6">
            <label className="text-sm text-gray-dark mb-1">Equipos *</label>
            {formData.equipment.map((equipment, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input 
                  type="text" 
                  value={equipment}
                  onChange={(e) => handleEquipmentChange(index, e.target.value)}
                  placeholder="Nombre/modelo del equipo"
                  required
                  className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 flex-1"
                />
                {formData.equipment.length > 1 && (
                  <button 
                    type="button"
                    className="btn btn-danger-light px-2 h-10 min-w-[40px]" 
                    onClick={() => handleRemoveEquipment(index)}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="btn btn-secondary mt-2"
              onClick={handleAddEquipment}
            >
              + Agregar otro equipo
            </button>
          </div>
          
          {/* Descripción */}
          <div className="mt-6">
            <label className="text-sm text-gray-dark mb-1">Descripción de la Cotización *</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Describa brevemente los servicios o reparaciones a cotizar..."
              className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 w-full"
            ></textarea>
          </div>
          
          {/* Botones */}
          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {editingQuote ? 'Actualizar Cotización' : 'Guardar Cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;