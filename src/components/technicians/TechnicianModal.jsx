import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const TechnicianModal = ({ isOpen, onClose, onSave, technician }) => {
  // =============== DETERMINAR MODO ===============
  const isEditMode = !!technician;
  const modalTitle = isEditMode ? 'Editar Técnico' : 'Nuevo Técnico';
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    specialty: '',
    experienceYears: '',
    phone: '',
    firstName: '',
    lastName: '',
    rating: '5',
    isAvailable: true,
    averageTime: '2h 30min',
    servicesCompleted: ''
  });

  // =============== CARGAR DATOS EN MODO EDICIÓN ===============
  useEffect(() => {
    if (isEditMode && technician && isOpen) {
      console.log("Cargando datos del técnico para edición:", technician);
      setFormData({
        username: '',
        email: '',
        password: '',
        specialty: technician.specialty || '',
        experienceYears: technician.experienceYears?.toString() || '',
        phone: technician.phone || '',
        firstName: technician.firstName || '',
        lastName: technician.lastName || '',
        rating: technician.rating?.toString() || '',
        isAvailable: technician.isAvailable ?? true,
        averageTime: technician.averageTime || '',
        servicesCompleted: technician.servicesCompleted?.toString() || ''
      });
    } else if (!isEditMode && isOpen) {
      // Limpiar formulario en modo creación
      setFormData({
        username: '',
        email: '',
        password: '',
        specialty: '',
        experienceYears: '',
        phone: '',
        firstName: '',
        lastName: '',
        rating: '5',
        isAvailable: true,
        averageTime: '2h 30min',
        servicesCompleted: ''
      });
    }
  }, [isEditMode, technician, isOpen]);

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
    
    console.log('🔥🔥🔥 1. MODAL: Estado formData completo:', formData);
    
    if (isEditMode) {
      // =============== MODO EDICIÓN ===============
      console.log('🔥🔥🔥 1. MODAL: Modo EDICIÓN');
      
      const updatePayload = {
        specialty: formData.specialty.trim(),
        experienceYears: parseInt(formData.experienceYears),
        phone: formData.phone.trim() || null,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        isAvailable: formData.isAvailable,
        averageTime: formData.averageTime.trim() || null,
        firstName: formData.firstName.trim() || null,
        lastName: formData.lastName.trim() || null,
        servicesCompleted: formData.servicesCompleted ? parseInt(formData.servicesCompleted) : 0
      };
      
      console.log('🔥🔥🔥 1. MODAL: Payload para EDICIÓN:', updatePayload);
      onSave(updatePayload);
      
    } else {
      // =============== MODO CREACIÓN ===============
      console.log('🔥🔥🔥 1. MODAL: Modo CREACIÓN');
      
      // Validaciones básicas
      if (!formData.username.trim()) {
        alert('El nombre de usuario es obligatorio');
        return;
      }
      
      if (!formData.email.trim()) {
        alert('El email es obligatorio');
        return;
      }
      
      if (!formData.password || formData.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      
      if (!formData.specialty.trim()) {
        alert('La especialidad es obligatoria');
        return;
      }
      
      if (!formData.experienceYears || parseInt(formData.experienceYears) < 0) {
        alert('Los años de experiencia son obligatorios');
        return;
      }
      
      // Crear payload para el backend - estructura plana
      const createPayload = {
        // Datos del usuario
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        // Datos del técnico
        specialty: formData.specialty.trim(),
        experienceYears: parseInt(formData.experienceYears),
        phone: formData.phone.trim() || null,
        firstName: formData.firstName.trim() || null,
        lastName: formData.lastName.trim() || null,
        rating: formData.rating ? parseFloat(formData.rating) : 5.0,
        isAvailable: formData.isAvailable,
        averageTime: formData.averageTime.trim() || null,
        servicesCompleted: formData.servicesCompleted ? parseInt(formData.servicesCompleted) : 0,
        name: `${formData.firstName} ${formData.lastName}`.trim() || formData.username
      };
      
      console.log('🔥🔥🔥 1. MODAL: Payload para CREACIÓN:', createPayload);
      onSave(createPayload);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-light flex justify-between items-center">
          <h3 className="text-xl font-bold">{modalTitle}</h3>
          <button 
            className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* =============== CAMPOS DE CREACIÓN =============== */}
          {!isEditMode && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4 border-b pb-2">Datos de Usuario</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre de Usuario *</label>
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="juan.perez"
                    className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="juan@email.com"
                    className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                  />
                </div>
                
                {/* Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Contraseña *</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* =============== CAMPOS COMUNES (TÉCNICO) =============== */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b pb-2">Datos Profesionales</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Especialidad */}
              <div>
                <label className="block text-sm font-medium mb-1">Especialidad *</label>
                <select 
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
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
              <div>
                <label className="block text-sm font-medium mb-1">Años de Experiencia *</label>
                <input 
                  type="number" 
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  required
                  min="0"
                  max="50"
                  placeholder="5"
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+51 999 888 777"
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium mb-1">Apellido</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-1">Calificación</label>
                <input 
                  type="number" 
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Disponibilidad */}
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select 
                  name="isAvailable"
                  value={formData.isAvailable}
                  onChange={(e) => setFormData({...formData, isAvailable: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                >
                  <option value="true">Disponible</option>
                  <option value="false">No Disponible</option>
                </select>
              </div>
              
              {/* Servicios Completados */}
              <div>
                <label className="block text-sm font-medium mb-1">Servicios Completados</label>
                <input 
                  type="number" 
                  name="servicesCompleted"
                  value={formData.servicesCompleted}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                />
              </div>
              
              {/* Tiempo promedio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Tiempo Promedio por Servicio</label>
                <input 
                  type="text" 
                  name="averageTime"
                  value={formData.averageTime}
                  onChange={handleChange}
                  placeholder="2h 30min"
                  className="w-full px-3 py-2 border rounded focus:border-primary focus:outline-none"
                />
              </div>
            </div>
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
              {isEditMode ? 'Actualizar' : 'Crear Técnico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechnicianModal;