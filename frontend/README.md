# TheBunker - Frontend

Frontend moderno y masculino para el sistema de gestión de barbería TheBunker.

## 🚀 Tecnologías

- **Vue 3** - Framework JavaScript progresivo
- **Vite** - Build tool ultra rápido
- **Tailwind CSS** - Framework CSS utilitario
- **Vue Router** - Enrutamiento oficial de Vue
- **Pinia** - Gestión de estado
- **Axios** - Cliente HTTP
- **Lucide Vue** - Iconos modernos

## 🎨 Características de Diseño

- **Paleta de colores**: Negros, grises oscuros y acentos dorados/cobrizos
- **Tipografía**: Oswald (Display) y Poppins (Body)
- **Estilo**: Minimalista, moderno y profesional
- **Responsive**: Adaptado a todos los dispositivos

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend de TheBunker corriendo en `http://localhost:5000`

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd TheBunker-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` y configura la URL de tu API:
```
VITE_API_URL=http://localhost:5000/api
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza la compilación de producción

## 🏗️ Estructura del Proyecto

```
TheBunker-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Recursos (imágenes, etc)
│   ├── components/      # Componentes reutilizables
│   │   └── Layout/      # Navbar, Footer
│   ├── router/          # Configuración de rutas
│   ├── services/        # Servicios API
│   ├── stores/          # Stores de Pinia
│   ├── views/           # Vistas/Páginas
│   │   ├── Auth/        # Login, Registro
│   │   ├── Dashboard/   # Dashboards por rol
│   │   └── ...          # Otras vistas
│   ├── App.vue          # Componente raíz
│   ├── main.js          # Punto de entrada
│   └── style.css        # Estilos globales
├── index.html           # HTML principal
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── package.json         # Dependencias
```

## 🎯 Funcionalidades Implementadas

### Páginas Públicas
- ✅ Landing Page moderna
- ✅ Catálogo de Servicios
- ✅ Catálogo de Productos con carrito
- ✅ Login y Registro

### Dashboard Cliente
- ✅ Vista general con estadísticas
- ✅ Gestión de citas
- ✅ Historial de pedidos
- ✅ Agendar nuevas citas

### Dashboard Barbero
- ✅ Citas asignadas
- ✅ Vista por día/semana
- ✅ Completar y cancelar citas

### Dashboard Admin
- ✅ Estadísticas generales
- ✅ Gestión de citas
- ✅ Gestión de servicios
- ✅ Gestión de productos
- ✅ Gestión de usuarios
- ✅ Control de inventario

## 🎨 Guía de Estilo

### Colores Principales
- **Primary**: `#c17e3e` (Dorado/Cobrizo)
- **Dark 900**: `#0a0a0a` (Negro principal)
- **Dark 950**: `#000000` (Negro más oscuro)

### Componentes de UI
- `btn-primary` - Botón principal con hover glow
- `btn-secondary` - Botón secundario con borde
- `input-field` - Input estilizado
- `card` - Tarjeta con fondo oscuro
- `nav-link` - Link de navegación

## 🔐 Autenticación

El sistema maneja 4 roles de usuario:
- **Cliente**: Puede agendar citas y comprar productos
- **Barbero**: Gestiona sus citas asignadas
- **Recepcionista**: Acceso a funciones administrativas
- **Admin**: Control total del sistema

## 🌐 Integración con Backend

El frontend se conecta al backend mediante Axios. Todas las llamadas API están en `/src/services/api.js`.

### Endpoints principales:
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar usuario
- `GET /api/servicios` - Obtener servicios
- `GET /api/productos` - Obtener productos
- `POST /api/citas` - Crear cita
- `GET /api/citas/disponibilidad` - Ver disponibilidad

## 🚀 Despliegue

Para compilar para producción:

```bash
npm run build
```

Los archivos compilados estarán en `/dist` listos para ser desplegados en cualquier hosting estático (Vercel, Netlify, etc).

## 🤝 Contribuir

Este es un proyecto académico para la Corporación Universitaria Iberoamericana.

## 📝 Licencia

Proyecto académico - TheBunker © 2026

---

**Desarrollado por**: Jesús Alberto Sosa Baron  
**Institución**: Corporación Universitaria Iberoamericana
