import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface ContextoAuthType {
  estaAutenticado: boolean;
  token: string | null;
  iniciarSesion: (usuario: string, contrasena: string) => Promise<boolean>;
  cerrarSesion: () => void;
}

const ContextoAuth = createContext<ContextoAuthType | undefined>(undefined);

export function ProveedorContextoAuth({ children }: { children: ReactNode }) {
  const [estaAutenticado, setEstaAutenticado] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const iniciarSesion = async (usuario: string, contrasena: string): Promise<boolean> => {
    try {
      const response = await axios.post('https://ciudadguaricor.onrender.com/api/auth/login', {
        username: usuario,
        password: contrasena
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setEstaAutenticado(true);
        return true;
      }
      return false;
    } catch (error) {
      setEstaAutenticado(false);
      setToken(null);
      localStorage.removeItem('token');
      return false;
    }
  };

  const cerrarSesion = () => {
    setEstaAutenticado(false);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <ContextoAuth.Provider value={{
      estaAutenticado,
      token,
      iniciarSesion,
      cerrarSesion
    }}>
      {children}
    </ContextoAuth.Provider>
  );
}

export function useContextoAuth() {
  const contexto = useContext(ContextoAuth);
  if (contexto === undefined) {
    throw new Error('useContextoAuth debe usarse dentro de ProveedorContextoAuth');
  }
  return contexto;
}