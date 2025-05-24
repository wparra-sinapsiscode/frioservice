import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ServicesTable = ({ services, onView, onEdit, onDelete }) => {
  // Mapeo de clases de estado
  const statusClasses = {
    'pendiente': 'bg-warning/15 text-warning-700',
    'en-progreso': 'bg-info/15 text-info-700',
    'completado': 'bg-success/15 text-success-700',
    'default': 'bg-secondary'
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">ID</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Cliente</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Tipo</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Equipo</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Técnico</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Fecha</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Estado</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}>
              <td className="py-3 px-4 border-b border-gray-light">{service.id}</td>
              <td className="py-3 px-4 border-b border-gray-light">{service.client}</td>
              <td className="py-3 px-4 border-b border-gray-light">{service.type}</td>
              <td className="py-3 px-4 border-b border-gray-light">{service.equipment.join(', ')}</td>
              <td className="py-3 px-4 border-b border-gray-light">{service.technician}</td>
              <td className="py-3 px-4 border-b border-gray-light">{service.date}, {service.time}</td>
              <td className="py-3 px-4 border-b border-gray-light">
                <span className={`py-1 px-2 rounded text-sm font-medium ${statusClasses[service.status.toLowerCase()] || statusClasses.default}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4 border-b border-gray-light">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onView && onView(service)}
                    className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                    title="Ver detalles"
                  >
                    <FaEye className="text-info" />
                  </button>
                  <button 
                    onClick={() => onEdit && onEdit(service)}
                    className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                    title="Editar"
                  >
                    <FaEdit className="text-primary" />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(service)}
                    className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                    title="Eliminar"
                  >
                    <FaTrash className="text-danger" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
          {services.length === 0 && (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray border-b border-gray-light">
                No se encontraron servicios
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;