// src/contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('complexity_analyzer_theme');
    return saved || 'light';
  });

  const applyTheme = (t) => {
    setTheme(t);
    localStorage.setItem('complexity_analyzer_theme', t);
    // 1) modo anterior (tu CSS usa body.dark-theme)
    document.body.className = t === 'dark' ? 'dark-theme' : 'light-theme';
    // 2) nuevo: activa los selectores [data-theme="dark"]
    document.documentElement.setAttribute('data-theme', t);
    // mejora formularios/scrollbars del SO
    document.documentElement.style.colorScheme = t;
  };

  const toggleTheme = () => applyTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => { applyTheme(theme); /* sincroniza al cargar */ }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
