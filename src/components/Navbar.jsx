import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>Analizador de Complejidades</h2>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className={isActive('/')}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/analyzer" className={isActive('/analyzer')}>
              Analizador
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/docs" className={isActive('/docs')}>
              Documentación
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <ThemeToggle />
          <div className="nav-toggle">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;