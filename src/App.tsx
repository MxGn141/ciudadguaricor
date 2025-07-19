import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorContextoNoticias } from './contexts/ContextoNoticias';
import { ProveedorContextoAuth } from './contexts/ContextoAuth';
import { ProveedorContextoContenido } from './contexts/ContextoContenido';
import LayoutPublico from './components/layout/LayoutPublico';
import PaginaPrincipal from './pages/PaginaPrincipal';
import VistaNoticia from './pages/VistaNoticia';
import PaginaSeccion from './pages/PaginaSeccion';
import LoginAdmin from './pages/admin/LoginAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionarPublicidad from './pages/admin/GestionarPublicidad';

export default function App() {
  return (
    <ProveedorContextoAuth>
      <ProveedorContextoNoticias>
        <ProveedorContextoContenido>
          <Router>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<LayoutPublico />}>
                <Route index element={<PaginaPrincipal />} />
                <Route path="seccion/:seccion" element={<PaginaSeccion />} />
                <Route path="noticia/:id" element={<VistaNoticia />} />
              </Route>
              
              {/* Rutas de administración */}
              <Route path="/admin/login" element={<LoginAdmin />} />
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              <Route path="/admin/publicidad" element={<GestionarPublicidad />} />
            </Routes>
          </Router>
        </ProveedorContextoContenido>
      </ProveedorContextoNoticias>
    </ProveedorContextoAuth>
  );
}