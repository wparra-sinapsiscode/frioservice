import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
// 1. IMPORTAMOS useAuth para obtener el token
import { useAuth } from '../hooks/useAuth';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 2. OBTENEMOS EL USUARIO Y SU TOKEN
  const { user } = useAuth();

  // 3. ESTADOS PARA CLIENTES
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [errorClients, setErrorClients] = useState(null);

  // 3.1. ESTADOS PARA TÉCNICOS
  const [technicians, setTechnicians] = useState([]);
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(true);
  const [errorTechnicians, setErrorTechnicians] = useState(null);

  // 3.2. ESTADOS PARA COTIZACIONES
  const [quotes, setQuotes] = useState([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
  const [errorQuotes, setErrorQuotes] = useState(null);

  // 3.3. ESTADOS PARA SERVICIOS
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState(null);

  // 3.4. ESTADOS PARA EQUIPOS
  const [equipment, setEquipment] = useState([]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [errorEquipment, setErrorEquipment] = useState(null);

  // 3.5. ESTADOS PARA ESTADÍSTICAS DEL DASHBOARD
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [errorDashboard, setErrorDashboard] = useState(null);

  // 3.6. ESTADOS PARA ESTADÍSTICAS DE SERVICIOS
  const [serviceStats, setServiceStats] = useState(null);
  const [isLoadingServiceStats, setIsLoadingServiceStats] = useState(false);
  const [errorServiceStats, setErrorServiceStats] = useState(null);

  // 3.7. ESTADOS PARA RANKINGS DE TÉCNICOS E INGRESOS
  const [technicianRankings, setTechnicianRankings] = useState(null);
  const [incomeStats, setIncomeStats] = useState(null);
  const [servicesByEquipment, setServicesByEquipment] = useState(null);
  const [isLoadingTechnicianRankings, setIsLoadingTechnicianRankings] = useState(false);
  const [isLoadingIncomeStats, setIsLoadingIncomeStats] = useState(false);
  const [isLoadingServicesByEquipment, setIsLoadingServicesByEquipment] = useState(false);
  const [errorTechnicianRankings, setErrorTechnicianRankings] = useState(null);
  const [errorIncomeStats, setErrorIncomeStats] = useState(null);
  const [errorServicesByEquipment, setErrorServicesByEquipment] = useState(null);

  // 4. EFECTO PARA CARGAR CLIENTES DESDE LA API (Solo para ADMIN y TECHNICIAN)
  const fetchClients = useCallback(async () => { // Hacemos fetchClients accesible
    // Solo cargar clientes si el usuario NO es CLIENT (por seguridad)
    if (user?.token && user?.role !== 'CLIENT') {
      setIsLoadingClients(true);
      setErrorClients(null);
      try {
        const response = await fetch('http://localhost:3001/api/clients', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de clientes.');
        }
        const responseData = await response.json();
        const clientsArray = Array.isArray(responseData.data) ? responseData.data : [];
        setClients(clientsArray);
      } catch (err) {
        setErrorClients(err.message);
      } finally {
        setIsLoadingClients(false);
      }
    } else {
      // Para CLIENTs o sin token, no cargar lista de clientes (por seguridad)
      setClients([]);
      setIsLoadingClients(false);
      setErrorClients(null);
    }
  }, [user]); // fetchClients depende de user

  useEffect(() => {
    fetchClients(); // Llama a fetchClients
  }, [fetchClients]); // useEffect ahora depende de la función fetchClients

  // 4.1. EFECTO PARA CARGAR TÉCNICOS DESDE LA API
  const WorkspaceTechnicians = useCallback(async () => {
    if (user?.token) {
      setIsLoadingTechnicians(true);
      setErrorTechnicians(null);
      try {
        const response = await fetch('http://localhost:3001/api/technicians', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 403) {
          throw new Error(`Acceso denegado: No tienes permisos para ver técnicos. Tu rol actual es: ${user?.role || 'desconocido'}. Se requiere rol ADMIN.`);
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No se pudo obtener la lista de técnicos.'}`);
        }
        const responseData = await response.json();
        // Extraer técnicos basándose en la estructura del backend (igual que clientes)
        const techniciansArray = Array.isArray(responseData.data) ? responseData.data : [];
        setTechnicians(techniciansArray);
      } catch (err) {
        setErrorTechnicians(err.message);
      } finally {
        setIsLoadingTechnicians(false);
      }
    } else {
      setTechnicians([]); // Limpia los técnicos si no hay token/usuario
      setIsLoadingTechnicians(false);
    }
  }, [user]); // WorkspaceTechnicians depende de user

  useEffect(() => {
    WorkspaceTechnicians(); // Llama a WorkspaceTechnicians
  }, [WorkspaceTechnicians]); // useEffect ahora depende de la función WorkspaceTechnicians

  // 4.2. EFECTO PARA CARGAR COTIZACIONES DESDE LA API
  const fetchQuotes = useCallback(async (filters = {}) => {
    if (user?.token) {
      setIsLoadingQuotes(true);
      setErrorQuotes(null);
      try {
        // Construir query parameters para filtros
        const queryParams = new URLSearchParams();
        if (filters.status && filters.status !== 'todos') queryParams.append('status', filters.status.toUpperCase());
        if (filters.clientId) queryParams.append('clientId', filters.clientId);
        if (filters.serviceId) queryParams.append('serviceId', filters.serviceId);
        
        const queryString = queryParams.toString();
        const url = `http://localhost:3001/api/quotes${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 403) {
          throw new Error(`Acceso denegado: No tienes permisos para ver cotizaciones. Tu rol actual es: ${user?.role || 'desconocido'}`);
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No se pudo obtener la lista de cotizaciones.'}`);
        }
        const responseData = await response.json();
        // Extraer cotizaciones basándose en la estructura del backend
        const quotesArray = Array.isArray(responseData.data) ? responseData.data : [];
        setQuotes(quotesArray);
      } catch (err) {
        setErrorQuotes(err.message);
      } finally {
        setIsLoadingQuotes(false);
      }
    } else {
      setQuotes([]); // Limpia las cotizaciones si no hay token/usuario
      setIsLoadingQuotes(false);
    }
  }, [user]); // fetchQuotes depende de user

  useEffect(() => {
    fetchQuotes(); // Llama a fetchQuotes
  }, [fetchQuotes]); // useEffect ahora depende de la función fetchQuotes

  // 4.3. EFECTO PARA CARGAR SERVICIOS DESDE LA API
  const fetchServices = useCallback(async (filters = {}) => {
    if (user?.token) {
      setIsLoadingServices(true);
      setErrorServices(null);
      try {
        // Construir query parameters para filtros
        const queryParams = new URLSearchParams();
        if (filters.status && filters.status !== 'todos') queryParams.append('status', filters.status.toUpperCase());
        if (filters.type && filters.type !== 'todos') queryParams.append('type', filters.type.toUpperCase());
        if (filters.priority && filters.priority !== 'todos') queryParams.append('priority', filters.priority.toUpperCase());
        if (filters.clientId) queryParams.append('clientId', filters.clientId);
        if (filters.technicianId) queryParams.append('technicianId', filters.technicianId);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        
        const queryString = queryParams.toString();
        const url = `http://localhost:3001/api/services${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de servicios.');
        }
        const responseData = await response.json();
        // Extraer servicios basándose en la estructura del backend
        const servicesArray = Array.isArray(responseData.data) ? responseData.data : [];
        setServices(servicesArray);
      } catch (err) {
        setErrorServices(err.message);
      } finally {
        setIsLoadingServices(false);
      }
    } else {
      setServices([]); // Limpia los servicios si no hay token/usuario
      setIsLoadingServices(false);
    }
  }, [user]); // fetchServices depende de user

  useEffect(() => {
    fetchServices(); // Llama a fetchServices
  }, [fetchServices]); // useEffect ahora depende de la función fetchServices

  // 4.4. EFECTO PARA CARGAR EQUIPOS DESDE LA API
  const fetchEquipment = useCallback(async (filters = {}) => {
    if (user?.token) {
      setIsLoadingEquipment(true);
      setErrorEquipment(null);
      try {
        // Construir query parameters para filtros
        const queryParams = new URLSearchParams();
        if (filters.clientId) queryParams.append('clientId', filters.clientId);
        if (filters.status && filters.status !== 'todos') queryParams.append('status', filters.status.toUpperCase());
        if (filters.type && filters.type !== 'todos') queryParams.append('type', filters.type);
        if (filters.brand && filters.brand !== 'todos') queryParams.append('brand', filters.brand);
        
        const queryString = queryParams.toString();
        const url = `http://localhost:3001/api/equipment${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de equipos.');
        }
        const responseData = await response.json();
        // Extraer equipos basándose en la estructura del backend
        const equipmentArray = Array.isArray(responseData.data) ? responseData.data : [];
        setEquipment(equipmentArray);
      } catch (err) {
        setErrorEquipment(err.message);
      } finally {
        setIsLoadingEquipment(false);
      }
    } else {
      setEquipment([]); // Limpia los equipos si no hay token/usuario
      setIsLoadingEquipment(false);
    }
  }, [user]); // fetchEquipment depende de user

  useEffect(() => {
    fetchEquipment(); // Llama a fetchEquipment
  }, [fetchEquipment]); // useEffect ahora depende de la función fetchEquipment


  // 5. FUNCIONES CRUD PARA CLIENTES
  const addClient = useCallback(async (clientData) => {
    if (!user?.token) return;
    try {
      const response = await fetch('http://localhost:3001/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(clientData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo en la operación. El servidor dice:\n${detailedErrorMessage}`);
      }

      // Si la creación fue exitosa (ej. response.status === 201)
      const newClientResponse = await response.json();

      // Asumimos que el objeto cliente real está en newClientResponse.data
      // basado en cómo el backend devuelve las listas y objetos individuales.
      const clientToAdd = newClientResponse.data ? newClientResponse.data : newClientResponse;

      if (clientToAdd && clientToAdd.id) { // Nos aseguramos que el objeto tenga un ID
        setClients(prevClients => [clientToAdd, ...prevClients]); // <-- Aquí actualizas el estado
      } else {
        // Como fallback, recargamos toda la lista.
        // Esto asegura que, aunque la adición optimista falle, el usuario vea el nuevo cliente.
        fetchClients();
      }
      return clientToAdd;

    } catch (error) {
      throw error;
    }
  }, [user, fetchClients]); // Añadimos fetchClients a las dependencias

  const updateClient = useCallback(async (clientId, clientDataToUpdate) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(clientDataToUpdate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo al actualizar. El servidor dice:\n${detailedErrorMessage}`);
      }

      const updatedClientResponse = await response.json();
      const clientToUpdateInState = updatedClientResponse.data ? updatedClientResponse.data : updatedClientResponse;

      if (clientToUpdateInState && clientToUpdateInState.id) {
        setClients(prevClients =>
          prevClients.map(c => (c.id === clientId ? clientToUpdateInState : c))
        );
      } else {
        fetchClients(); 
      }
      return clientToUpdateInState;

    } catch (error) {
      throw error;
    }
  }, [user, fetchClients]); 

  const deleteClient = useCallback(async (clientId) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el cliente.');
      }
      setClients(prev => prev.filter(c => c.id !== clientId));
    } catch (error) {
      throw error;
    }
  }, [user]);

  const updateClientStatus = useCallback(async (clientId, newStatus) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/clients/${clientId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          status: newStatus ? 'ACTIVE' : 'INACTIVE' 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estado');
      }

      const updatedClientResponse = await response.json();
      
      // Actualizar estado local optimísticamente
      setClients(prevClients =>
        prevClients.map(c => 
          c.id === clientId 
            ? { ...c, status: newStatus ? 'ACTIVE' : 'INACTIVE' }
            : c
        )
      );
      
      return updatedClientResponse;
    } catch (error) {
      throw error;
    }
  }, [user]);

  // 5.1. FUNCIONES CRUD PARA TÉCNICOS
  const addTechnician = useCallback(async (technicianData) => {
    if (!user?.token) return;
    try {
      const response = await fetch('http://localhost:3001/api/technicians', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(technicianData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo en la operación. El servidor dice:\n${detailedErrorMessage}`);
      }

      const newTechnicianResponse = await response.json();

      // El backend devuelve directamente el técnico creado
      const technicianToAdd = newTechnicianResponse.data ? newTechnicianResponse.data : newTechnicianResponse;

      if (technicianToAdd && technicianToAdd.id) {
        setTechnicians(prevTechnicians => [technicianToAdd, ...prevTechnicians]);
      } else {
        WorkspaceTechnicians(); // Recarga la lista como fallback
      }
      return technicianToAdd;

    } catch (error) {
      throw error;
    }
  }, [user, WorkspaceTechnicians]);

  const updateTechnician = useCallback(async (technicianId, technicianDataToUpdate) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/technicians/${technicianId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(technicianDataToUpdate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo al actualizar. El servidor dice:\n${detailedErrorMessage}`);
      }

      const updatedTechnicianResponse = await response.json();

      const technicianToUpdateInState = updatedTechnicianResponse.data ? updatedTechnicianResponse.data : updatedTechnicianResponse;

      if (technicianToUpdateInState && technicianToUpdateInState.id) {
        setTechnicians(prevTechnicians =>
          prevTechnicians.map(t => (t.id === technicianId ? technicianToUpdateInState : t))
        );
      } else {
        WorkspaceTechnicians(); // Recarga como fallback
      }
      return technicianToUpdateInState;

    } catch (error) {
      throw error;
    }
  }, [user, WorkspaceTechnicians]);

  const deleteTechnician = useCallback(async (technicianId) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/technicians/${technicianId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el técnico.');
      }
      setTechnicians(prev => prev.filter(t => t.id !== technicianId));
    } catch (error) {
      throw error;
    }
  }, [user]);

  // 5.2. FUNCIONES CRUD PARA COTIZACIONES
  const addQuote = useCallback(async (quoteData) => {
    if (!user?.token) return;
    try {
      const response = await fetch('http://localhost:3001/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(quoteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo en la operación. El servidor dice:\n${detailedErrorMessage}`);
      }

      const newQuoteResponse = await response.json();

      // El backend devuelve directamente la cotización creada
      const quoteToAdd = newQuoteResponse.data ? newQuoteResponse.data : newQuoteResponse;

      if (quoteToAdd && quoteToAdd.id) {
        setQuotes(prevQuotes => [quoteToAdd, ...prevQuotes]);
      } else {
        fetchQuotes(); // Recarga la lista como fallback
      }
      return quoteToAdd;

    } catch (error) {
      throw error;
    }
  }, [user, fetchQuotes]);

  const updateQuote = useCallback(async (quoteId, quoteDataToUpdate) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(quoteDataToUpdate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo al actualizar. El servidor dice:\n${detailedErrorMessage}`);
      }

      const updatedQuoteResponse = await response.json();

      const quoteToUpdateInState = updatedQuoteResponse.data ? updatedQuoteResponse.data : updatedQuoteResponse;

      if (quoteToUpdateInState && quoteToUpdateInState.id) {
        setQuotes(prevQuotes =>
          prevQuotes.map(q => (q.id === quoteId ? quoteToUpdateInState : q))
        );
      } else {
        fetchQuotes(); // Recarga como fallback
      }
      return quoteToUpdateInState;

    } catch (error) {
      throw error;
    }
  }, [user, fetchQuotes]);

  const deleteQuote = useCallback(async (quoteId) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la cotización.');
      }
      setQuotes(prev => prev.filter(q => q.id !== quoteId));
    } catch (error) {
      throw error;
    }
  }, [user]);

  const approveQuote = useCallback(async (quoteId, notes = '') => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/quotes/${quoteId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al aprobar cotización');
      }

      const updatedQuoteResponse = await response.json();
      
      // Actualizar estado local
      const quoteToUpdate = updatedQuoteResponse.data ? updatedQuoteResponse.data : updatedQuoteResponse;
      setQuotes(prevQuotes =>
        prevQuotes.map(q => 
          q.id === quoteId ? quoteToUpdate : q
        )
      );
      
      return updatedQuoteResponse;
    } catch (error) {
      throw error;
    }
  }, [user]);

  const rejectQuote = useCallback(async (quoteId, notes = '') => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/quotes/${quoteId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al rechazar cotización');
      }

      const updatedQuoteResponse = await response.json();
      
      // Actualizar estado local
      const quoteToUpdate = updatedQuoteResponse.data ? updatedQuoteResponse.data : updatedQuoteResponse;
      setQuotes(prevQuotes =>
        prevQuotes.map(q => 
          q.id === quoteId ? quoteToUpdate : q
        )
      );
      
      return updatedQuoteResponse;
    } catch (error) {
      throw error;
    }
  }, [user]);

  // 5.3. FUNCIONES CRUD PARA SERVICIOS
  const addService = useCallback(async (serviceData) => {
    if (!user?.token) return;
    try {
      // Preparar datos para envío - para CLIENTs quitar clientId (se asigna automáticamente en backend)
      const dataToSend = {...serviceData};
      if (user?.role === 'CLIENT' && 'clientId' in dataToSend) {
        delete dataToSend.clientId;
      }
      
      const response = await fetch('http://localhost:3001/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo en la operación. El servidor dice:\n${detailedErrorMessage}`);
      }

      const newServiceResponse = await response.json();

      // El backend devuelve directamente el servicio creado
      const serviceToAdd = newServiceResponse.data ? newServiceResponse.data : newServiceResponse;

      if (serviceToAdd && serviceToAdd.id) {
        setServices(prevServices => [serviceToAdd, ...prevServices]);
      } else {
        fetchServices(); // Recarga la lista como fallback
      }
      return serviceToAdd;

    } catch (error) {
      throw error;
    }
  }, [user, fetchServices]);

  const updateService = useCallback(async (serviceId, serviceDataToUpdate) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(serviceDataToUpdate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo al actualizar. El servidor dice:\n${detailedErrorMessage}`);
      }

      const updatedServiceResponse = await response.json();

      const serviceToUpdateInState = updatedServiceResponse.data ? updatedServiceResponse.data : updatedServiceResponse;

      if (serviceToUpdateInState && serviceToUpdateInState.id) {
        setServices(prevServices =>
          prevServices.map(s => (s.id === serviceId ? serviceToUpdateInState : s))
        );
      } else {
        fetchServices(); // Recarga como fallback
      }
      return serviceToUpdateInState;

    } catch (error) {
      throw error;
    }
  }, [user, fetchServices]);

  const deleteService = useCallback(async (serviceId) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el servicio.');
      }
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (error) {
      throw error;
    }
  }, [user]);

  // Funciones especiales para servicios
  const assignTechnician = useCallback(async (serviceId, technicianId) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/services/${serviceId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ technicianId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al asignar técnico');
      }

      const updatedServiceResponse = await response.json();
      
      // Actualizar estado local
      const serviceToUpdate = updatedServiceResponse.data ? updatedServiceResponse.data : updatedServiceResponse;
      setServices(prevServices =>
        prevServices.map(s => 
          s.id === serviceId ? serviceToUpdate : s
        )
      );
      
      return updatedServiceResponse;
    } catch (error) {
      throw error;
    }
  }, [user]);

  const completeService = useCallback(async (serviceId, completionData) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/services/${serviceId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(completionData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || `Error ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
      }

      const updatedServiceResponse = await response.json();
      
      // Actualizar estado local
      const serviceToUpdate = updatedServiceResponse.data ? updatedServiceResponse.data : updatedServiceResponse;
      setServices(prevServices =>
        prevServices.map(s => 
          s.id === serviceId ? serviceToUpdate : s
        )
      );
      
      return updatedServiceResponse;
    } catch (error) {
      throw error;
    }
  }, [user]);

  const updateServiceStatus = useCallback(async (serviceId, newStatus) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estado');
      }

      const updatedServiceResponse = await response.json();
      
      // Actualizar estado local
      const serviceToUpdate = updatedServiceResponse.data ? updatedServiceResponse.data : updatedServiceResponse;
      setServices(prevServices =>
        prevServices.map(s => 
          s.id === serviceId ? serviceToUpdate : s
        )
      );
      
      return updatedServiceResponse;
    } catch (error) {
      throw error;
    }
  }, [user]);

  // 5.3. FUNCIONES CRUD PARA EQUIPOS
  const addEquipment = useCallback(async (equipmentData) => {
    if (!user?.token) return;
    try {
      // Preparar datos para envío - para CLIENTs quitar clientId (se asigna automáticamente en backend)
      const dataToSend = {...equipmentData};
      if (user?.role === 'CLIENT' && 'clientId' in dataToSend) {
        delete dataToSend.clientId;
      }
      
      const response = await fetch('http://localhost:3001/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo en la operación. El servidor dice:\n${detailedErrorMessage}`);
      }

      const newEquipmentResponse = await response.json();

      // El backend devuelve directamente el equipo creado
      const equipmentToAdd = newEquipmentResponse.data ? newEquipmentResponse.data : newEquipmentResponse;

      if (equipmentToAdd && equipmentToAdd.id) {
        setEquipment(prevEquipment => [equipmentToAdd, ...prevEquipment]);
      } else {
        fetchEquipment(); // Recarga la lista como fallback
      }
      return equipmentToAdd;

    } catch (error) {
      throw error;
    }
  }, [user, fetchEquipment]);

  const updateEquipment = useCallback(async (equipmentId, equipmentDataToUpdate) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/equipment/${equipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(equipmentDataToUpdate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let detailedErrorMessage = 'El servidor no especificó el error.';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          detailedErrorMessage = errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        } else if (errorData.message) {
          detailedErrorMessage = errorData.message;
        } else if (errorData.error) {
          detailedErrorMessage = `Error: ${errorData.error}`;
        }
        throw new Error(`Fallo al actualizar. El servidor dice:\n${detailedErrorMessage}`);
      }

      const updatedEquipmentResponse = await response.json();

      const equipmentToUpdateInState = updatedEquipmentResponse.data ? updatedEquipmentResponse.data : updatedEquipmentResponse;

      if (equipmentToUpdateInState && equipmentToUpdateInState.id) {
        setEquipment(prevEquipment =>
          prevEquipment.map(e => (e.id === equipmentId ? equipmentToUpdateInState : e))
        );
      } else {
        fetchEquipment(); // Recarga como fallback
      }
      return equipmentToUpdateInState;

    } catch (error) {
      throw error;
    }
  }, [user, fetchEquipment]);

  const deleteEquipment = useCallback(async (equipmentId) => {
    if (!user?.token) return;
    try {
      const url = `http://localhost:3001/api/equipment/${equipmentId}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el equipo.');
      }
      
      const successData = await response.json();
      setEquipment(prev => prev.filter(e => e.id !== equipmentId));
    } catch (error) {
      throw error;
    }
  }, [user]);

  const updateEquipmentStatus = useCallback(async (equipmentId, newStatus) => {
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/equipment/${equipmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          status: newStatus.toUpperCase() // ACTIVE, INACTIVE, MAINTENANCE, BROKEN
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar estado del equipo');
      }

      const updatedEquipmentResponse = await response.json();
      
      // Actualizar estado local optimísticamente
      setEquipment(prevEquipment =>
        prevEquipment.map(e => 
          e.id === equipmentId 
            ? { ...e, status: newStatus.toUpperCase() }
            : e
        )
      );
      
      return updatedEquipmentResponse;
    } catch (error) {
      throw error;
    }
  }, [user]);

  // 5.4. FUNCIONES PARA ESTADÍSTICAS
  const fetchDashboardStats = useCallback(async () => {
    // Solo cargar estadísticas si el usuario es ADMIN
    if (user?.token && user?.role === 'ADMIN') {
      setIsLoadingDashboard(true);
      setErrorDashboard(null);
      try {
        const response = await fetch('http://localhost:3001/api/stats/dashboard', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No se pudieron obtener las estadísticas del dashboard.'}`);
        }
        
        const responseData = await response.json();
        
        const statsData = responseData.data || responseData;
        setDashboardStats(statsData);
        
      } catch (err) {
        setErrorDashboard(err.message);
      } finally {
        setIsLoadingDashboard(false);
      }
    } else {
      // Para no-ADMINs, limpiar estadísticas
      setDashboardStats(null);
      setIsLoadingDashboard(false);
      setErrorDashboard(null);
    }
  }, [user]);

  const fetchServiceStats = useCallback(async (filters = {}) => {
    if (user?.token && user?.role === 'ADMIN') {
      setIsLoadingServiceStats(true);
      setErrorServiceStats(null);
      try {
        // Construir query parameters para filtros
        const queryParams = new URLSearchParams();
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.technicianId) queryParams.append('technicianId', filters.technicianId);
        if (filters.clientId) queryParams.append('clientId', filters.clientId);
        
        const queryString = queryParams.toString();
        const url = `http://localhost:3001/api/stats/services${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No se pudieron obtener las estadísticas de servicios.'}`);
        }
        
        const responseData = await response.json();
        
        const statsData = responseData.data || responseData;
        setServiceStats(statsData);
        
      } catch (err) {
        setErrorServiceStats(err.message);
      } finally {
        setIsLoadingServiceStats(false);
      }
    } else {
      setServiceStats(null);
      setIsLoadingServiceStats(false);
      setErrorServiceStats(null);
    }
  }, [user]);

  const fetchIncomeStats = useCallback(async (period = 'month') => {
    if (user?.token && user?.role === 'ADMIN') {
      setIsLoadingIncomeStats(true);
      setErrorIncomeStats(null);
      try {
        const response = await fetch(`http://localhost:3001/api/stats/income?period=${period}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No se pudieron obtener las estadísticas de ingresos.'}`);
        }
        
        const responseData = await response.json();
        
        const statsData = responseData.data || responseData;
        setIncomeStats(statsData);
        
      } catch (err) {
        setErrorIncomeStats(err.message);
      } finally {
        setIsLoadingIncomeStats(false);
      }
    } else {
      setIncomeStats(null);
      setIsLoadingIncomeStats(false);
      setErrorIncomeStats(null);
    }
  }, [user]);

  const fetchTechnicianRankings = useCallback(async () => {
    if (user?.token && user?.role === 'ADMIN') {
      setIsLoadingTechnicianRankings(true);
      setErrorTechnicianRankings(null);
      try {
        const response = await fetch('http://localhost:3001/api/stats/technicians/rankings', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No se pudieron obtener los rankings de técnicos.'}`);
        }
        
        const responseData = await response.json();
        
        const statsData = responseData.data || responseData;
        setTechnicianRankings(statsData);
        
      } catch (err) {
        setErrorTechnicianRankings(err.message);
      } finally {
        setIsLoadingTechnicianRankings(false);
      }
    } else {
      setTechnicianRankings(null);
      setIsLoadingTechnicianRankings(false);
      setErrorTechnicianRankings(null);
    }
  }, [user]);

  const fetchServicesByEquipment = useCallback(async () => {
    if (user?.token && user?.role === 'ADMIN') {
      setIsLoadingServicesByEquipment(true);
      setErrorServicesByEquipment(null);
      try {
        const response = await fetch('http://localhost:3001/api/stats/services/by-equipment', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No se pudieron obtener los servicios por equipo.'}`);
        }
        
        const responseData = await response.json();
        
        const statsData = responseData.data || responseData;
        setServicesByEquipment(statsData);
        
      } catch (err) {
        setErrorServicesByEquipment(err.message);
      } finally {
        setIsLoadingServicesByEquipment(false);
      }
    } else {
      setServicesByEquipment(null);
      setIsLoadingServicesByEquipment(false);
      setErrorServicesByEquipment(null);
    }
  }, [user]);


  // 6. VALOR DEL CONTEXTO
  const contextValue = useMemo(() => ({
    // Estados y funciones de clientes
    clients,
    isLoadingClients,
    errorClients,
    addClient,
    updateClient,
    deleteClient,
    updateClientStatus,
    fetchClients, // Exponemos fetchClients si queremos recargar manualmente desde algún componente
    
    // Estados y funciones de técnicos
    technicians,
    isLoadingTechnicians,
    errorTechnicians,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    WorkspaceTechnicians, // Exponemos WorkspaceTechnicians para recargar manualmente

    // Estados y funciones de cotizaciones
    quotes,
    isLoadingQuotes,
    errorQuotes,
    addQuote,
    updateQuote,
    deleteQuote,
    approveQuote,
    rejectQuote,
    fetchQuotes, // Exponemos fetchQuotes para recargar manualmente con filtros

    // Estados y funciones de servicios
    services,
    isLoadingServices,
    errorServices,
    addService,
    updateService,
    deleteService,
    assignTechnician,
    completeService,
    updateServiceStatus,
    fetchServices, // Exponemos fetchServices para recargar manualmente con filtros

    // Estados y funciones de equipos
    equipment,
    isLoadingEquipment,
    errorEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    updateEquipmentStatus,
    fetchEquipment, // Exponemos fetchEquipment para recargar manualmente con filtros

    // Estados y funciones de estadísticas
    dashboardStats,
    isLoadingDashboard,
    errorDashboard,
    fetchDashboardStats,
    serviceStats,
    isLoadingServiceStats,
    errorServiceStats,
    fetchServiceStats,
    incomeStats,
    isLoadingIncomeStats,
    errorIncomeStats,
    fetchIncomeStats,
    technicianRankings,
    isLoadingTechnicianRankings,
    errorTechnicianRankings,
    fetchTechnicianRankings,
    servicesByEquipment,
    isLoadingServicesByEquipment,
    errorServicesByEquipment,
    fetchServicesByEquipment
  }), [
    clients, isLoadingClients, errorClients, addClient, updateClient, deleteClient, updateClientStatus, fetchClients,
    technicians, isLoadingTechnicians, errorTechnicians, addTechnician, updateTechnician, deleteTechnician, WorkspaceTechnicians,
    quotes, isLoadingQuotes, errorQuotes, addQuote, updateQuote, deleteQuote, approveQuote, rejectQuote, fetchQuotes,
    services, isLoadingServices, errorServices, addService, updateService, deleteService, assignTechnician, completeService, updateServiceStatus, fetchServices,
    equipment, isLoadingEquipment, errorEquipment, addEquipment, updateEquipment, deleteEquipment, updateEquipmentStatus, fetchEquipment,
    dashboardStats, isLoadingDashboard, errorDashboard, fetchDashboardStats,
    serviceStats, isLoadingServiceStats, errorServiceStats, fetchServiceStats,
    incomeStats, isLoadingIncomeStats, errorIncomeStats, fetchIncomeStats,
    technicianRankings, isLoadingTechnicianRankings, errorTechnicianRankings, fetchTechnicianRankings,
    servicesByEquipment, isLoadingServicesByEquipment, errorServicesByEquipment, fetchServicesByEquipment
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};