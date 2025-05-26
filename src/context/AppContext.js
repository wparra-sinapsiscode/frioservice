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

  // 4. EFECTO PARA CARGAR CLIENTES DESDE LA API
  const fetchClients = useCallback(async () => { // Hacemos fetchClients accesible
    if (user?.token) {
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
      setClients([]); // Limpia los clientes si no hay token/usuario
      setIsLoadingClients(false);
    }
  }, [user]); // fetchClients depende de user

  useEffect(() => {
    fetchClients(); // Llama a fetchClients
  }, [fetchClients]); // useEffect ahora depende de la función fetchClients


  // 5. FUNCIONES CRUD PARA CLIENTES
  const addClient = useCallback(async (clientData) => {
    if (!user?.token) return;
    try {
      console.log(">>>>> DATOS ENVIADOS AL BACKEND:", JSON.stringify(clientData, null, 2));

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
        console.log("@@@ RESPUESTA COMPLETA DEL ERROR DEL BACKEND:", errorData);
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

      // CONSOLE LOGS PARA VER LA ESTRUCTURA DE newClientResponse
      console.log("✅ CLIENTE CREADO - RESPUESTA DEL BACKEND:", JSON.stringify(newClientResponse, null, 2));

      // ESTA LÍNEA ES CRUCIAL PARA ACTUALIZAR EL ESTADO
      // Asumimos que el objeto cliente real está en newClientResponse.data
      // basado en cómo tu backend devuelve las listas y objetos individuales.
      const clientToAdd = newClientResponse.data ? newClientResponse.data : newClientResponse;

      console.log("✅ CLIENTE A AÑADIR AL ESTADO:", JSON.stringify(clientToAdd, null, 2));

      if (clientToAdd && clientToAdd.id) { // Nos aseguramos que el objeto tenga un ID
        setClients(prevClients => [clientToAdd, ...prevClients]); // <-- Aquí actualizas el estado
      } else {
        console.error("El objeto clientToAdd no es válido o no tiene ID para añadirlo al estado local:", clientToAdd);
        // Como fallback, recargamos toda la lista.
        // Esto asegura que, aunque la adición optimista falle, el usuario vea el nuevo cliente.
        fetchClients();
      }
      return clientToAdd;

    } catch (error) {
      console.error("Error detallado en addClient:", error.message);
      throw error;
    }
  }, [user, fetchClients]); // Añadimos fetchClients a las dependencias

  const updateClient = useCallback(async (clientId, clientDataToUpdate) => {
    if (!user?.token) return;
    try {
      console.log(">>>>> DATOS DE ACTUALIZACIÓN ENVIADOS AL BACKEND:", JSON.stringify({ clientId, ...clientDataToUpdate }, null, 2));

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
        console.log("@@@ RESPUESTA COMPLETA DEL ERROR DEL BACKEND (UPDATE):", errorData);
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
      console.log("✅ CLIENTE ACTUALIZADO - RESPUESTA DEL BACKEND:", JSON.stringify(updatedClientResponse, null, 2));

      const clientToUpdateInState = updatedClientResponse.data ? updatedClientResponse.data : updatedClientResponse;
      console.log("✅ CLIENTE A ACTUALIZAR EN EL ESTADO:", JSON.stringify(clientToUpdateInState, null, 2));

      if (clientToUpdateInState && clientToUpdateInState.id) {
        setClients(prevClients =>
          prevClients.map(c => (c.id === clientId ? clientToUpdateInState : c))
        );
      } else {
        console.error("El objeto clientToUpdateInState no es válido o no tiene ID:", clientToUpdateInState);
        fetchClients(); 
      }
      return clientToUpdateInState;

    } catch (error) {
      console.error("Error detallado en updateClient:", error.message);
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
        // Podrías añadir el mismo manejo de error detallado
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el cliente.');
      }
      setClients(prev => prev.filter(c => c.id !== clientId));
    } catch (error) {
      console.error("Error en deleteClient:", error);
      throw error;
    }
  }, [user]);


  // 6. VALOR DEL CONTEXTO
  const contextValue = useMemo(() => ({
    clients,
    isLoadingClients,
    errorClients,
    addClient,
    updateClient,
    deleteClient,
    fetchClients // Exponemos fetchClients si queremos recargar manualmente desde algún componente
  }), [
    clients, isLoadingClients, errorClients, addClient, updateClient, deleteClient, fetchClients
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};