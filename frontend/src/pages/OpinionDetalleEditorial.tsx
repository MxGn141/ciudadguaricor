import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OpinionDetalleEditorial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [editorial, setEditorial] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/editoriales/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('No se pudo cargar el editorial');
        const data = await res.json();
        setEditorial(data);
      })
      .catch(err => setError(err.message || 'Error desconocido'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">Cargando editorial...</div>;
  }
  if (error || !editorial) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-lg text-gray-600">{error || 'Editorial no encontrado.'}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/opinion/editoriales" className="inline-flex items-center text-guarico-blue mb-6 hover:underline">
        <ArrowLeft className="h-5 w-5 mr-2" /> Volver a Editoriales
      </Link>
      <h1 className="text-4xl font-bold mb-2">{editorial.titulo}</h1>
      <div className="text-gray-500 text-sm mb-6">{editorial.fecha}{editorial.autor && <> &mdash; {editorial.autor}</>}</div>
      <article className="prose prose-lg max-w-none">
        {editorial.contenido}
      </article>
    </div>
  );
};

export default OpinionDetalleEditorial;
