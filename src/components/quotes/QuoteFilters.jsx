import React from 'react';
import { FaUndo } from 'react-icons/fa';

const QuoteFilters = ({ filters, onFilterChange, clients }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex flex-col">
        <label className="text-sm text-gray mb-1">Estado:</label>
        <select 
          name="status" 
          className="px-2 py-2 border border-gray-light rounded bg-white min-w-[120px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
        </select>
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm text-gray mb-1">Cliente:</label>
        <select 
          name="client" 
          className="px-2 py-2 border border-gray-light rounded bg-white min-w-[120px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          value={filters.client}
          onChange={handleChange}
        >
          <option value="todos">Todos</option>
          {clients && clients.map((client, index) => (
            <option key={index} value={client.username}>
              {client.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm text-gray mb-1">Tipo:</label>
        <select 
          name="type" 
          className="px-2 py-2 border border-gray-light rounded bg-white min-w-[120px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="todos">Todos</option>
          <option value="programado">Programado</option>
          <option value="correctivo">Correctivo</option>
        </select>
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm text-gray mb-1">Período:</label>
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            name="startDate"
            className="px-2 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            value={filters.startDate}
            onChange={handleChange}
          />
          <span className="text-gray">a</span>
          <input 
            type="date" 
            name="endDate"
            className="px-2 py-2 border border-gray-light rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <button 
        className="btn btn-outline flex items-center gap-2 mt-auto"
        onClick={() => onFilterChange({
          status: 'todos',
          client: 'todos',
          type: 'todos',
          startDate: '',
          endDate: ''
        })}
      >
        <FaUndo /> Limpiar
      </button>
    </div>
  );
};

export default QuoteFilters;