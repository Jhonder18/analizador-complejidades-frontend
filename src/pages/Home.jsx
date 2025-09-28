import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Analizador de Complejidades de Algoritmos
          </h1>
          <p className="hero-description">
            Analiza la complejidad temporal y espacial de tus algoritmos de manera automática.
            Soporta tanto lenguaje natural como código fuente.
          </p>
          <div className="hero-actions">
            <Link to="/analyzer" className="btn btn-primary">
              Empezar Análisis
            </Link>
            <Link to="/docs" className="btn btn-secondary">
              Ver Documentación
            </Link>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <h2>Características Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Análisis Automático</h3>
              <p>Detecta automáticamente la complejidad temporal y espacial de tus algoritmos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Lenguaje Natural</h3>
              <p>Describe tu algoritmo en palabras y obtén su análisis de complejidad</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Visualizaciones</h3>
              <p>Gráficos y diagramas para entender mejor el comportamiento de tus algoritmos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Análisis Detallado</h3>
              <p>Explicaciones claras y detalladas sobre la complejidad de tus algoritmos</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <h2>¿Cómo funciona?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Ingresa tu algoritmo</h3>
              <p>Escribe tu código o descríbelo en lenguaje natural</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Procesamiento automático</h3>
              <p>Nuestro sistema analiza y calcula las complejidades</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Resultados detallados</h3>
              <p>Obtén complejidades, explicaciones detalladas y visualizaciones</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;