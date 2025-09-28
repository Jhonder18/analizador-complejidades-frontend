# 📦 Guía de Instalación - Analizador de Complejidades Frontend

## 🎯 Instalación Rápida

### Opción 1: Comando único (Recomendado)
```bash
npm install @monaco-editor/react@^4.7.0 react@^19.1.1 react-dom@^19.1.1 react-router-dom@^7.9.3 @eslint/js@^9.36.0 @types/react@^19.1.13 @types/react-dom@^19.1.9 @vitejs/plugin-react@^5.0.3 eslint@^9.36.0 eslint-plugin-react-hooks@^5.2.0 eslint-plugin-react-refresh@^0.4.20 globals@^16.4.0 vite@^7.1.7 --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite
```

### Opción 2: Scripts automatizados
#### En Windows:
```cmd
install.bat
```

#### En Linux/Mac:
```bash
chmod +x install.sh
./install.sh
```

### Opción 3: Usar el package.json existente
```bash
npm install
```

## 📋 Lista Detallada de Dependencias

### 🔧 Dependencias Principales (Production)
| Paquete | Versión | Descripción |
|---------|---------|-------------|
| `@monaco-editor/react` | ^4.7.0 | Editor de código Monaco (VS Code) |
| `react` | ^19.1.1 | Framework principal React |
| `react-dom` | ^19.1.1 | React DOM para renderizado |
| `react-router-dom` | ^7.9.3 | Enrutamiento para aplicaciones React |

### 🛠️ Dependencias de Desarrollo (Development)
| Paquete | Versión | Descripción |
|---------|---------|-------------|
| `@eslint/js` | ^9.36.0 | Configuración ESLint para JavaScript |
| `@types/react` | ^19.1.13 | Tipos TypeScript para React |
| `@types/react-dom` | ^19.1.9 | Tipos TypeScript para React DOM |
| `@vitejs/plugin-react` | ^5.0.3 | Plugin Vite para soporte React |
| `eslint` | ^9.36.0 | Linter para calidad de código |
| `eslint-plugin-react-hooks` | ^5.2.0 | Reglas ESLint para React Hooks |
| `eslint-plugin-react-refresh` | ^0.4.20 | Soporte para React Fast Refresh |
| `globals` | ^16.4.0 | Variables globales estándar |
| `vite` | ^7.1.7 | Build tool y servidor de desarrollo |

## 🚀 Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Verificar código con ESLint
npm run lint

# Previsualizar build de producción
npm run preview
```

## 🔍 Verificación de Instalación

Después de instalar, verifica que todo funcione:

1. **Verificar instalación:**
   ```bash
   npm list
   ```

2. **Iniciar el proyecto:**
   ```bash
   npm run dev
   ```

3. **Abrir en navegador:**
   ```
   http://localhost:5173
   ```

## ⚠️ Requisitos del Sistema

### Mínimos:
- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0
- **RAM:** 4GB mínimo
- **Espacio:** 500MB disponibles

### Recomendados:
- **Node.js:** >= 20.0.0
- **npm:** >= 10.0.0
- **RAM:** 8GB o más
- **Espacio:** 1GB disponibles

## 🔧 Solución de Problemas

### Error: Node.js no encontrado
```bash
# Instalar Node.js desde https://nodejs.org/
# O usar un gestor de versiones como nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### Error: Permisos en npm (Linux/Mac)
```bash
# Cambiar directorio por defecto de npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### Error: Puerto ocupado
```bash
# El servidor usa puerto 5173 por defecto
# Si está ocupado, especifica otro:
npm run dev -- --port 3000
```

### Error: Memoria insuficiente
```bash
# Aumentar memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 📁 Estructura del Proyecto

```
analizador-complejidades-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ComplexityAnalysis.jsx
│   │   ├── Editor.jsx
│   │   └── OutputPanel.jsx
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   └── Analyzer.jsx
│   ├── services/
│   │   └── complexityService.js
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
└── README.md
```

## 🌐 URLs Importantes

- **Desarrollo:** http://localhost:5173
- **Repositorio:** https://github.com/Jhonder18/analizador-complejidades-frontend
- **Documentación React:** https://react.dev/
- **Documentación Vite:** https://vitejs.dev/
- **Monaco Editor:** https://microsoft.github.io/monaco-editor/

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Verifica que Node.js esté actualizado
2. Limpia la caché de npm: `npm cache clean --force`
3. Elimina `node_modules` y `package-lock.json`, luego reinstala
4. Consulta los logs de error para más detalles

---

**¡Listo! Tu entorno de desarrollo debería estar funcionando correctamente.**