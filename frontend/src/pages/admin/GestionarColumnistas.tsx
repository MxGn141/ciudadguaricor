import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Columnista {
  id: number;
  nombre: string;
  bio: string;
  fotoUrl?: string;
  redes?: any;
  createdAt: string;
}

const GestionarColumnistas: React.FC = () => {
  const [columnistas, setColumnistas] = useState<Columnista[]>([]);
  const [nuevo, setNuevo] = useState<Partial<Columnista>>({});
  const [editando, setEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchColumnistas = async () => {
    setLoading(true);
    try {
      // Intentar conectarse a diferentes endpoints
      const API_ENDPOINTS = [
        'https://ciudadguaricor.onrender.com/api', // Producción
        'http://localhost:3000/api', // Desarrollo
        'http://localhost:3001/api', // Desarrollo alternativo
        '/api' // Fallback
      ];
      
      let columnistasData = [];
      let apiConnected = false;
      
      for (const API_BASE of API_ENDPOINTS) {
        try {
          console.log(`🔍 Admin: Conectando a ${API_BASE}/columnistas`);
          const res = await axios.get(`${API_BASE}/columnistas`);
          columnistasData = res.data;
          apiConnected = true;
          console.log('✅ Admin: Columnistas cargados:', columnistasData.length);
          break;
        } catch (apiError: any) {
          console.log(`❌ Admin: Error en ${API_BASE}:`, apiError.message);
          continue;
        }
      }
      
      if (apiConnected) {
        setColumnistas(columnistasData);
      } else {
        console.error('❌ Admin: No se pudo conectar a ningún endpoint');
        setColumnistas([]);
      }
    } catch (error) {
      console.error('❌ Admin: Error general:', error);
      setColumnistas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColumnistas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!nuevo.nombre || !nuevo.bio) return;
    // Prepara el payload asegurando que fotoUrl y redes se envían correctamente
    const payload: any = {
      nombre: nuevo.nombre,
      bio: nuevo.bio,
      fotoUrl: nuevo.fotoUrl || '',
      redes: nuevo.redes ? (typeof nuevo.redes === 'string' ? nuevo.redes : JSON.stringify(nuevo.redes)) : undefined
    };
    // Usar el mismo sistema de endpoints múltiples
    const API_ENDPOINTS = [
      'https://ciudadguaricor.onrender.com/api', // Producción
      'http://localhost:3000/api', // Desarrollo
      'http://localhost:3001/api', // Desarrollo alternativo
      '/api' // Fallback
    ];
    
    let success = false;
    for (const API_BASE of API_ENDPOINTS) {
      try {
        if (editando) {
          await axios.put(`${API_BASE}/columnistas/${editando}`, payload);
          console.log('✅ Admin: Columnista actualizado');
        } else {
          await axios.post(`${API_BASE}/columnistas`, payload);
          console.log('✅ Admin: Columnista creado');
        }
        success = true;
        break;
      } catch (apiError: any) {
        console.log(`❌ Admin: Error en ${API_BASE}:`, apiError.message);
        continue;
      }
    }
    
    if (!success) {
      alert('Error: No se pudo conectar al servidor');
      return;
    }
    setNuevo({});
    setEditando(null);
    fetchColumnistas();
  };

  const handleEdit = (col: Columnista) => {
    setNuevo(col);
    setEditando(col.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar columnista?')) return;
    
    const API_ENDPOINTS = [
      'https://ciudadguaricor.onrender.com/api', // Producción
      'http://localhost:3000/api', // Desarrollo
      'http://localhost:3001/api', // Desarrollo alternativo
      '/api' // Fallback
    ];
    
    let success = false;
    for (const API_BASE of API_ENDPOINTS) {
      try {
        await axios.delete(`${API_BASE}/columnistas/${id}`);
        console.log('✅ Admin: Columnista eliminado');
        success = true;
        break;
      } catch (apiError: any) {
        console.log(`❌ Admin: Error eliminando en ${API_BASE}:`, apiError.message);
        continue;
      }
    }
    
    if (success) {
      fetchColumnistas();
    } else {
      alert('Error: No se pudo eliminar el columnista');
    }
  };

  return (
    <div className="panel-admin opinion-admin max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-base font-semibold">Columnistas</span>
        <span className="text-base font-normal text-gray-400">Gestión</span>
      </h2>
      <div className="form-admin grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="nombre" placeholder="Nombre del columnista" value={nuevo.nombre || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition" />
        {/* Input para subir foto */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 font-medium">Fotografía</label>
          {nuevo.fotoUrl && (
            <img src={nuevo.fotoUrl} alt="Foto columnista" className="rounded-full object-cover border shadow mb-2" width={60} height={60} />
          )}
          <input type="file" accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  // Usa el endpoint backend para subir la imagen
                  const res = await axios.post('/api/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                  const url = res.data.url;
                  setNuevo(prev => ({ ...prev, fotoUrl: url }));
                } catch (err) {
                  alert('Error al subir imagen');
                }
              }
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition bg-white" />
        </div>
        <textarea name="bio" placeholder="Biografía" value={nuevo.bio || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition col-span-1 md:col-span-2 min-h-[80px]" />
        <input name="redes" placeholder="Redes sociales (JSON opcional)" value={nuevo.redes || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition col-span-1 md:col-span-2" />
        <div className="flex gap-3 col-span-1 md:col-span-2 mt-2">
          <button onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !nuevo.nombre || !nuevo.bio}
          >{editando ? 'Actualizar' : 'Crear'}</button>
          {editando && (
            <button onClick={() => { setNuevo({}); setEditando(null); }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg border border-gray-300 transition"
            >Cancelar</button>
          )}
        </div>
      </div>
      <hr className="my-6" />
      {loading ? <p className="text-center text-gray-500">Cargando columnistas...</p> : (
        <div className="overflow-x-auto">
          <table className="tabla-admin w-full text-left border-t border-gray-200">
            <thead>
              <tr className="bg-green-50 text-green-800">
                <th className="py-3 px-4 font-semibold">Nombre</th>
                <th className="py-3 px-4 font-semibold">Biografía</th>
                <th className="py-3 px-4 font-semibold">Foto</th>
                <th className="py-3 px-4 font-semibold">Redes</th>
                <th className="py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {columnistas.map((col, idx) => (
                <tr key={col.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 whitespace-pre-line">{col.nombre}</td>
                  <td className="py-2 px-4 whitespace-pre-line">{col.bio}</td>
                  <td className="py-2 px-4">{col.fotoUrl ? <img src={col.fotoUrl} alt={col.nombre} className="rounded-full object-cover border shadow" width={60} /> : '-'}</td>
                  <td className="py-2 px-4">{col.redes ? (<pre className="max-w-xs overflow-auto whitespace-pre-wrap text-xs bg-gray-100 rounded p-2">{JSON.stringify(col.redes)}</pre>) : '-'}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button onClick={() => handleEdit(col)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded transition"
                    >Editar</button>
                    <button onClick={() => handleDelete(col.id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold px-3 py-1 rounded transition"
                    >Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GestionarColumnistas;
