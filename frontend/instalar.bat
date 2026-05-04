@echo off
chcp 65001 >nul
echo ========================================
echo   TheBunker Frontend - Instalación
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js detectado

echo.
echo [2/4] Instalando dependencias...
echo Este proceso puede tomar varios minutos...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas

echo.
echo [3/4] Configurando variables de entorno...
if not exist .env (
    copy .env.example .env >nul
    echo ✅ Archivo .env creado
) else (
    echo ⚠️  El archivo .env ya existe
)

echo.
echo [4/4] ¡Instalación completada!
echo.
echo ========================================
echo   Para iniciar el proyecto ejecuta:
echo   npm run dev
echo ========================================
echo.
pause
