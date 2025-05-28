import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import QuoteFilters from '../components/quotes/QuoteFilters';
import QuotesTable from '../components/quotes/QuotesTable';
import QuoteForm from '../components/quotes/QuoteForm';
import { useApp } from '../hooks/useApp';
import { getClientDisplayName } from '../utils/clientUtils';

const Quotes = () => {
  console.log('🔥🔥🔥 Quotes component rendered');
  
  const { 
    quotes, 
    isLoadingQuotes, 
    errorQuotes,
    clients,
    fetchQuotes, 
    addQuote, 
    updateQuote, 
    deleteQuote,
    fetchClients 
  } = useApp();
  
  const [filters, setFilters] = useState({
    status: 'todos',
    client: 'todos',
    type: 'todos',
    startDate: '',
    endDate: '',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);
  
  // Fetch data on component mount
  useEffect(() => {
    console.log('🔥🔥🔥 Quotes useEffect - fetching quotes and clients');
    fetchQuotes();
    fetchClients();
  }, [fetchQuotes, fetchClients]);
  
  // Filter quotes based on current filters
  const filteredQuotes = quotes.filter(quote => {
    console.log('🔥🔥🔥 Filtering quote:', quote);
    
    // Status filter
    if (filters.status !== 'todos' && quote.status !== filters.status) {
      return false;
    }
    
    // Client filter
    if (filters.client !== 'todos' && quote.clientId !== filters.client) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(quote.createdAt) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(quote.createdAt) > new Date(filters.endDate)) {
      return false;
    }
    
    return true;
  });
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log('🔥🔥🔥 Filter change:', newFilters);
    setFilters(newFilters);
  };
  
  // Open modal for new quote
  const handleNewQuote = () => {
    console.log('🔥🔥🔥 Opening new quote modal');
    setIsModalOpen(true);
  };
  
  // Save quote (create or update)
  const handleSaveQuote = async (quoteData) => {
    console.log('🔥🔥🔥 Saving quote:', quoteData);
    try {
      if (editingQuote) {
        // Update existing quote
        console.log('🔥🔥🔥 Updating quote with ID:', editingQuote.id);
        await updateQuote(editingQuote.id, quoteData);
        setEditingQuote(null);
      } else {
        // Create new quote
        console.log('🔥🔥🔥 Creating new quote');
        await addQuote(quoteData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('🔥🔥🔥 Error saving quote:', error);
      alert('Error al guardar la cotización. Por favor, intente nuevamente.');
    }
  };

  // View quote details
  const handleViewQuote = (quote) => {
    console.log('🔥🔥🔥 Viewing quote:', quote);
    setViewingQuote(quote);
  };

  // Edit quote
  const handleEditQuote = (quote) => {
    console.log('🔥🔥🔥 Editing quote:', quote);
    setEditingQuote(quote);
    setIsModalOpen(true);
  };

  // Delete quote
  const handleDeleteQuote = async (quote) => {
    console.log('🔥🔥🔥 Attempting to delete quote:', quote);
    if (window.confirm(`¿Está seguro de eliminar la cotización ${quote.id}?`)) {
      try {
        console.log('🔥🔥🔥 Deleting quote with ID:', quote.id);
        await deleteQuote(quote.id);
      } catch (error) {
        console.error('🔥🔥🔥 Error deleting quote:', error);
        alert('Error al eliminar la cotización. Por favor, intente nuevamente.');
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    console.log('🔥🔥🔥 Closing modal');
    setIsModalOpen(false);
    setEditingQuote(null);
  };

  // Get client info for modal display
  const getClientInfo = (clientId) => {
    console.log('🔥🔥🔥 Quote detail modal - clientId:', clientId);
    console.log('🔥🔥🔥 Quote detail modal - available clients:', clients);
    
    const client = clients.find(c => c.id === clientId);
    console.log('🔥🔥🔥 Quote detail modal - found client:', client);
    
    if (!client) {
      return { label: 'Cliente:', name: 'Cliente no encontrado' };
    }
    
    if (client.clientType === 'COMPANY') {
      return { 
        label: 'Razón Social:', 
        name: getClientDisplayName(client) 
      };
    } else if (client.clientType === 'PERSONAL') {
      return { 
        label: 'Nombre Completo:', 
        name: getClientDisplayName(client) 
      };
    }
    
    return { 
      label: 'Cliente:', 
      name: getClientDisplayName(client) 
    };
  };

  // Loading state
  if (isLoadingQuotes) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando cotizaciones...</div>
      </div>
    );
  }

  // Error state
  if (errorQuotes) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {errorQuotes}</div>
      </div>
    );
  }

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
        clients={clients}
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
      <QuoteForm 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveQuote}
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
                <div><strong>Título:</strong> {viewingQuote.title}</div>
                <div><strong>{getClientInfo(viewingQuote.clientId).label}</strong> {getClientInfo(viewingQuote.clientId).name}</div>
                <div><strong>Monto:</strong> ${viewingQuote.amount?.toLocaleString()}</div>
                <div><strong>Estado:</strong> <span className="capitalize">{viewingQuote.status}</span></div>
                <div><strong>Fecha Creación:</strong> {new Date(viewingQuote.createdAt).toLocaleDateString()}</div>
                <div><strong>Válida Hasta:</strong> {new Date(viewingQuote.validUntil).toLocaleDateString()}</div>
              </div>
              {viewingQuote.description && (
                <div className="mt-4">
                  <strong>Descripción:</strong>
                  <p className="mt-2 text-gray-700">{viewingQuote.description}</p>
                </div>
              )}
              {viewingQuote.notes && (
                <div className="mt-4">
                  <strong>Notas:</strong>
                  <p className="mt-2 text-gray-700">{viewingQuote.notes}</p>
                </div>
              )}
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