import './LoadingAnimation.css';

const LoadingAnimation = ({ message = "Analizando complejidad..." }) => {
  return (
    <div className="loading-animation-container">
      <div className="loading-content">
        {/* Spinner animado */}
        <div className="spinner-container">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <span className="material-symbols-outlined spinner-icon">
              psychology
            </span>
          </div>
        </div>

        {/* Mensaje */}
        <h2 className="loading-title">{message}</h2>
        <p className="loading-subtitle">Esto puede tomar unos segundos...</p>

        {/* Barra de progreso */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-bar-fill"></div>
          </div>
        </div>

        {/* Pasos del análisis */}
        <div className="loading-steps">
          <div className="loading-step active">
            <span className="material-symbols-outlined">check_circle</span>
            <span>Procesando entrada</span>
          </div>
          <div className="loading-step">
            <span className="material-symbols-outlined">hourglass_empty</span>
            <span>Generando AST</span>
          </div>
          <div className="loading-step">
            <span className="material-symbols-outlined">hourglass_empty</span>
            <span>Calculando complejidad</span>
          </div>
          <div className="loading-step">
            <span className="material-symbols-outlined">hourglass_empty</span>
            <span>Preparando resultados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
