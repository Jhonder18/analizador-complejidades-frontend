import { useState } from 'react';

const AIFixButton = ({ code, language, onCodeFixed }) => {
  const [isFixing, setIsFixing] = useState(false);

  const handleFixCode = async () => {
    if (!code.trim()) return;

    setIsFixing(true);
    try {
      // Simulación de arreglo con IA (aquí conectarías con tu API de IA)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular delay
      
      // Ejemplo de código "arreglado" - en realidad aquí harías la llamada a la IA
      const fixedCode = await fixCodeWithAI(code, language);
      
      onCodeFixed && onCodeFixed(fixedCode);
    } catch (error) {
      console.error('Error fixing code:', error);
      // Mostrar error al usuario
    } finally {
      setIsFixing(false);
    }
  };

  const fixCodeWithAI = async (code, language) => {
    // Esta función simula una corrección de código
    // En producción, aquí harías una llamada a tu servicio de IA
    
    // Ejemplo de correcciones básicas según el lenguaje
    let fixedCode = code;
    
    if (language === 'python') {
      // Corregir indentación básica
      fixedCode = fixedCode
        .split('\n')
        .map(line => {
          if (line.trim().endsWith(':') && !line.startsWith('    ')) {
            return line;
          }
          if (line.trim() && !line.startsWith('#') && !line.trim().endsWith(':')) {
            return line.startsWith('    ') ? line : '    ' + line.trim();
          }
          return line;
        })
        .join('\n');
    } else if (language === 'javascript') {
      // Agregar punto y coma si falta
      fixedCode = fixedCode
        .split('\n')
        .map(line => {
          if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}')) {
            return line + ';';
          }
          return line;
        })
        .join('\n');
    }
    
    return fixedCode;
  };

  return (
    <button
      onClick={handleFixCode}
      disabled={isFixing || !code.trim()}
      className="ai-fix-button"
      title="Arreglar código con IA"
    >
      <span className="ai-icon">
        {isFixing ? (
          // Spinner cuando está procesando
          <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
        ) : (
          // Icono de IA
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 0 0 1.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className="ai-text">
        {isFixing ? 'Arreglando...' : 'Arreglar con IA'}
      </span>
    </button>
  );
};

export default AIFixButton;