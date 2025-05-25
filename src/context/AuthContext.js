import React, { createContext, useState, useEffect, useMemo } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: useEffect revisando sesión...');
    const savedSession = sessionStorage.getItem('currentUser');
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        setUser(userData);
      } catch (e) {
        sessionStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    console.log('%cAuthContext: La función login() ha sido llamada con:', 'color: blue; font-weight: bold;', data);
    const userInfo = {
      ...data.user,
      token: data.token,
      loggedIn: true
    };
    sessionStorage.setItem('currentUser', JSON.stringify(userInfo));
    setUser(userInfo);
    console.log('%cAuthContext: ¡Estado de user actualizado!', 'color: blue; font-weight: bold;');
  };

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      loading
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};