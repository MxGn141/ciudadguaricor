import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OpinionDetalleColumnista: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [columnista, setColumnista] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/columnistas/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('No se pudo cargar el columnista');
        const data = await res.json();
        setColumnista(data);
      })
      .catch(err => setError(err.message || 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">Cargando columnista...</div>;
  }
  if (error || !columnista) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">{error || 'Columnista no encontrado.'}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/opinion/columnistas" className="inline-flex items-center text-guarico-blue mb-6 hover:underline">
        <ArrowLeft className="h-5 w-5 mr-2" /> Volver a Columnistas
      </Link>
      <div className="flex items-center mb-6">
        <img src={columnista.fotoUrl || '/placeholder-user.jpg'} alt={columnista.nombre} className="w-24 h-24 rounded-full object-cover mr-6" />
        <div>
          <h1 className="text-3xl font-bold">{columnista.nombre}</h1>
          {columnista.titulo && <div className="text-gray-500 text-lg">{columnista.titulo}</div>}
        </div>
      </div>
      <article className="prose prose-lg max-w-none">
        {columnista.bio || columnista.biografia}
      </article>
    </div>
  );
};

export default OpinionDetalleColumnista;
