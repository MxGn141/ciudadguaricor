import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorContextoNoticias } from './contexts/ContextoNoticias';
import { ProveedorContextoAuth } from './contexts/ContextoAuth';
import LayoutPublico from './components/layout/LayoutPublico';
import PaginaPrincipal from './pages/PaginaPrincipal';
import VistaNoticia from './pages/VistaNoticia';
import PaginaSeccion from './pages/PaginaSeccion';
import LoginAdmin from './pages/admin/LoginAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';

export default function App() {
  return (
    <ProveedorContextoAuth>
      <ProveedorContextoNoticias>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<LayoutPublico />}>
              <Route index element={<PaginaPrincipal />} />
              <Route path="seccion/:seccion" element={<PaginaSeccion />} />
            </Route>
            
            {/* Vista individual de noticia (sin sidebar) */}
            <Route path="/noticia/:id" element={<VistaNoticia />} />
            
            {/* Rutas de administración */}
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          </Routes>
        </Router>
      </ProveedorContextoNoticias>
    </ProveedorContextoAuth>
  );
}