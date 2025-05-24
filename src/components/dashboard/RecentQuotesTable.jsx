import React, { useState } from 'react';
import { FaSearch, FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const RecentQuotesTable = ({ quotes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrar cotizaciones por término de búsqueda
  const filteredQuotes = quotes.filter(quote => 
    quote.id.toString().includes(searchTerm) ||
    quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mapeo de clases para estados
  const statusClasses = {
    'pendiente': 'bg-warning/15 text-warning-700',
    'aprobada': 'bg-success/15 text-success-700',
    'rechazada': 'bg-danger/15 text-danger-700',
  };
  
  return (
    <div className="bg-white rounded shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium m-0">Últimas Cotizaciones</h3>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-9 pr-3 py-2 border border-gray-light rounded w-[220px] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline text-sm">Exportar</button>
        </div>
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">ID</th>
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Cliente</th>
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Tipo</th>
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Monto</th>
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Estado</th>
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Fecha</th>
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((quote, index) => (
              <tr key={index}>
                <td className="py-3 px-4 border-b border-gray-light">{quote.id}</td>
                <td className="py-3 px-4 border-b border-gray-light">{quote.client}</td>
                <td className="py-3 px-4 border-b border-gray-light">{quote.type}</td>
                <td className="py-3 px-4 border-b border-gray-light">{quote.amount}</td>
                <td className="py-3 px-4 border-b border-gray-light">
                  <span className={`py-1 px-2 rounded text-sm font-medium ${statusClasses[quote.status] || 'bg-secondary'}`}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-light">{quote.date}</td>
                <td className="py-3 px-4 border-b border-gray-light">
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
                </td>
              </tr>
            ))}
            
            {filteredQuotes.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray border-b border-gray-light">
                  No se encontraron cotizaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentQuotesTable;