import React from 'react';
import { FaEnvelope, FaPhone, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const TechnicianCard = ({ technician, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
      <div className="p-6 pb-0 text-center">
        <img 
          src={technician.avatar} 
          alt={technician.name} 
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
        />
        <h3 className="text-xl font-semibold mb-1">{technician.name}</h3>
        <p className="text-gray mb-0 text-sm">{technician.specialty}</p>
        
        <div className="mt-4 pb-4 border-b border-gray-light"></div>
      </div>
      
      <div className="grid grid-cols-3 text-center p-4">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold leading-tight">{technician.servicesCompleted}</span>
          <span className="text-xs text-gray">Servicios</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold leading-tight">{technician.averageTime}</span>
          <span className="text-xs text-gray">Tiempo Prom.</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold leading-tight">{technician.rating}</span>
          <span className="text-xs text-gray">Calificación</span>
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