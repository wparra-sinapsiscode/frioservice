import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const QuotesTable = ({ quotes, onView, onEdit, onDelete }) => {
  // Mapeo de clases para estados
  const statusClasses = {
    'pendiente': 'bg-warning/15 text-warning-700',
    'aprobada': 'bg-success/15 text-success-700',
    'rechazada': 'bg-danger/15 text-danger-700',
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">ID</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Cliente</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Tipo</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Equipos</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Monto</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Estado</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Fecha</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Técnico</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote, index) => (
            <tr key={index}>
              <td className="py-3 px-4 border-b border-gray-light">{quote.id}</td>
              <td className="py-3 px-4 border-b border-gray-light">{quote.client}</td>
              <td className="py-3 px-4 border-b border-gray-light">{quote.type}</td>
              <td className="py-3 px-4 border-b border-gray-light">
                {quote.equipment.length > 1 
                  ? `${quote.equipment[0]} +${quote.equipment.length - 1}` 
                  : quote.equipment[0]}
              </td>
              <td className="py-3 px-4 border-b border-gray-light">{quote.amount}</td>
              <td className="py-3 px-4 border-b border-gray-light">
                <span className={`py-1 px-2 rounded text-sm font-medium ${statusClasses[quote.status] || 'bg-secondary'}`}>
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4 border-b border-gray-light">{quote.date}</td>
              <td className="py-3 px-4 border-b border-gray-light">{quote.technician}</td>
              <td className="py-3 px-4 border-b border-gray-light">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onView && onView(quote)}
                    className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                    title="Ver detalles"
                  >
                    <FaEye className="text-info" />
                  </button>
                  <button 
                    onClick={() => onEdit && onEdit(quote)}
                    className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                    title="Editar"
                  >
                    <FaEdit className="text-primary" />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(quote)}
                    className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                    title="Eliminar"
                  >
                    <FaTrash className="text-danger" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          
          {quotes.length === 0 && (
            <tr>
              <td colSpan="9" className="py-4 text-center text-gray border-b border-gray-light">
                No se encontraron cotizaciones
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuotesTable;