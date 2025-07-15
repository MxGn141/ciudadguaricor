import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContextoAuthType {
  estaAutenticado: boolean;
  iniciarSesion: (usuario: string, contrasena: string) => boolean;
  cerrarSesion: () => void;
}

const ContextoAuth = createContext<ContextoAuthType | undefined>(undefined);

export function ProveedorContextoAuth({ children }: { children: ReactNode }) {
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  const iniciarSesion = (usuario: string, contrasena: string): boolean => {
    // Credenciales simples para demo
    if (usuario === 'admin' && contrasena === 'ciudad2025') {
      setEstaAutenticado(true);
      return true;
    }
    return false;
  };

  const cerrarSesion = () => {
    setEstaAutenticado(false);
  };

  return (
    <ContextoAuth.Provider value={{
      estaAutenticado,
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