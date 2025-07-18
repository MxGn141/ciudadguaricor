import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Settings } from 'lucide-react';

export default function PiePagina() {
  return (
    <footer className="bg-guarico-dark-blue text-guarico-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 font-serif">
              Ciudad <span className="text-guarico-gold">Guárico</span>
            </h3>
            <p className="text-gray-300 mb-4">
              El periódico digital líder en información local, regional y nacional de Venezuela. 
              Comprometidos con la verdad y el servicio a nuestra comunidad.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-guarico-gold transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-guarico-light-blue transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-guarico-green transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-guarico-light-gold transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Secciones</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/seccion/Nacionales" className="hover:text-guarico-gold transition-colors">Nacionales</Link></li>
              <li><Link to="/seccion/Municipales" className="hover:text-guarico-gold transition-colors">Municipales</Link></li>
              <li><Link to="/seccion/Deportes" className="hover:text-guarico-gold transition-colors">Deportes</Link></li>
              <li><Link to="/seccion/Cultura" className="hover:text-guarico-gold transition-colors">Cultura</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-guarico-gold transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-guarico-gold transition-colors">Publicidad</a></li>
              <li><a href="#" className="hover:text-guarico-gold transition-colors">Términos de Uso</a></li>
              <li>
                <Link 
                  to="/admin/login" 
                  className="hover:text-guarico-gold transition-colors flex items-center"
                >
                  <Settings size={16} className="mr-1" />
                  Panel Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-guarico-blue mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Ciudad Guárico. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}