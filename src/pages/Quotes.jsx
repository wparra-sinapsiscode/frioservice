import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import QuoteFilters from '../components/quotes/QuoteFilters';
import QuotesTable from '../components/quotes/QuotesTable';
import QuoteModal from '../components/quotes/QuoteModal';
import { quotesData, filterQuotes } from '../utils/quotesMockData';
import { clientData, technicianData } from '../utils/mockData';

const Quotes = () => {
  const [filters, setFilters] = useState({
    status: 'todos',
    client: 'todos',
    type: 'todos',
    startDate: '',
    endDate: '',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quotes, setQuotes] = useState(quotesData);
  const [editingQuote, setEditingQuote] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);
  
  // Filtrar cotizaciones según los filtros aplicados
  const filteredQuotes = filterQuotes(quotes, filters);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Abrir modal para nueva cotización
  const handleNewQuote = () => {
    setIsModalOpen(true);
  };
  
  // Guardar nueva cotización
  const handleSaveQuote = (newQuote) => {
    if (editingQuote) {
      // Actualizar cotización existente
      setQuotes(quotes.map(quote => 
        quote.id === editingQuote.id ? { ...newQuote, id: editingQuote.id } : quote
      ));
      setEditingQuote(null);
    } else {
      // Agregar nueva cotización al inicio del array
      const newId = Math.max(...quotes.map(q => parseInt(q.id.replace('Q', '')))) + 1;
      setQuotes([{ ...newQuote, id: `Q${newId.toString().padStart(3, '0')}` }, ...quotes]);
    }
  };

  // Ver detalles de cotización
  const handleViewQuote = (quote) => {
    setViewingQuote(quote);
  };

  // Editar cotización
  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setIsModalOpen(true);
  };

  // Eliminar cotización
  const handleDeleteQuote = (quote) => {
    if (window.confirm(`¿Está seguro de eliminar la cotización ${quote.id}?`)) {
      setQuotes(quotes.filter(q => q.id !== quote.id));
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuote(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0">Gestión de Cotizaciones</h2>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={handleNewQuote}
          >
            <FaPlus /> Nueva Cotización
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <QuoteFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        clients={clientData}
      />
      
      {/* Tabla de cotizaciones */}
      <div className="bg-white rounded shadow p-4">
        <QuotesTable 
          quotes={filteredQuotes} 
          onView={handleViewQuote}
          onEdit={handleEditQuote}
          onDelete={handleDeleteQuote}
        />
      </div>
      
      {/* Paginación */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          <button className="btn btn-outline">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="flex gap-1">
            <button className="btn btn-primary">1</button>
            <button className="btn btn-outline">2</button>
            <button className="btn btn-outline">3</button>
          </div>
          <button className="btn btn-outline">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      {/* Modal para nueva/editar cotización */}
      <QuoteModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveQuote}
        clients={clientData}
        technicians={technicianData}
        editingQuote={editingQuote}
      />

      {/* Modal para ver detalles */}
      {viewingQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold">Detalles de Cotización {viewingQuote.id}</h3>
              <button 
                onClick={() => setViewingQuote(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Cliente:</strong> {viewingQuote.client}</div>
                <div><strong>Tipo:</strong> {viewingQuote.type}</div>
                <div><strong>Monto:</strong> {viewingQuote.amount}</div>
                <div><strong>Estado:</strong> <span className="capitalize">{viewingQuote.status}</span></div>
                <div><strong>Fecha:</strong> {viewingQuote.date}</div>
                <div><strong>Técnico:</strong> {viewingQuote.technician}</div>
              </div>
              <div className="mt-4">
                <strong>Equipos:</strong>
                <ul className="list-disc list-inside mt-2">
                  {viewingQuote.equipment.map((eq, index) => (
                    <li key={index}>{eq}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setViewingQuote(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;