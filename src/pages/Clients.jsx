import React, { useState, useMemo, useContext } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import StatusToggle from '../components/ui/StatusToggle';
import { getClientDisplayName, getClientTypeLabel, getClientDocumentNumber } from '../utils/clientUtils';

const Clients = () => {
  const {
    clients,
    isLoadingClients,
    errorClients,
    addClient,
    updateClient,
    deleteClient,
    updateClientStatus
  } = useContext(AppContext);

  // 2. OBTENEMOS EL USUARIO LOGUEADO (EL ADMIN) DEL AuthContext
  const { user } = useAuth();

  // --- ESTADOS LOCALES PARA LA UI (SIN CAMBIOS) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [clientType, setClientType] = useState('empresa'); // El estado local para el tipo de cliente del formulario
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);

  // --- MANEJADORES DE EVENTOS (SIN CAMBIOS) ---
  const handleNewClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const handleViewClient = (client) => {
    setViewingClient(client);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    // Asegúrate que 'client.clientType' sea la propiedad correcta si viene del backend
    setClientType(client.clientType || client.type || 'empresa');
    setShowModal(true);
  };

  // --- FUNCIÓN DE GUARDADO CORREGIDA ---
  // En Clients.jsx

  const handleSaveClient = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("Error de sesión: No se pudo obtener el ID del usuario. Por favor, inicie sesión de nuevo.");
      console.error("Intento de guardar cliente sin user.id:", user);
      return;
    }

    const formData = new FormData(e.target);

    let backendApiCompatibleClientType;
    if (clientType === 'empresa') {
      backendApiCompatibleClientType = 'COMPANY';
    } else if (clientType === 'personal') {
      backendApiCompatibleClientType = 'PERSONAL';
    } else {
      alert("Tipo de cliente no reconocido. Por favor, seleccione uno válido.");
      return;
    }

    // Objeto base con campos comunes
    const clientDataFromForm = {
      clientType: backendApiCompatibleClientType,
      userId: user.id,
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      district: formData.get('district'),
      username: formData.get('username'),
      password: formData.get('password'),
    };

    // Si la contraseña está vacía y no estamos editando, la eliminamos o validamos
    if (!editingClient && !clientDataFromForm.password) {
      alert("La contraseña es requerida para nuevos clientes.");
      return;
    }
    if (editingClient && !clientDataFromForm.password) {
      delete clientDataFromForm.password;
    }

    // --- ¡AQUÍ ESTÁ EL CAMBIO CLAVE PARA LOS NOMBRES! ---
    if (clientType === 'empresa') {
      // Asumimos que el backend espera 'companyName' para el nombre de la empresa.
      // 'name' es el atributo del input de "Razón Social" en tu formulario.
      clientDataFromForm.companyName = formData.get('name');
      clientDataFromForm.ruc = formData.get('ruc');
      clientDataFromForm.sector = formData.get('sector');
    } else { // personal
      // Asumimos que el backend espera 'firstName' y 'lastName' para personas.
      // 'name' es el atributo del input de "Nombres" en tu formulario.
      clientDataFromForm.firstName = formData.get('name');
      clientDataFromForm.lastName = formData.get('lastname');
      clientDataFromForm.dni = formData.get('dni');
    }

    try {
      if (editingClient) {
        // Ajusta esto si el update también necesita companyName/firstName/lastName
        await updateClient(editingClient.id, clientDataFromForm);
      } else {
        await addClient(clientDataFromForm);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Falló al guardar el cliente:", error);
      alert(error.message);
    }
  };

  const handleDeleteClient = async (client) => {
    if (window.confirm(`¿Está seguro de eliminar el cliente ${getClientDisplayName(client)}?`)) {
      try {
        await deleteClient(client.id);
      } catch (error) {
        console.error("Falló al eliminar el cliente:", error);
        alert(error.message || "Error al eliminar cliente.");
      }
    }
  };

  const handleToggleClientStatus = async (clientId, newStatus) => {
    try {
      await updateClientStatus(clientId, newStatus);
      console.log(`✅ Cliente ${newStatus ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert(`Error al cambiar estado: ${error.message}`);
    }
  };

  const handleClientTypeChange = (e) => {
    setClientType(e.target.value);
  };

  const filteredClients = useMemo(() => {
    // Agregamos una comprobación para asegurarnos que 'clients' sea un array antes de filtrar
    if (!Array.isArray(clients)) {
      return [];
    }
    return clients.filter(client => {
      // Usar helper functions para obtener datos consistentes
      const clientName = getClientDisplayName(client);
      const clientEmail = client.email || client.user?.email || '';
      const clientDocument = getClientDocumentNumber(client);

      const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientDocument.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'todos' || (client.status && client.status.toLowerCase() === statusFilter.toLowerCase());

      // Usamos client.clientType porque así lo espera el backend y así lo guardaremos
      const matchesType = typeFilter === 'todos' || (client.clientType && client.clientType.toLowerCase() === typeFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [clients, searchTerm, statusFilter, typeFilter]);

  if (isLoadingClients) {
    return <div className="text-center p-8">Cargando clientes...</div>;
  }

  if (errorClients) {
    return <div className="text-center p-8 text-red-600">Error al cargar clientes: {errorClients}</div>;
  }

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
            value={typeFilter} // Este es el estado local para el filtro de la tabla
            onChange={(e) => setTypeFilter(e.target.value)} // Actualiza el filtro de la tabla
          >
            <option value="todos">Todos</option>
            <option value="empresa">Empresa</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Teléfono</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Dirección</th>
                {/* <th className="px-4 py-3 text-sm font-medium text-gray-600">Servicios</th> */}
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{getClientDisplayName(client)}</div>
                    <div className="text-gray-500 text-xs">{getClientDocumentNumber(client)}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{getClientTypeLabel(client)}</td>
                  <td className="px-4 py-3 text-sm">{client.email || client.user?.email}</td>
                  <td className="px-4 py-3 text-sm">{client.phone}</td>
                  <td className="px-4 py-3 text-sm">{client.address}</td>
                  {/* <td className="px-4 py-3 text-sm">{client.totalServices || client._count?.services}</td> */}
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${client.status?.toLowerCase() === 'active' || client.status?.toLowerCase() === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2 items-center">
                      {/* Toggle de estado */}
                      <StatusToggle
                        isActive={client.status?.toLowerCase() === 'active'}
                        onToggle={(newStatus) => handleToggleClientStatus(client.id, newStatus)}
                        size="sm"
                      />
                      
                      {/* Botones existentes */}
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

        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>
          {/* Aquí podrías implementar una paginación real más adelante */}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold">{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSaveClient}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Tipo de Cliente:</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="clientTypeSelector" // Nombre diferente para no chocar con el estado
                        value="empresa"
                        checked={clientType === 'empresa'}
                        onChange={handleClientTypeChange}
                        className="form-radio h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Empresa</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="clientTypeSelector"
                        value="personal"
                        checked={clientType === 'personal'}
                        onChange={handleClientTypeChange}
                        className="form-radio h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">Personal</span>
                    </label>
                  </div>
                </div>

                {clientType === 'empresa' ? (
                  <>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">Razón Social:</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingClient?.name || ''}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium">RUC:</label>
                        <input
                          type="text"
                          name="ruc"
                          defaultValue={editingClient?.ruc || ''}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          required
                          minLength="11"
                          maxLength="11"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Sector:</label>
                        <select
                          name="sector"
                          defaultValue={editingClient?.sector || ''}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
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
                ) : ( // Personal
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium">Nombres:</label>
                        <input
                          type="text"
                          name="name" // El backend espera 'name' para el nombre de persona también
                          defaultValue={editingClient?.name || ''}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium">Apellidos:</label>
                        <input
                          type="text"
                          name="lastname"
                          defaultValue={editingClient?.lastname || ''}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">DNI:</label>
                      <input
                        type="text"
                        name="dni"
                        defaultValue={editingClient?.dni || ''}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        minLength="8"
                        maxLength="8"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Email (para login y contacto):</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingClient?.email || editingClient?.user?.email || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Teléfono:</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={editingClient?.phone || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Dirección:</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={editingClient?.address || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Ciudad:</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={editingClient?.city || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium">Distrito:</label>
                    <input
                      type="text"
                      name="district"
                      defaultValue={editingClient?.district || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <h4 className="text-md font-semibold mt-6 mb-2">Datos de Acceso para el Cliente</h4>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Nombre de Usuario (para login):</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={editingClient?.user?.username || ''}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Contraseña (para login):</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={editingClient ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    required={!editingClient} // Requerida solo si es nuevo cliente
                    minLength={!editingClient ? 6 : undefined}
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
                    {editingClient ? 'Actualizar Cliente' : 'Guardar Cliente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {viewingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold">Detalles de Cliente</h3>
              <button
                onClick={() => setViewingClient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>ID Cliente:</strong> #{viewingClient.id?.substring(0, 8)}</div>
                <div><strong>ID Usuario:</strong> #{viewingClient.userId?.substring(0, 8)}</div>
                <hr className="md:col-span-2 my-2" />

                {/* Lógica mejorada para mostrar el nombre */}
                {viewingClient.clientType === 'COMPANY' ? (
                  <div><strong>Razón Social:</strong> {getClientDisplayName(viewingClient)}</div>
                ) : (
                  <div><strong>Nombre Completo:</strong> {getClientDisplayName(viewingClient)}</div>
                )}

                {viewingClient.clientType === 'COMPANY' && viewingClient.ruc && <div><strong>RUC:</strong> {viewingClient.ruc}</div>}
                {viewingClient.clientType === 'COMPANY' && viewingClient.businessRegistration && !viewingClient.ruc && <div><strong>Reg. Negocio:</strong> {viewingClient.businessRegistration}</div>}

                {viewingClient.clientType === 'PERSONAL' && viewingClient.dni && <div><strong>DNI:</strong> {viewingClient.dni}</div>}
                {viewingClient.clientType === 'PERSONAL' && viewingClient.businessRegistration && !viewingClient.dni && <div><strong>Reg. Negocio:</strong> {viewingClient.businessRegistration}</div>}

                {viewingClient.clientType === 'COMPANY' && viewingClient.contactPerson && <div><strong>Persona de Contacto (Empresa):</strong> {viewingClient.contactPerson}</div>}


                <div><strong>Tipo:</strong> <span className="capitalize">{viewingClient.clientType?.toLowerCase()}</span></div>
                <div><strong>Email (Contacto Perfil):</strong> {viewingClient.email}</div>
                <div><strong>Teléfono:</strong> {viewingClient.phone}</div>
                <div><strong>Dirección:</strong> {viewingClient.address}</div>
                <div><strong>Ciudad:</strong> {viewingClient.city}</div>
                <div><strong>Distrito:</strong> {viewingClient.district}</div>
                <div><strong>Sector:</strong> {viewingClient.sector}</div>
                <hr className="md:col-span-2 my-2" />
                <div><strong>Usuario (login):</strong> {viewingClient.user?.username}</div>
                <div><strong>Email (login):</strong> {viewingClient.user?.email}</div>
                <div><strong>Estado Usuario (login):</strong> {viewingClient.user?.isActive ? 'Activo' : 'Inactivo'}</div>
                <div><strong>Rol Usuario (login):</strong> <span className="capitalize">{viewingClient.user?.role?.toLowerCase()}</span></div>

                <hr className="md:col-span-2 my-2" />
                <div><strong>Estado Perfil Cliente:</strong>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full capitalize ${viewingClient.status?.toLowerCase() === 'active' || viewingClient.status?.toLowerCase() === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {viewingClient.status?.toLowerCase()}
                  </span>
                </div>
                <div><strong>Total Servicios:</strong> {viewingClient.totalServices || viewingClient._count?.services || 0}</div>
                <div><strong>Total Equipos:</strong> {viewingClient._count?.equipment || 0}</div>
                <div><strong>Total Cotizaciones:</strong> {viewingClient._count?.quotes || 0}</div>
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