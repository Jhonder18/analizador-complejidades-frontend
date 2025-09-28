import { useState } from 'react';

const DiagramViewer = ({ diagramData, type = 'json' }) => {
  const [viewMode, setViewMode] = useState('visual');

  if (!diagramData) {
    return (
      <div className="diagram-viewer empty">
        <p>No hay diagramas disponibles</p>
      </div>
    );
  }

  const renderDiagramContent = () => {
    switch (type) {
      case 'json':
        return (
          <pre className="json-diagram">
            {JSON.stringify(diagramData, null, 2)}
          </pre>
        );
      case 'image':
        return (
          <img 
            src={diagramData.url || diagramData} 
            alt="Diagram" 
            className="diagram-image"
          />
        );
      case 'chart':
        return (
          <div className="chart-container">
            {/* Aquí podrías integrar Chart.js o similar */}
            <p>Gráfico de complejidad</p>
          </div>
        );
      default:
        return (
          <div className="diagram-text">
            {typeof diagramData === 'string' ? diagramData : JSON.stringify(diagramData)}
          </div>
        );
    }
  };

  return (
    <div className="diagram-viewer">
      <div className="diagram-header">
        <h3>Visualización</h3>
        <div className="view-controls">
          <button
            className={`control-btn ${viewMode === 'visual' ? 'active' : ''}`}
            onClick={() => setViewMode('visual')}
          >
            Visual
          </button>
          <button
            className={`control-btn ${viewMode === 'raw' ? 'active' : ''}`}
            onClick={() => setViewMode('raw')}
          >
            Raw
          </button>
        </div>
      </div>

      <div className="diagram-content">
        {viewMode === 'visual' ? (
          renderDiagramContent()
        ) : (
          <pre className="raw-data">
            {JSON.stringify(diagramData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default DiagramViewer;