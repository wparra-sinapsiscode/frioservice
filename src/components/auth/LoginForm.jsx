import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password, userType);
    
    if (!result.success) {
      setError(result.message);
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
        />
      </div>
      
      <div className="mt-2">
        <select 
          id="user-type" 
          className="w-full p-3 border border-gray-light rounded transition duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="admin">Administrador</option>
          <option value="tecnico">Técnico</option>
          <option value="cliente">Cliente</option>
        </select>
      </div>
      
      {error && (
        <div className="text-danger text-sm font-medium text-center">
          {error}
        </div>
      )}
      
      <button 
        type="submit" 
        className="btn btn-primary py-3 font-medium"
      >
        Iniciar Sesión
      </button>
    </form>
  );
};

export default LoginForm;