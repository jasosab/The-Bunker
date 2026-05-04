@echo off
chcp 65001 >nul
echo ========================================
echo   TheBunker Backend - Instalación
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js detectado

echo.
echo [2/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas

echo.
echo [3/3] Configurando entorno...
if not exist .env (
    copy .env.example .env >nul
    echo ✅ Archivo .env creado
    echo ⚠️  IMPORTANTE: Edita el archivo .env con tus configuraciones
) else (
    echo ⚠️  El archivo .env ya existe
)

echo.
echo ========================================
echo   ¡Instalación completada!
echo ========================================
echo.
echo Para iniciar el servidor:
echo   iniciar.bat
echo.
pause
