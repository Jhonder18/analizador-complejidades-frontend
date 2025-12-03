import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-background-dark/50 font-display text-slate-400 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 py-8 md:grid-cols-3">
          
          {/* Left Section: Branding */}
          <div className="flex justify-center md:justify-start">
            <div className="text-center md:text-left">
              <Link to="/" className="text-lg font-semibold text-slate-200 hover:text-primary transition-colors">
                Analizador de Complejidades
              </Link>
              <p className="mt-1 text-xs text-slate-500">
                Herramienta de análisis algorítmico impulsada por IA.
              </p>
            </div>
          </div>

          {/* Center Section: Navigation */}
          <nav className="flex justify-center">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link to="/" className="transition-colors hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/analyzer" className="transition-colors hover:text-primary">
                  Analizador
                </Link>
              </li>
              <li>
                <Link to="/docs" className="transition-colors hover:text-primary">
                  Docs
                </Link>
              </li>
              <li>
                <a href="/docs#api" className="transition-colors hover:text-primary">
                  API
                </a>
              </li>
              <li>
                <a href="/docs#faq" className="transition-colors hover:text-primary">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Right Section: Copyright & Icons */}
          <div className="flex items-center justify-center gap-6 md:justify-end">
            <p className="text-sm text-slate-500">
              © {currentYear} — Todos los derechos reservados.
            </p>
            <div className="hidden sm:flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-500 transition-colors hover:text-primary"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
              <Link
                to="/docs"
                aria-label="Documentation"
                className="text-slate-500 transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-xl">description</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;