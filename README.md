![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Express](https://img.shields.io/badge/Express-API-lightgrey)

# TheBunker Backend

Backend API REST para el sistema de gestión de barbería **TheBunker**.

---

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para encriptación
- express-validator para validaciones

---

## Instalación

### Opción 1: Instalación automática (Windows)

```bash
instalar.bat
```

### Opción 2: Instalación manual

```bash
npm install
```

---

## Configuración

1. Copiar el archivo `.env.example`.
2. Renombrarlo a `.env`.
3. Configurar las variables de entorno:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/TheBunker
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## Ejecución

### Opción 1: Automática (Windows)

```bash
iniciar.bat
```

### Opción 2: Manual

#### Desarrollo

```bash
npm run dev
```

#### Producción

```bash
npm start
```

---

## API Endpoints

### Autenticación

| Método | Endpoint             | Descripción       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/registro` | Registrar usuario |
| POST   | `/api/auth/login`    | Iniciar sesión    |
| GET    | `/api/auth/perfil`   | Obtener perfil    |

### Servicios

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/servicios`     | Listar servicios    |
| POST   | `/api/servicios`     | Crear servicio      |
| PUT    | `/api/servicios/:id` | Actualizar servicio |
| DELETE | `/api/servicios/:id` | Eliminar servicio   |

### Citas

| Método | Endpoint                    | Descripción     |
| ------ | --------------------------- | --------------- |
| GET    | `/api/citas/mis-citas`      | Mis citas       |
| GET    | `/api/citas`                | Todas las citas |
| POST   | `/api/citas`                | Crear cita      |
| PUT    | `/api/citas/:id`            | Actualizar cita |
| PUT    | `/api/citas/:id/cancelar`   | Cancelar cita   |
| GET    | `/api/citas/disponibilidad` | Ver horarios    |

### Productos

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/productos`     | Listar productos    |
| POST   | `/api/productos`     | Crear producto      |
| PUT    | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto   |

### Pedidos

| Método | Endpoint                   | Descripción       |
| ------ | -------------------------- | ----------------- |
| GET    | `/api/pedidos/mis-pedidos` | Mis pedidos       |
| GET    | `/api/pedidos`             | Todos los pedidos |
| POST   | `/api/pedidos`             | Crear pedido      |

### Usuarios

| Método | Endpoint            | Descripción        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/usuarios`     | Listar usuarios    |
| PUT    | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario   |

---

## Roles del sistema

### cliente

- Agendar citas
- Comprar productos

### barbero

- Gestionar citas asignadas

### recepcionista

- Gestión administrativa parcial

### admin

- Control total del sistema

---

## Estructura del proyecto

```bash
backend/
├── src/
│   ├── config/          # Configuración de base de datos
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Middleware personalizado
│   ├── models/          # Modelos MongoDB
│   ├── routes/          # Endpoints API
│   ├── utils/           # Utilidades JWT
│   ├── app.js           # Configuración Express
│   └── server.js        # Punto de entrada
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Calidad de código

Herramientas implementadas:

- ESLint
- Prettier

Ejecutar:

```bash
npm run lint
npm run format
```

---

## Flujo Git

Ramas utilizadas:

- `main`
- `develop`
- `feature/login`
- `feature/booking`
- `feature/products`

---

# TheBunker - Frontend

Frontend moderno y profesional para el sistema de gestión de barbería **TheBunker**.

## Tecnologías

- **Vue 3** - Framework JavaScript progresivo
- **Vite** - Build tool rápido
- **Tailwind CSS** - Framework CSS utilitario
- **Vue Router** - Enrutamiento oficial de Vue
- **Pinia** - Gestión de estado
- **Axios** - Cliente HTTP
- **Lucide Vue** - Iconos modernos

## Características de diseño

- **Paleta de colores**: negros, grises oscuros, azul TheBunker y blanco.
- **Color primario**: `#0d8bff`
- **Color secundario**: `#1e40af`
- **Color de acento**: `#60a5fa`
- **Tipografía**: Oswald para títulos y Poppins para textos.
- **Estilo**: minimalista, moderno y profesional.
- **Responsive**: adaptado a dispositivos móviles, tabletas y escritorio.

## Requisitos previos

- Node.js 18+
- npm o yarn
- Backend de TheBunker corriendo en `http://localhost:5000`

## Instalación

1. Clonar el repositorio:

```bash
cd TheBunker-frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

Editar el archivo `.env` y configurar la URL de la API:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en:

```bash
http://localhost:3000
```

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza la compilación de producción

## Estructura del proyecto

```bash
TheBunker-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Recursos, imágenes y estilos
│   ├── components/      # Componentes reutilizables
│   │   └── Layout/      # Navbar y Footer
│   ├── router/          # Configuración de rutas
│   ├── services/        # Servicios API
│   ├── stores/          # Stores de Pinia
│   ├── views/           # Vistas y páginas
│   │   ├── Auth/        # Login y Registro
│   │   ├── Dashboard/   # Dashboards por rol
│   │   └── ...          # Otras vistas
│   ├── App.vue          # Componente raíz
│   ├── main.js          # Punto de entrada
│   └── style.css        # Estilos globales
│
├── index.html           # HTML principal
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── package.json         # Dependencias
```

## Funcionalidades implementadas

### Páginas públicas

- Landing page moderna
- Catálogo de servicios
- Catálogo de productos con carrito
- Login y registro

### Dashboard cliente

- Vista general con estadísticas
- Gestión de citas
- Historial de pedidos
- Agendar nuevas citas

### Dashboard barbero

- Citas asignadas
- Vista por día y semana
- Completar y cancelar citas

### Dashboard admin

- Estadísticas generales
- Gestión de citas
- Gestión de servicios
- Gestión de productos
- Gestión de usuarios
- Control de inventario

## Guía de estilo

### Colores principales

- **Primary**: `#0d8bff` - Azul TheBunker
- **Primary Dark**: `#1e40af` - Azul profundo
- **Accent**: `#60a5fa` - Azul claro
- **White**: `#ffffff` - Texto principal y contraste
- **Dark 900**: `#0a0a0a` - Negro principal
- **Dark 950**: `#000000` - Negro más oscuro

### Componentes de UI

- `btn-primary` - Botón principal azul con hover glow
- `btn-secondary` - Botón secundario con borde azul
- `input-field` - Input estilizado
- `card` - Tarjeta con fondo oscuro
- `nav-link` - Link de navegación

## Autenticación

El sistema maneja 4 roles de usuario:

- **Cliente**: puede agendar citas y comprar productos.
- **Barbero**: gestiona sus citas asignadas.
- **Recepcionista**: accede a funciones administrativas parciales.
- **Admin**: tiene control total del sistema.

## Integración con backend

El frontend se conecta al backend mediante Axios. Todas las llamadas API están en:

```bash
/src/services/api.js
```

### Endpoints principales

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar usuario
- `GET /api/servicios` - Obtener servicios
- `GET /api/productos` - Obtener productos
- `POST /api/citas` - Crear cita
- `GET /api/citas/disponibilidad` - Ver disponibilidad

## Despliegue

Para compilar para producción:

```bash
npm run build
```

Los archivos compilados estarán en `/dist`, listos para ser desplegados en un hosting estático como Vercel, Netlify u otro similar.

## Contribuir

Este es un proyecto académico para la Corporación Universitaria Iberoamericana.

## Licencia

Proyecto académico - TheBunker 2026

## Desarrollado por

**Jesús Alberto Sosa Barón**  
Corporación Universitaria Iberoamericana
