import React from 'react';
import { FaEnvelope, FaPhone, FaEdit, FaTrash, FaEye, FaStar } from 'react-icons/fa';

const TechnicianCard = ({ technician, onView, onEdit, onDelete }) => {
  // Función para renderizar estrellas de calificación
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  // Extraer nombre del técnico (firstName + lastName o name o username)
  const displayName = technician.firstName && technician.lastName 
    ? `${technician.firstName} ${technician.lastName}`
    : technician.name || technician.user?.username || 'Sin nombre';

  // Imagen por defecto si no tiene avatar
  const avatarUrl = technician.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0ea5e9&color=fff&size=80`;

  return (
    <div className="bg-white rounded shadow overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
      <div className="p-6 pb-0 text-center">
        <img 
          src={avatarUrl} 
          alt={displayName} 
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
        />
        <h3 className="text-xl font-semibold mb-1">{displayName}</h3>
        <p className="text-gray mb-0 text-sm">{technician.specialty}</p>
        
        <div className="mt-4 pb-4 border-b border-gray-light"></div>
      </div>
      
      <div className="grid grid-cols-3 text-center p-4">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold leading-tight">{technician.servicesCompleted || 0}</span>
          <span className="text-xs text-gray">Servicios</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold leading-tight">{technician.averageTime || 'N/A'}</span>
          <span className="text-xs text-gray">Tiempo Prom.</span>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center items-center gap-1 mb-1">
            {renderStars(technician.rating || 0)}
          </div>
          <span className="text-xs text-gray font-medium">{(technician.rating || 0).toFixed(1)}/5</span>
        </div>
      </div>
      
      <div className="bg-secondary p-4 flex justify-between items-center">
        <div className="flex gap-3">
          <button 
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-all"
            aria-label="Email"
          >
            <FaEnvelope className="text-primary" />
          </button>
          <button 
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow transition-all"
            aria-label="Phone"
          >
            <FaPhone className="text-primary" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-outline text-sm px-2 py-1 flex items-center gap-1"
            onClick={() => onView && onView(technician)}
            title="Ver detalles"
          >
            <FaEye />
          </button>
          <button 
            className="btn btn-outline text-sm px-2 py-1 flex items-center gap-1"
            onClick={() => onEdit && onEdit(technician)}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button 
            className="btn btn-outline-danger text-sm px-2 py-1 flex items-center gap-1"
            onClick={() => onDelete && onDelete(technician)}
            title="Eliminar"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;