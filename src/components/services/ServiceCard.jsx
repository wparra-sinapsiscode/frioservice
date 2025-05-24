import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ServiceCard = ({ service }) => {
  // Mapeo de clases de cabecera según tipo de servicio
  const headerClasses = {
    'programado': 'bg-info',
    'correctivo': 'bg-warning',
    'default': 'bg-primary'
  };

  // Mapeo de clases de estado
  const statusClasses = {
    'pendiente': 'bg-warning/15 text-warning-700',
    'en-progreso': 'bg-info/15 text-info-700',
    'completado': 'bg-success/15 text-success-700',
    'default': 'bg-secondary'
  };

  const headerClass = headerClasses[service.type.toLowerCase()] || headerClasses.default;
  const statusClass = statusClasses[service.status.toLowerCase()] || statusClasses.default;

  return (
    <div className="bg-white rounded shadow overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
      {/* Cabecera */}
      <div className={`${headerClass} text-white p-4 relative`}>
        <span className="absolute top-4 right-4 bg-white/20 py-1 px-2 rounded text-sm">
          {service.id}
        </span>
        <h3 className="text-lg font-medium mb-2">{service.title}</h3>
        <p className="text-sm opacity-90 m-0">{service.client}</p>
      </div>
      
      {/* Cuerpo */}
      <div className="p-4">
        {/* Detalles */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray mb-1">Fecha</span>
            <span className="font-medium">{service.date}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray mb-1">Hora</span>
            <span className="font-medium">{service.time}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray mb-1">Técnico</span>
            <span className="font-medium">{service.technician}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray mb-1">Tipo</span>
            <span className="font-medium">{service.type}</span>
          </div>
        </div>
        
        {/* Descripción */}
        <p className="text-sm text-gray-dark mb-4">
          {service.description}
        </p>
        
        {/* Equipos */}
        <div className="mb-4">
          <h4 className="text-sm text-gray-dark mb-2">Equipos:</h4>
          <div className="flex flex-wrap gap-2">
            {service.equipment.map((item, index) => (
              <span key={index} className="bg-secondary py-1 px-2 rounded text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pie */}
      <div className="p-4 border-t border-gray-light flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`py-1 px-2 rounded text-sm font-medium ${statusClass}`}>
            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary">
            <FaEye className="text-info" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary">
            <FaEdit className="text-primary" />
          </button>
          <button className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary">
            <FaTrash className="text-danger" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;