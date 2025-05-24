import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Credenciales básicas (simulando base de datos)
  const CREDENTIALS = {
    admin: { password: 'admin123', userType: 'admin' },
    tecnico: { password: 'tecnico123', userType: 'tecnico' },
    cliente: { password: 'cliente123', userType: 'cliente' }
  };

  // Técnicos adicionales
  const TECHNICIANS = [
    { username: 'jperez', password: '123', userType: 'tecnico' },
    { username: 'mlopez', password: '123', userType: 'tecnico' },
    { username: 'cgonzalez', password: '123', userType: 'tecnico' },
    { username: 'amartinez', password: '123', userType: 'tecnico' }
  ];

  // Clientes adicionales
  const CLIENTS = [
    { username: 'norte', password: '123', userType: 'cliente' },
    { username: 'buenamesarestaurante', password: '123', userType: 'cliente' },
    { username: 'rsanchez', password: '123', userType: 'cliente' },
    { username: 'hospitalsanjuan', password: '123', userType: 'cliente' }
  ];

  useEffect(() => {
    // Verificar sesión guardada
    const savedSession = sessionStorage.getItem('currentUser');
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        if (userData && userData.loggedIn) {
          setUser(userData);
        }
      } catch (e) {
        console.error('Error al recuperar sesión:', e);
        sessionStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password, userType) => {
    // Validar campos
    if (!username || !password) {
      return { success: false, message: 'Por favor complete usuario y contraseña' };
    }

    let credentialsValid = false;
    let userData = { username, userType };

    // Verificar credenciales predeterminadas
    if (userType in CREDENTIALS && 
        username === userType && 
        password === CREDENTIALS[userType].password) {
      credentialsValid = true;
    }
    // Verificar técnicos
    else if (userType === 'tecnico') {
      const technician = TECHNICIANS.find(t => t.username === username && t.password === password);
      if (technician) {
        credentialsValid = true;
      }
    }
    // Verificar clientes
    else if (userType === 'cliente') {
      const client = CLIENTS.find(c => c.username === username && c.password === password);
      if (client) {
        credentialsValid = true;
      }
    }

    if (credentialsValid) {
      // Guardar sesión
      const userInfo = {
        username,
        userType,
        loggedIn: true
      };
      
      sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
      setUser(userInfo);
      return { success: true };
    } else {
      return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};