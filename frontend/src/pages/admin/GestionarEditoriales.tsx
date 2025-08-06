import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Editorial {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  autor?: string;
  media?: any[];
}

const GestionarEditoriales: React.FC = () => {
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [nuevo, setNuevo] = useState<Partial<Editorial>>({});
  const [editando, setEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEditoriales = async () => {
    setLoading(true);
    const res = await axios.get('/api/editoriales');
    setEditoriales(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEditoriales();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!nuevo.titulo || !nuevo.contenido) return;
    if (editando) {
      await axios.put(`/api/editoriales/${editando}`, nuevo);
    } else {
      await axios.post('/api/editoriales', nuevo);
    }
    setNuevo({});
    setEditando(null);
    fetchEditoriales();
  };

  const handleEdit = (ed: Editorial) => {
    setNuevo(ed);
    setEditando(ed.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar editorial?')) return;
    await axios.delete(`/api/editoriales/${id}`);
    fetchEditoriales();
  };

  return (
    <div className="panel-admin opinion-admin max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-base font-semibold">Editoriales</span>
        <span className="text-base font-normal text-gray-400">Gestión</span>
      </h2>
      <div className="form-admin grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="titulo" placeholder="Título del editorial" value={nuevo.titulo || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" />
        <input name="autor" placeholder="Autor (opcional)" value={nuevo.autor || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" />
        <input name="fecha" type="date" value={nuevo.fecha ? nuevo.fecha.slice(0,10) : ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition" />
        <textarea name="contenido" placeholder="Contenido (HTML)" value={nuevo.contenido || ''} onChange={handleChange}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition col-span-1 md:col-span-2 min-h-[100px]" />
        <div className="flex gap-3 col-span-1 md:col-span-2 mt-2">
          <button onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !nuevo.titulo || !nuevo.contenido}
          >{editando ? 'Actualizar' : 'Crear'}</button>
          {editando && (
            <button onClick={() => { setNuevo({}); setEditando(null); }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg border border-gray-300 transition"
            >Cancelar</button>
          )}
        </div>
      </div>
      <hr className="my-6" />
      {loading ? <p className="text-center text-gray-500">Cargando editoriales...</p> : (
        <div className="overflow-x-auto">
          <table className="tabla-admin w-full text-left border-t border-gray-200">
            <thead>
              <tr className="bg-blue-50 text-blue-800">
                <th className="py-3 px-4 font-semibold">Título</th>
                <th className="py-3 px-4 font-semibold">Autor</th>
                <th className="py-3 px-4 font-semibold">Fecha</th>
                <th className="py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {editoriales.map((ed, idx) => (
                <tr key={ed.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 whitespace-pre-line">{ed.titulo}</td>
                  <td className="py-2 px-4">{ed.autor || '-'}</td>
                  <td className="py-2 px-4">{ed.fecha ? ed.fecha.slice(0,10) : '-'}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button onClick={() => handleEdit(ed)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded transition"
                    >Editar</button>
                    <button onClick={() => handleDelete(ed.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded transition"
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

export default GestionarEditoriales;
