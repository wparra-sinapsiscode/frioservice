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
  useEffect(() => {
    if (user?.token) {
      const fetchClients = async () => {
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
          // Corrección para asegurar que siempre trabajemos con un array
          const clientsArray = Array.isArray(responseData.data) ? responseData.data : [];
          setClients(clientsArray);
        } catch (err) {
          setErrorClients(err.message);
        } finally {
          setIsLoadingClients(false);
        }
      };
      fetchClients();
    }
  }, [user]);


  // 5. FUNCIONES CRUD PARA CLIENTES
  
  // *** LA MODIFICACIÓN CLAVE ESTÁ AQUÍ ***
  const addClient = useCallback(async (clientData) => {
  if (!user?.token) return;
  try {
    // --- AÑADE ESTA LÍNEA AQUÍ ---
    console.log(">>>>> DATOS ENVIADOS AL BACKEND:", JSON.stringify(clientData, null, 2));
    // ----------------------------

    const response = await fetch('http://localhost:3001/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(clientData)
    });

      // --- MANEJO DE ERRORES MEJORADO ---
      // Si la respuesta es un error (como el 400 Bad Request)...
      if (!response.ok) {
        // ...leemos el cuerpo del error para obtener los detalles que envía el backend.
        const errorData = await response.json();
        
        // Formateamos los errores para que sean fáciles de leer.
        // Esto busca el array `errors` que tu middleware de validación envía.
        const errorMessages = errorData.errors
          ? errorData.errors.map(err => `${err.field}: ${err.message}`).join('\n')
          : 'El servidor no especificó el error.';

        // Lanzamos un nuevo error mucho más específico y detallado.
        throw new Error(`Datos inválidos. El servidor requiere:\n${errorMessages}`);
      }
      
      const newClient = await response.json();
      setClients(prev => [newClient, ...prev]);
      return newClient;

    } catch (error) {
      // Este catch ahora recibirá el error detallado que creamos arriba.
      console.error("Error detallado en addClient:", error.message);
      throw error;
    }
  }, [user]);

  // Las funciones de update y delete se quedan igual por ahora
  const updateClient = useCallback(async (clientId, clientData) => {
    // (Lógica de update...)
    if (!user?.token) return;
    try {
      const response = await fetch(`http://localhost:3001/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(clientData)
      });
      if (!response.ok) throw new Error('Error al actualizar el cliente.');
      const updatedClient = await response.json();
      setClients(prev => prev.map(c => (c.id === clientId ? updatedClient : c)));
      return updatedClient;
    } catch (error) {
      console.error("Error en updateClient:", error);
      throw error;
    }
  }, [user]);

  const deleteClient = useCallback(async (clientId) => {
    // (Lógica de delete...)
    if (!user?.token) return;
    try {
      await fetch(`http://localhost:3001/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
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
  }), [
    clients, isLoadingClients, errorClients, addClient, updateClient, deleteClient
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};