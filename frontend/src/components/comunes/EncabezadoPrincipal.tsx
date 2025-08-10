import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { useContextoNoticias } from '../../contexts/ContextoNoticias';

export default function EncabezadoPrincipal() {
  const { contenidos } = useContextoNoticias();
  
  // Buscar el banner header-bg para usarlo como fondo
  const bannerHeader = contenidos.find(cont => cont.ubicacion === 'header-bg' && cont.visible);
  
  // Debug: mostrar qué contenidos se encontraron
  console.log('Contenidos header encontrados:', contenidos.filter(c => c.ubicacion === 'header-bg'));
  console.log('Banner header seleccionado:', bannerHeader);

  return (
    <header className="w-full">
      {/* Barra superior con redes comunitarias */}
      <div className="bg-gradient-to-r from-guarico-blue to-guarico-dark-blue">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="text-guarico-white text-sm hidden sm:block">
              Síguenos en nuestras redes comunitarias
            </div>
            <div className="flex items-center space-x-4 mx-auto sm:mx-0">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-guarico-white hover:text-guarico-gold transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-guarico-white hover:text-guarico-gold transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-guarico-white hover:text-guarico-gold transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Encabezado principal con imagen de fondo */}
      <div className="w-full relative overflow-hidden">
        {/* Imagen de fondo */}
        <div 
          className="relative w-full bg-cover bg-center bg-no-repeat"
          style={{
            height: 'clamp(140px, 30vw, 280px)',
            backgroundImage: `url(${bannerHeader?.media || '/media/contenido/header-bg.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll'
          }}
        >
          {bannerHeader?.url && (
            <a 
              href={bannerHeader.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 w-full h-full"
              aria-label="Enlace de contenido"
            />
          )}
          
          {/* Contenido del encabezado */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
            {/* Logo */}
            <Link to="/" className="block">
              <img 
                src="/logo.png"
                alt="Logo Ciudad Guárico" 
                className="w-auto transition-transform duration-300 hover:scale-105 max-w-full"
                style={{
                  height: 'clamp(70px, 18vw, 180px)',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}