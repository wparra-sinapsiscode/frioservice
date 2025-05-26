import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useApp } from '../../hooks/useApp';
import { getClientDisplayName } from '../../utils/clientUtils';

const QuotesTable = ({ quotes, onView, onEdit, onDelete }) => {
  console.log('🔥🔥🔥 QuotesTable rendered with quotes:', quotes);
  
  const { clients } = useApp();
  
  // Status badge classes
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'approved': 'bg-green-100 text-green-800 border border-green-200',
    'rejected': 'bg-red-100 text-red-800 border border-red-200',
    'expired': 'bg-gray-100 text-gray-800 border border-gray-200',
  };

  // Status labels in Spanish
  const statusLabels = {
    'pending': 'Pendiente',
    'approved': 'Aprobada',
    'rejected': 'Rechazada',
    'expired': 'Expirada',
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      console.error('🔥🔥🔥 Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  // Get client name by ID using helper function
  const getClientName = (clientId) => {
    console.log('🔥🔥🔥 Getting client name for ID:', clientId, 'Available clients:', clients);
    if (!clientId) return 'N/A';
    
    const client = clients.find(c => c.id === clientId);
    if (!client) return `Cliente ID: ${clientId}`;
    
    console.log('🔥🔥🔥 Found client:', client);
    
    return getClientDisplayName(client);
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">ID</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Título</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Cliente</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Monto</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Estado</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Válida Hasta</th>
            <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => {
            console.log('🔥🔥🔥 Rendering quote row:', quote);
            return (
              <tr key={quote.id}>
                <td className="py-3 px-4 border-b border-gray-light font-mono text-sm">
                  {quote.id}
                </td>
                <td className="py-3 px-4 border-b border-gray-light">
                  <div className="font-medium">{quote.title || 'Sin título'}</div>
                  {quote.description && (
                    <div className="text-sm text-gray-600 truncate max-w-xs" title={quote.description}>
                      {quote.description}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 border-b border-gray-light">
                  {getClientName(quote.clientId)}
                </td>
                <td className="py-3 px-4 border-b border-gray-light font-semibold">
                  {formatCurrency(quote.amount)}
                </td>
                <td className="py-3 px-4 border-b border-gray-light">
                  <span className={`py-1 px-3 rounded-full text-xs font-medium ${statusClasses[quote.status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                    {statusLabels[quote.status] || quote.status}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-light">
                  <div className="text-sm">
                    {formatDate(quote.validUntil)}
                  </div>
                  {quote.validUntil && new Date(quote.validUntil) < new Date() && (
                    <div className="text-xs text-red-600 font-medium">Expirada</div>
                  )}
                </td>
                <td className="py-3 px-4 border-b border-gray-light">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        console.log('🔥🔥🔥 View button clicked for quote:', quote);
                        onView && onView(quote);
                      }}
                      className="w-8 h-8 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-blue-50 hover:text-blue-600"
                      title="Ver detalles"
                    >
                      <FaEye className="text-sm" />
                    </button>
                    <button 
                      onClick={() => {
                        console.log('🔥🔥🔥 Edit button clicked for quote:', quote);
                        onEdit && onEdit(quote);
                      }}
                      className="w-8 h-8 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-green-50 hover:text-green-600"
                      title="Editar"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button 
                      onClick={() => {
                        console.log('🔥🔥🔥 Delete button clicked for quote:', quote);
                        onDelete && onDelete(quote);
                      }}
                      className="w-8 h-8 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-red-50 hover:text-red-600"
                      title="Eliminar"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          
          {quotes.length === 0 && (
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-500 border-b border-gray-light">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-medium mb-2">No se encontraron cotizaciones</div>
                  <div className="text-sm">Intenta ajustar los filtros o crear una nueva cotización</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuotesTable;