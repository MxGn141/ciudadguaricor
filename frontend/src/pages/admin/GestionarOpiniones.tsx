import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Columnista {
  id: number;
  nombre: string;
}

interface Opinion {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  destacado: boolean;
  columnista: Columnista;
  media?: any[];
}

const GestionarOpiniones: React.FC = () => {
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [columnistas, setColumnistas] = useState<Columnista[]>([]);
  const [nuevo, setNuevo] = useState<Partial<Opinion & { columnistaId?: number }>>({});
  const [editando, setEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [opRes, colRes] = await Promise.all([
      axios.get('/api/opiniones'),
      axios.get('/api/columnistas')
    ]);
    setOpiniones(opRes.data);
    setColumnistas(colRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!nuevo.titulo || !nuevo.contenido || !nuevo.columnistaId) return;
    if (editando) {
      await axios.put(`/api/opiniones/${editando}`, nuevo);
    } else {
      await axios.post('/api/opiniones', nuevo);
    }
    setNuevo({});
    setEditando(null);
    fetchData();
  };

  const handleEdit = (op: Opinion) => {
    setNuevo({ ...op, columnistaId: op.columnista.id });
    setEditando(op.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar opinión?')) return;
    await axios.delete(`/api/opiniones/${id}`);
    fetchData();
  };

  return (
    <div className="panel-admin opinion-admin max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-base font-semibold">Opiniones</span>
        <span className="text-base font-normal text-gray-400">Gestión</span>
      </h2>
      <div className="form-admin grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="titulo" placeholder="Título de la opinión" value={nuevo.titulo || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition" />
        <select name="columnistaId" value={nuevo.columnistaId || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
          <option value="">Selecciona columnista</option>
          {columnistas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <input name="fecha" type="date" value={nuevo.fecha ? nuevo.fecha.slice(0,10) : ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition" />
        <label className="flex items-center gap-2 text-gray-600">
          <input type="checkbox" name="destacado" checked={!!nuevo.destacado} onChange={e => setNuevo({ ...nuevo, destacado: e.target.checked })}
            className="accent-red-600 w-4 h-4" />
          Destacado
        </label>
        <textarea name="contenido" placeholder="Contenido (HTML)" value={nuevo.contenido || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition col-span-1 md:col-span-2 min-h-[100px]" />
        <div className="flex gap-3 col-span-1 md:col-span-2 mt-2">
          <button onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !nuevo.titulo || !nuevo.contenido || !nuevo.columnistaId}
          >{editando ? 'Actualizar' : 'Crear'}</button>
          {editando && (
            <button onClick={() => { setNuevo({}); setEditando(null); }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg border border-gray-300 transition"
            >Cancelar</button>
          )}
        </div>
      </div>
      <hr className="my-6" />
      {loading ? <p className="text-center text-gray-500">Cargando opiniones...</p> : (
        <div className="overflow-x-auto">
          <table className="tabla-admin w-full text-left border-t border-gray-200">
            <thead>
              <tr className="bg-red-50 text-red-800">
                <th className="py-3 px-4 font-semibold">Título</th>
                <th className="py-3 px-4 font-semibold">Columnista</th>
                <th className="py-3 px-4 font-semibold">Fecha</th>
                <th className="py-3 px-4 font-semibold">Destacado</th>
                <th className="py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {opiniones.map((op, idx) => (
                <tr key={op.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 whitespace-pre-line">{op.titulo}</td>
                  <td className="py-2 px-4">{op.columnista.nombre}</td>
                  <td className="py-2 px-4">{op.fecha ? op.fecha.slice(0,10) : '-'}</td>
                  <td className="py-2 px-4">{op.destacado ? <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Sí</span> : <span className="inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">No</span>}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button onClick={() => handleEdit(op)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded transition"
                    >Editar</button>
                    <button onClick={() => handleDelete(op.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1 rounded transition"
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

export default GestionarOpiniones;
