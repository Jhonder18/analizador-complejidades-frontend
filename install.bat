@echo off
REM Script de instalación para Analizador de Complejidades Frontend
REM Para sistemas Windows

echo 🚀 Instalando dependencias del Analizador de Complejidades...

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js >= 18.0.0
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version

REM Instalar dependencias principales
echo 📦 Instalando dependencias principales...
call npm install @monaco-editor/react@^4.7.0 react@^19.1.1 react-dom@^19.1.1 react-router-dom@^7.9.3

REM Instalar dependencias de desarrollo
echo 🔧 Instalando dependencias de desarrollo...
call npm install --save-dev @eslint/js@^9.36.0 @types/react@^19.1.13 @types/react-dom@^19.1.9 @vitejs/plugin-react@^5.0.3 eslint@^9.36.0 eslint-plugin-react-hooks@^5.2.0 eslint-plugin-react-refresh@^0.4.20 globals@^16.4.0 vite@^7.1.7

if %errorlevel% equ 0 (
    echo ✅ Todas las dependencias instaladas correctamente
    echo 🎉 Para iniciar el proyecto ejecuta: npm run dev
) else (
    echo ❌ Error al instalar las dependencias
    pause
    exit /b 1
)

pause