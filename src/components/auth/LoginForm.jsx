import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roleRedirects = {
    admin: '/',
    technician: '/tecnico',
    client: '/cliente'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('LoginForm: handleSubmit iniciado.');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Solo enviamos username y password. El backend determina el rol.
        body: JSON.stringify({ username, password })
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('%cLoginForm: Login API exitoso. Llamando a auth.login().', 'color: green; font-weight: bold;');
        login(responseData.data); // El contexto se actualiza con { token, user (que incluye user.role) }

        // --- ESTA ES LA LÓGICA DE REDIRECCIÓN CRÍTICA ---
        const actualUserRole = responseData.data.user.role?.toLowerCase(); // Rol desde el backend, en minúsculas

        // ---- INICIO DE LOGS DE DEPURACIÓN ADICIONALES ----
        console.log('%cLoginForm: Verificando redirección:', 'color: magenta; font-weight: bold;');
        console.log('%cLoginForm: responseData.data.user.role (original):', 'color: magenta;', responseData.data.user.role);
        console.log('%cLoginForm: actualUserRole (después de toLowerCase):', 'color: magenta;', actualUserRole);
        console.log('%cLoginForm: roleRedirects objeto:', 'color: magenta;', roleRedirects);
        console.log('%cLoginForm: Valor de roleRedirects[actualUserRole] ANTES de || \'/\':', 'color: magenta;', roleRedirects[actualUserRole]);
        // ---- FIN DE LOGS DE DEPURACIÓN ADICIONALES ----

        const redirectPath = roleRedirects[actualUserRole] || '/'; // Usa el rol del backend

        console.log(`%cLoginForm: Rol del backend: '${actualUserRole}'. Navegación inminente a: ${redirectPath}`, 'color: green; font-weight: bold;');
        navigate(redirectPath, { replace: true });
      } else {
        // Manejo específico de errores para cuentas inactivas
        if (responseData.message && responseData.message.includes('cuenta se encuentra inactiva')) {
          setError('Su cuenta se encuentra inactiva. Contacte al administrador para más información.');
        } else {
          setError(responseData.message || 'Error al iniciar sesión');
        }
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
      <div className="relative">
        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray" />
        <input
          type="text"
          id="username"
          placeholder="Usuario"
          className="w-full py-3 pl-10 pr-4 border border-gray-light rounded transition duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          disabled={loading}
          required
        />
      </div>

      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray" />
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          className="w-full py-3 pl-10 pr-4 border border-gray-light rounded transition duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
          required
        />
      </div>

      {/* El select de tipo de usuario en el formulario es solo para la UI, no se envía al backend */}
      {/* <div className="mt-2">
        <select 
          id="user-type-dropdown" // Nombre diferente para no confundir
          className="w-full p-3 border border-gray-light rounded"
          // value={userType} // Puedes manejarlo si lo necesitas para la UI
          // onChange={(e) => setUserType(e.target.value)}
          disabled={loading}
        >
          <option value="admin">Administrador</option>
          <option value="tecnico">Técnico</option>
          <option value="cliente">Cliente</option>
        </select>
      </div> 
      */}

      {error && (
        <div className="text-danger text-sm font-medium text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary py-3 font-medium"
        disabled={loading}
      >
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default LoginForm;