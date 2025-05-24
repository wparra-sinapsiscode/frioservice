import React, { useState, useMemo } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { clientData } from '../utils/mockData';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [clientType, setClientType] = useState('empresa');
  const [clients, setClients] = useState(clientData);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);

  // Modal para nuevo cliente
  const handleNewClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  // Ver detalles de cliente
  const handleViewClient = (client) => {
    setViewingClient(client);
  };

  // Editar cliente
  const handleEditClient = (client) => {
    setEditingClient(client);
    setClientType(client.type);
    setShowModal(true);
  };

  // Eliminar cliente
  const handleDeleteClient = (client) => {
    if (window.confirm(`¿Está seguro de eliminar el cliente ${client.name}?`)) {
      setClients(clients.filter(c => c.id !== client.id));
    }
  };

  // Guardar cliente (simulado)
  const handleSaveClient = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const clientData = {
      name: formData.get('name'),
      contact: formData.get('contact'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      city: formData.get('city'),
      type: clientType,
      status: 'activo',
      services: editingClient ? editingClient.services : 0,
      nextService: editingClient ? editingClient.nextService : 'No programado'
    };

    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id ? { ...clientData, id: editingClient.id } : client
      ));
    } else {
      const newId = Math.max(...clients.map(c => c.id)) + 1;
      setClients([{ ...clientData, id: newId }, ...clients]);
    }

    setShowModal(false);
    setEditingClient(null);
  };

  // Cambiar tipo de cliente en el formulario
  const handleClientTypeChange = (e) => {
    setClientType(e.target.value);
  };

  // Filtrar clientes usando useMemo para optimizar rendimiento
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || client.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'todos' || client.type.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [clients, searchTerm, statusFilter, typeFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0">Gestión de Clientes</h2>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={handleNewClient}
          >
            <FaPlus /> Nuevo Cliente
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-grow">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <label>Estado:</label>
          <select 
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label>Tipo:</label>
          <select 
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="empresa">Empresa</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>
      
      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Teléfono</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Dirección</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Servicios</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#{client.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-gray-500 text-xs">{client.contact}</div>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{client.type}</td>
                  <td className="px-4 py-3 text-sm">{client.email}</td>
                  <td className="px-4 py-3 text-sm">{client.phone}</td>
                  <td className="px-4 py-3 text-sm">{client.city}</td>
                  <td className="px-4 py-3 text-sm">{client.services}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                      client.status === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewClient(client)}
                        className="p-1 text-blue-600 hover:text-blue-800" 
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="p-1 text-green-600 hover:text-green-800" 
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client)}
                        className="p-1 text-red-600 hover:text-red-800" 
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Mostrando {filteredClients.length} clientes
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50">
              &laquo;
            </button>
            <button className="px-3 py-1 rounded border border-primary bg-primary text-white text-sm">
              1
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-sm">
              2
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-sm">
              3
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 text-sm">
              &raquo;
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de Nuevo Cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold">{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSaveClient}>
                <div className="mb-4">
                  <label className="block mb-2">Tipo de Cliente:</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="cliente-tipo"
                        value="empresa"
                        checked={clientType === 'empresa'}
                        onChange={handleClientTypeChange}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Empresa</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="cliente-tipo"
                        value="personal"
                        checked={clientType === 'personal'}
                        onChange={handleClientTypeChange}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Personal</span>
                    </label>
                  </div>
                </div>
                
                {clientType === 'empresa' ? (
                  <>
                    <div className="mb-4">
                      <label className="block mb-2">Razón Social:</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingClient?.name || ''}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">RUC:</label>
                        <input
                          type="text"
                          name="ruc"
                          defaultValue={editingClient?.ruc || ''}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2">Sector:</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option value="">Seleccione un sector</option>
                          <option value="alimentacion">Alimentación</option>
                          <option value="restaurante">Restaurante</option>
                          <option value="hotel">Hotelería</option>
                          <option value="salud">Salud</option>
                          <option value="laboratorio">Laboratorio</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2">Nombres:</label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={editingClient?.name || ''}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block mb-2">Apellidos:</label>
                        <input
                          type="text"
                          name="lastname"
                          defaultValue={editingClient?.lastname || ''}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2">DNI:</label>
                      <input
                        type="text"
                        name="dni"
                        defaultValue={editingClient?.dni || ''}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2">Email:</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingClient?.email || ''}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Teléfono:</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={editingClient?.phone || ''}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Dirección:</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={editingClient?.address || ''}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2">Ciudad:</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={editingClient?.city || ''}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Distrito:</label>
                    <input
                      type="text"
                      name="district"
                      defaultValue={editingClient?.district || ''}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Usuario:</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={editingClient?.username || ''}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Contraseña:</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={editingClient ? 'Dejar en blanco para mantener la actual' : ''}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required={!editingClient}
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    {editingClient ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {viewingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold">Detalles de Cliente</h3>
              <button 
                onClick={() => setViewingClient(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>ID:</strong> #{viewingClient.id}</div>
                <div><strong>Nombre:</strong> {viewingClient.name}</div>
                <div><strong>Tipo:</strong> <span className="capitalize">{viewingClient.type}</span></div>
                <div><strong>Email:</strong> {viewingClient.email}</div>
                <div><strong>Teléfono:</strong> {viewingClient.phone}</div>
                <div><strong>Ciudad:</strong> {viewingClient.city}</div>
                <div><strong>Contacto:</strong> {viewingClient.contact}</div>
                <div><strong>Servicios:</strong> {viewingClient.services}</div>
                <div><strong>Estado:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full capitalize ${
                    viewingClient.status === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingClient.status}
                  </span>
                </div>
                <div><strong>Próximo Servicio:</strong> {viewingClient.nextService}</div>
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setViewingClient(null)}
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

export default Clients;