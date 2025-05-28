import React, { useState } from 'react';
import { FaSearch, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';

const RecentQuotesTable = ({ quotes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingQuote, setViewingQuote] = useState(null);
  const navigate = useNavigate();
  const { deleteQuote, quotes: allQuotes } = useApp();
  
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

  // Función para ver detalles de la cotización
  const handleView = (quoteId) => {
    // Buscar la cotización completa por ID
    const quote = allQuotes.find(q => q.id === quoteId);
    if (quote) {
      setViewingQuote(quote);
    } else {
      // Si no está en el contexto, redirigir a la página completa
      navigate(`/cotizaciones?view=${quoteId}`);
    }
  };

  // Función para editar cotización
  const handleEdit = (quoteId) => {
    // Redirigir a la página de cotizaciones con el modo de edición
    navigate(`/cotizaciones?edit=${quoteId}`);
  };

  // Función para eliminar cotización
  const handleDelete = async (quoteId) => {
    const quote = quotes.find(q => q.id === quoteId);
    const quoteName = quote ? `${quote.id} - ${quote.client}` : quoteId;
    
    if (window.confirm(`¿Está seguro de eliminar la cotización ${quoteName}?`)) {
      try {
        await deleteQuote(quoteId);
        // El contexto se encarga de actualizar la lista automáticamente
      } catch (error) {
        console.error('Error al eliminar cotización:', error);
        alert('Error al eliminar la cotización. Por favor, intente nuevamente.');
      }
    }
  };

  // Función para cerrar el modal de vista
  const handleCloseViewModal = () => {
    setViewingQuote(null);
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
              <th className="py-3 px-4 text-left bg-secondary text-gray-dark font-semibold border-b-2 border-gray-light hidden">ID</th>
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
                <td className="py-3 px-4 border-b border-gray-light hidden">{quote.id}</td>
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
                    <button 
                      onClick={() => handleView(quote.id)}
                      className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                      title="Ver detalles"
                    >
                      <FaEye className="text-info" />
                    </button>
                    <button 
                      onClick={() => handleEdit(quote.id)}
                      className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                      title="Editar cotización"
                    >
                      <FaEdit className="text-primary" />
                    </button>
                    <button 
                      onClick={() => handleDelete(quote.id)}
                      className="w-7 h-7 rounded flex items-center justify-center border-none cursor-pointer transition-all hover:bg-secondary"
                      title="Eliminar cotización"
                    >
                      <FaTrash className="text-danger" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredQuotes.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray border-b border-gray-light">
                  No se encontraron cotizaciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Vista de Detalles */}
      {viewingQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Detalles de Cotización</h2>
              <button
                onClick={handleCloseViewModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>ID:</strong>
                  <p className="mb-3">{viewingQuote.id}</p>
                </div>
                <div>
                  <strong>Estado:</strong>
                  <p className="mb-3">
                    <span className={`py-1 px-2 rounded text-sm font-medium ${statusClasses[viewingQuote.status?.toLowerCase()] || 'bg-secondary'}`}>
                      {viewingQuote.status?.charAt(0).toUpperCase() + viewingQuote.status?.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <strong>Cliente:</strong>
                  <p className="mb-3">{viewingQuote.client?.companyName || viewingQuote.client?.contactPerson || 'Cliente no especificado'}</p>
                </div>
                <div>
                  <strong>Monto:</strong>
                  <p className="mb-3 text-lg font-semibold text-success">S/ {viewingQuote.amount || 0}</p>
                </div>
                <div>
                  <strong>Fecha de Creación:</strong>
                  <p className="mb-3">{new Date(viewingQuote.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <strong>Válida hasta:</strong>
                  <p className="mb-3">{viewingQuote.validUntil ? new Date(viewingQuote.validUntil).toLocaleDateString('es-ES') : 'No especificada'}</p>
                </div>
              </div>
              
              {viewingQuote.title && (
                <div className="mb-4">
                  <strong>Título:</strong>
                  <p>{viewingQuote.title}</p>
                </div>
              )}
              
              {viewingQuote.description && (
                <div className="mb-4">
                  <strong>Descripción:</strong>
                  <p className="whitespace-pre-wrap">{viewingQuote.description}</p>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50 p-4 flex justify-end gap-2">
              <button
                onClick={() => handleEdit(viewingQuote.id)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleCloseViewModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentQuotesTable;