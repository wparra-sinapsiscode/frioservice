import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const TechnicianModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    hourlyRate: '',
    avatar: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTechnician = {
      ...formData,
      id: `TECH-${Date.now()}`,
      servicesCompleted: 0,
      averageTime: '0h',
      rating: '5.0',
      avatar: formData.avatar || 'https://via.placeholder.com/150',
      status: 'active'
    };
    
    onSave(newTechnician);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      experience: '',
      hourlyRate: '',
      avatar: ''
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-light flex justify-between items-center">
          <h3 className="text-xl font-bold">Nuevo Técnico</h3>
          <button 
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre completo */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Nombre Completo *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Juan Pérez García"
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Email *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="juan.perez@email.com"
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            {/* Teléfono */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Teléfono *</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+51 999 888 777"
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            {/* Especialidad */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Especialidad *</label>
              <select 
                name="specialty" 
                value={formData.specialty}
                onChange={handleChange}
                required
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Seleccionar especialidad</option>
                <option value="Refrigeración Industrial">Refrigeración Industrial</option>
                <option value="Aire Acondicionado">Aire Acondicionado</option>
                <option value="Sistemas de Frío">Sistemas de Frío</option>
                <option value="Mantenimiento General">Mantenimiento General</option>
                <option value="Instalaciones">Instalaciones</option>
              </select>
            </div>
            
            {/* Años de experiencia */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Años de Experiencia *</label>
              <input 
                type="number" 
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                max="50"
                placeholder="5"
                className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            {/* Tarifa por hora */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-dark mb-1">Tarifa por Hora</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">S/</span>
                <input 
                  type="number" 
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="50.00"
                  className="px-3 py-2 pl-8 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 w-full"
                />
              </div>
            </div>
          </div>
          
          {/* URL de Avatar */}
          <div className="mt-6">
            <label className="text-sm text-gray-dark mb-1">URL de Foto de Perfil</label>
            <input 
              type="url" 
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://ejemplo.com/foto.jpg"
              className="px-3 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 w-full"
            />
            <p className="text-xs text-gray mt-1">Opcional: URL de la imagen de perfil del técnico</p>
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
              Guardar Técnico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicianModal;