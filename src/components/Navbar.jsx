import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4">
            <span className="material-symbols-outlined text-2xl text-[#9013FE]">
              spark
            </span>
            <h1 className="text-xl font-bold text-white">Analizador de Complejidades</h1>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link
              to="/"
              className={`relative transition-colors duration-300 ${
                isActive('/')
                  ? 'text-gray-300 hover:text-white active-link'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/analyzer"
              className={`relative transition-colors duration-300 ${
                isActive('/analyzer')
                  ? 'text-gray-300 hover:text-white active-link'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Analizador
            </Link>
            <Link
              to="/docs"
              className={`relative transition-colors duration-300 ${
                isActive('/docs')
                  ? 'text-gray-300 hover:text-white active-link'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Documentación
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;