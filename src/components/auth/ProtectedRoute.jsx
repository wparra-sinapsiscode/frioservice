import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import MainLayout from '../layout/MainLayout';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  // Mantenemos los logs para la prueba final
  console.log(`%cProtectedRoute: Renderizando para roles [${allowedRoles.join(', ')}]. El usuario actual es:`, 'color: orange; font-weight: bold;', user);

  if (!user) {
    console.log('%cProtectedRoute: DECISIÓN -> Usuario no existe. Redirigiendo a /login.', 'color: red; font-weight: bold;');
    return <Navigate to="/login" replace />;
  }

  // --- CAMBIO CLAVE AQUÍ ---
  // Accedemos a 'user.role' y lo convertimos a minúsculas para la comparación.
  const userRoleFromContext = user.role ? user.role.toLowerCase() : undefined;
  const isAuthorized = allowedRoles.includes(userRoleFromContext);
  // -------------------------

  console.log(`%cProtectedRoute: Rol del usuario (desde user.role): '${userRoleFromContext}'. ¿Está autorizado? -> ${isAuthorized}`, 'color: orange; font-weight: bold;');

  if (isAuthorized) {
    console.log('%cProtectedRoute: DECISIÓN -> Usuario autorizado. Renderizando <Outlet />.', 'color: green; font-weight: bold;');
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  } else {
    // --- CAMBIO EN EL LOG AQUÍ ---
    console.log(`%cProtectedRoute: DECISIÓN -> Usuario NO autorizado (Rol esperado: [${allowedRoles.join(', ')}], Rol del usuario: '${userRoleFromContext}'). Redirigiendo a /login.`, 'color: red; font-weight: bold;');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;