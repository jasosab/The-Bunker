@echo off
chcp 65001 >nul
echo ========================================
echo   TheBunker Backend - Iniciando...
echo ========================================
echo.

if not exist .env (
    echo ❌ Error: Archivo .env no encontrado
    echo Por favor ejecuta instalar.bat primero
    pause
    exit /b 1
)

echo Servidor iniciándose en puerto 5000...
echo Presiona Ctrl+C para detener
echo.
echo ========================================
echo.

npm run dev
