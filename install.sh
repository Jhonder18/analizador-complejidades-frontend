#!/bin/bash

# Script de instalación para Analizador de Complejidades Frontend
# Para sistemas Unix/Linux/Mac

echo "🚀 Instalando dependencias del Analizador de Complejidades..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js >= 18.0.0"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -pe "process.exit(process.version.localeCompare('v$REQUIRED_VERSION', undefined, {numeric:true}) >= 0 ? 0 : 1)"; then
    echo "❌ Se requiere Node.js >= $REQUIRED_VERSION. Versión actual: v$NODE_VERSION"
    exit 1
fi

echo "✅ Node.js versión v$NODE_VERSION detectada"

# Instalar dependencias principales
echo "📦 Instalando dependencias principales..."
npm install @monaco-editor/react@^4.7.0 react@^19.1.1 react-dom@^19.1.1 react-router-dom@^7.9.3

# Instalar dependencias de desarrollo
echo "🔧 Instalando dependencias de desarrollo..."
npm install --save-dev @eslint/js@^9.36.0 @types/react@^19.1.13 @types/react-dom@^19.1.9 @vitejs/plugin-react@^5.0.3 eslint@^9.36.0 eslint-plugin-react-hooks@^5.2.0 eslint-plugin-react-refresh@^0.4.20 globals@^16.4.0 vite@^7.1.7

if [ $? -eq 0 ]; then
    echo "✅ Todas las dependencias instaladas correctamente"
    echo "🎉 Para iniciar el proyecto ejecuta: npm run dev"
else
    echo "❌ Error al instalar las dependencias"
    exit 1
fi