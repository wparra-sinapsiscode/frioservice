import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="bg-gradient-to-br from-primary/80 to-primary-dark/90 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-10 bg-white rounded shadow-lg text-center">
        <div className="mb-8">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwNzdjYyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMyAxOWEyIDIgMCAwIDEtMiAySDNhMiAyIDAgMCAxLTItMlY4YTIgMiAwIDAgMSAyLTJoNGwyLTNoNmwyIDNoNGEyIDIgMCAwIDEgMiAyeiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTMiIHI9IjQiLz48L3N2Zz4=" 
            alt="Logo FríoService" 
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">FríoService</h1>
          <p className="text-gray">Sistema de Gestión de Servicios Técnicos</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;