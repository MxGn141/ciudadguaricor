import React, { useRef, useState } from 'react';

export default function EdicionPDF() {
  const [pdfUrl, setPdfUrl] = useState('/edicion.pdf');
  const [historial, setHistorial] = useState<string[]>([]); // Simulado, en real sería desde backend
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Simulación: en real, subiría al backend y actualizaría la portada
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setHistorial(prev => [url, ...prev]);
      alert('PDF cargado (simulado, no persiste tras recargar)');
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Edición PDF</h2>
      <div>
        <h3 className="font-semibold mb-2">PDF actual:</h3>
        <div className="border rounded p-2 bg-gray-50 flex flex-col items-center">
          <object data={pdfUrl} type="application/pdf" width="100%" height="400px">
            <p>No se puede mostrar el PDF. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Descargar PDF</a></p>
          </object>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Subir nueva edición PDF</h3>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleUpload}
          className="block w-full border border-gray-300 rounded p-2"
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Historial de PDFs (simulado)</h3>
        <ul className="list-disc pl-6 space-y-1">
          {historial.length === 0 && <li className="text-gray-500">No hay historial.</li>}
          {historial.map((url, idx) => (
            <li key={idx}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver PDF {idx + 1}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 