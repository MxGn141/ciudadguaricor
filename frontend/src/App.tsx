import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorContextoNoticias } from './contexts/ContextoNoticias';
import { ProveedorContextoAuth } from './contexts/ContextoAuth';
import LayoutPublico from './components/layout/LayoutPublico';
import PaginaPrincipal from './pages/PaginaPrincipal';
import VistaNoticia from './pages/VistaNoticia';
import PaginaSeccion from './pages/PaginaSeccion';
import ResultadosBusqueda from './pages/ResultadosBusqueda';
import LoginAdmin from './pages/admin/LoginAdmin';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionarContenidoDestacado from './pages/admin/GestionarPublicidad';

const Opinion = React.lazy(() => import('./pages/Opinion'));
const OpinionEditoriales = React.lazy(() => import('./pages/OpinionEditoriales'));
const OpinionColumnistas = React.lazy(() => import('./pages/OpinionColumnistas'));
const OpinionDetalleEditorial = React.lazy(() => import('./pages/OpinionDetalleEditorial'));
const OpinionDetalleColumnista = React.lazy(() => import('./pages/OpinionDetalleColumnista'));




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
                <Route path="noticia/:id" element={<VistaNoticia />} />
                <Route path="buscar" element={<ResultadosBusqueda />} />
                {/* Opinión */}
                <Route path="opinion" element={<React.Suspense fallback={null}><Opinion /></React.Suspense>} />
                <Route path="opinion/editoriales" element={<React.Suspense fallback={null}><OpinionEditoriales /></React.Suspense>} />
                <Route path="opinion/columnistas" element={<React.Suspense fallback={null}><OpinionColumnistas /></React.Suspense>} />
                <Route path="opinion/editoriales/:id" element={<React.Suspense fallback={null}><OpinionDetalleEditorial /></React.Suspense>} />
                <Route path="opinion/columnistas/:id" element={<React.Suspense fallback={null}><OpinionDetalleColumnista /></React.Suspense>} />
              </Route>
              
              {/* Rutas de administración */}
              <Route path="/admin/login" element={<LoginAdmin />} />
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              <Route path="/admin/contenido-destacado" element={<GestionarContenidoDestacado />} />
            </Routes>
          </Router>
      </ProveedorContextoNoticias>
    </ProveedorContextoAuth>
  );
}