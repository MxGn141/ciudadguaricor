import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useContextoAuth } from '../../contexts/ContextoAuth';

export default function LoginAdmin() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  
  const { estaAutenticado, iniciarSesion } = useContextoAuth();

  if (estaAutenticado) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const exito = iniciarSesion(usuario, contrasena);
      if (!exito) {
        setError('Credenciales incorrectas');
        setAnimateError(true);
        setTimeout(() => setAnimateError(false), 500);
      }
    } catch (err) {
      setError('Error al iniciar sesión');
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 500);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Círculos decorativos */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-100 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-green-100 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
        
        <div className="bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          {/* Línea decorativa superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#4CAF50]" />
          
          <div className="text-center">
            <img 
              src="/logo-admin.png" 
              alt="Logo Admin" 
              className="mx-auto h-16 w-auto mb-6 transform transition-transform duration-700 hover:scale-110"
            />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
              Panel Administrativo
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Ciudad Guárico
            </p>
          </div>

          <form onSubmit={manejarSubmit} className="space-y-6">
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-shadow duration-300"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
            </div>

            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="contrasena"
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-shadow duration-300"
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div 
                className={`bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center ${
                  animateError ? 'animate-shake' : ''
                }`}
              >
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
            >
              {cargando ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-1">Credenciales de prueba:</p>
            <div className="space-y-1 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">
                Usuario: <span className="font-mono text-[#4CAF50]">admin</span>
              </p>
              <p className="text-sm">
                Contraseña: <span className="font-mono text-[#4CAF50]">ciudad2025</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}