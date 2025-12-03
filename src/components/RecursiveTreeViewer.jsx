import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './RecursiveTreeViewer.css';

// Inicializar Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#3030e8',
    primaryTextColor: '#fff',
    primaryBorderColor: '#3030e8',
    lineColor: '#6b7280',
    secondaryColor: '#1a1a2e',
    tertiaryColor: '#16213e',
    background: '#0a0a0f',
    mainBkg: '#1a1a2e',
    secondBkg: '#16213e',
    textColor: '#fff',
    fontSize: '14px'
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 15
  }
});

const RecursiveTreeViewer = ({ initialN = 4, initialMermaid = null, totalCalls = 0, onNChange }) => {
  const [n, setN] = useState(initialN);
  const [mermaidCode, setMermaidCode] = useState(initialMermaid);
  const [calls, setCalls] = useState(totalCalls);
  const mermaidRef = useRef(null);

  // Actualizar cuando cambien las props
  useEffect(() => {
    if (initialMermaid) {
      setMermaidCode(initialMermaid);
    }
  }, [initialMermaid]);

  useEffect(() => {
    setCalls(totalCalls);
  }, [totalCalls]);

  useEffect(() => {
    setN(initialN);
  }, [initialN]);

  // Renderizar el diagrama Mermaid
  useEffect(() => {
    if (mermaidCode && mermaidRef.current) {
      const renderDiagram = async () => {
        try {
          mermaidRef.current.innerHTML = '';
          const id = `mermaid-${Date.now()}`;
          const { svg } = await mermaid.render(id, mermaidCode);
          mermaidRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error);
          mermaidRef.current.innerHTML = '<p class="text-red-400">Error al renderizar el diagrama</p>';
        }
      };
      renderDiagram();
    }
  }, [mermaidCode]);

  const handleNChange = (e) => {
    const newValue = parseInt(e.target.value);
    setN(newValue);
    // Notificar al padre para que regenere el árbol con el nuevo valor
    if (onNChange) {
      onNChange(newValue);
    }
  };

  return (
    <div className="recursive-tree-viewer">
      <div className="tree-controls">
        <div className="slider-container">
          <label htmlFor="n-slider" className="slider-label">
            <span className="label-text">Valor de n:</span>
            <span className="label-value">{n}</span>
          </label>
          <input
            id="n-slider"
            type="range"
            min="0"
            max="7"
            value={n}
            onChange={handleNChange}
            className="n-slider"
          />
          <div className="slider-markers">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(val => (
              <span key={val} className="marker">{val}</span>
            ))}
          </div>
        </div>
        
        <div className="tree-stats">
          <div className="stat-item">
            <span className="stat-label">Total de llamadas:</span>
            <span className="stat-value">{calls}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Complejidad:</span>
            <span className="stat-value complexity">O(2<sup>n</sup>)</span>
          </div>
        </div>
      </div>

      <div className="tree-visualization">
        <h4 className="tree-title">Árbol de Recursión para n = {n}</h4>
        <div className="tree-container" ref={mermaidRef}>
          {!mermaidCode && <p className="text-gray-400">Cargando diagrama...</p>}
        </div>
      </div>
    </div>
  );
};

export default RecursiveTreeViewer;
