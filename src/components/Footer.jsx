const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Analizador de Complejidades</h4>
            <p>Herramienta para analizar la complejidad temporal y espacial de algoritmos</p>
          </div>
          
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/analyzer">Analizador</a></li>
              <li><a href="/docs">Documentación</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Recursos</h4>
            <ul className="footer-links">
              <li><a href="/docs#teoria">Teoría de Complejidad</a></li>
              <li><a href="/docs#ejemplos">Ejemplos</a></li>
              <li><a href="/docs#api">API</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Analizador de Complejidades. Proyecto Universitario.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;