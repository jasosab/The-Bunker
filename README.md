![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Express](https://img.shields.io/badge/Express-API-lightgrey)

# TheBunker Backend

Backend API REST para el sistema de gestión de barbería **TheBunker**.

---

## 🚀 Tecnologías utilizadas

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT para autenticación
* bcryptjs para encriptación
* express-validator para validaciones

---

## 📋 Instalación

### Opción 1: Instalación automática (Windows)

```bash
instalar.bat
```

### Opción 2: Instalación manual

```bash
npm install
```

---

## ⚙️ Configuración

1. Copiar el archivo `.env.example`
2. Renombrarlo a `.env`

Configurar variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/TheBunker
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## ▶️ Ejecución

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

## 📚 API Endpoints

---

### 🔐 Autenticación

| Método | Endpoint             | Descripción       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/registro` | Registrar usuario |
| POST   | `/api/auth/login`    | Iniciar sesión    |
| GET    | `/api/auth/perfil`   | Obtener perfil    |

---

### ✂️ Servicios

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/servicios`     | Listar servicios    |
| POST   | `/api/servicios`     | Crear servicio      |
| PUT    | `/api/servicios/:id` | Actualizar servicio |
| DELETE | `/api/servicios/:id` | Eliminar servicio   |

---

### 📅 Citas

| Método | Endpoint                    | Descripción     |
| ------ | --------------------------- | --------------- |
| GET    | `/api/citas/mis-citas`      | Mis citas       |
| GET    | `/api/citas`                | Todas las citas |
| POST   | `/api/citas`                | Crear cita      |
| PUT    | `/api/citas/:id`            | Actualizar cita |
| PUT    | `/api/citas/:id/cancelar`   | Cancelar cita   |
| GET    | `/api/citas/disponibilidad` | Ver horarios    |

---

### 🛍�?Productos

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/productos`     | Listar productos    |
| POST   | `/api/productos`     | Crear producto      |
| PUT    | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto   |

---

### 📦 Pedidos

| Método | Endpoint                   | Descripción       |
| ------ | -------------------------- | ----------------- |
| GET    | `/api/pedidos/mis-pedidos` | Mis pedidos       |
| GET    | `/api/pedidos`             | Todos los pedidos |
| POST   | `/api/pedidos`             | Crear pedido      |

---

### 👥 Usuarios

| Método | Endpoint            | Descripción        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/usuarios`     | Listar usuarios    |
| PUT    | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario   |

---

## 🔐 Roles del sistema

### cliente

* Agendar citas
* Comprar productos

### barbero

* Gestionar citas asignadas

### recepcionista

* Gestión administrativa parcial

### admin

* Control total del sistema

---

## 📦 Estructura del proyecto

```bash
backend/
├── src/
�?  ├── config/          # Configuración base de datos
�?  ├── controllers/     # Lógica de negocio
�?  ├── middleware/      # Middleware personalizado
�?  ├── models/          # Modelos MongoDB
�?  ├── routes/          # Endpoints API
�?  ├── utils/           # Utilidades JWT
�?  ├── app.js           # Configuración Express
�?  └── server.js        # Punto de entrada
�?
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Calidad de código

Herramientas implementadas:

* ESLint
* Prettier

Ejecutar:

```bash
npm run lint
npm run format
```

---

## 🌿 Flujo Git

Ramas utilizadas:

* `main`
* `develop`
* `feature/login`
* `feature/booking`
* `feature/products`

---

# TheBunker - Frontend

Frontend moderno y masculino para el sistema de gesti��n de barber��a TheBunker.

## ?? Tecnolog��as

- **Vue 3** - Framework JavaScript progresivo
- **Vite** - Build tool ultra r��pido
- **Tailwind CSS** - Framework CSS utilitario
- **Vue Router** - Enrutamiento oficial de Vue
- **Pinia** - Gesti��n de estado
- **Axios** - Cliente HTTP
- **Lucide Vue** - Iconos modernos

## ?? Caracter��sticas de Dise?o

- **Paleta de colores**: Negros, grises oscuros y acentos dorados/cobrizos
- **Tipograf��a**: Oswald (Display) y Poppins (Body)
- **Estilo**: Minimalista, moderno y profesional
- **Responsive**: Adaptado a todos los dispositivos

## ?? Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend de TheBunker corriendo en `http://localhost:5000`

## ??? Instalaci��n

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

El frontend estar�� disponible en `http://localhost:3000`

## ?? Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producci��n
- `npm run preview` - Previsualiza la compilaci��n de producci��n

## ??? Estructura del Proyecto

```
TheBunker-frontend/
������ public/              # Archivos est��ticos
������ src/
��   ������ assets/          # Recursos (im��genes, etc)
��   ������ components/      # Componentes reutilizables
��   ��   ������ Layout/      # Navbar, Footer
��   ������ router/          # Configuraci��n de rutas
��   ������ services/        # Servicios API
��   ������ stores/          # Stores de Pinia
��   ������ views/           # Vistas/P��ginas
��   ��   ������ Auth/        # Login, Registro
��   ��   ������ Dashboard/   # Dashboards por rol
��   ��   ������ ...          # Otras vistas
��   ������ App.vue          # Componente ra��z
��   ������ main.js          # Punto de entrada
��   ������ style.css        # Estilos globales
������ index.html           # HTML principal
������ vite.config.js       # Configuraci��n de Vite
������ tailwind.config.js   # Configuraci��n de Tailwind
������ package.json         # Dependencias
```

## ?? Funcionalidades Implementadas

### P��ginas P��blicas
- ? Landing Page moderna
- ? Cat��logo de Servicios
- ? Cat��logo de Productos con carrito
- ? Login y Registro

### Dashboard Cliente
- ? Vista general con estad��sticas
- ? Gesti��n de citas
- ? Historial de pedidos
- ? Agendar nuevas citas

### Dashboard Barbero
- ? Citas asignadas
- ? Vista por d��a/semana
- ? Completar y cancelar citas

### Dashboard Admin
- ? Estad��sticas generales
- ? Gesti��n de citas
- ? Gesti��n de servicios
- ? Gesti��n de productos
- ? Gesti��n de usuarios
- ? Control de inventario

## ?? Gu��a de Estilo

### Colores Principales
- **Primary**: `#c17e3e` (Dorado/Cobrizo)
- **Dark 900**: `#0a0a0a` (Negro principal)
- **Dark 950**: `#000000` (Negro m��s oscuro)

### Componentes de UI
- `btn-primary` - Bot��n principal con hover glow
- `btn-secondary` - Bot��n secundario con borde
- `input-field` - Input estilizado
- `card` - Tarjeta con fondo oscuro
- `nav-link` - Link de navegaci��n

## ?? Autenticaci��n

El sistema maneja 4 roles de usuario:
- **Cliente**: Puede agendar citas y comprar productos
- **Barbero**: Gestiona sus citas asignadas
- **Recepcionista**: Acceso a funciones administrativas
- **Admin**: Control total del sistema

## ?? Integraci��n con Backend

El frontend se conecta al backend mediante Axios. Todas las llamadas API est��n en `/src/services/api.js`.

### Endpoints principales:
- `POST /api/auth/login` - Iniciar sesi��n
- `POST /api/auth/registro` - Registrar usuario
- `GET /api/servicios` - Obtener servicios
- `GET /api/productos` - Obtener productos
- `POST /api/citas` - Crear cita
- `GET /api/citas/disponibilidad` - Ver disponibilidad

## ?? Despliegue

Para compilar para producci��n:

```bash
npm run build
```

Los archivos compilados estar��n en `/dist` listos para ser desplegados en cualquier hosting est��tico (Vercel, Netlify, etc).

## ?? Contribuir

Este es un proyecto acad��mico para la Corporaci��n Universitaria Iberoamericana.

## ?? Licencia

Proyecto acad��mico - TheBunker ? 2026

## 👨‍�?Desarrollado por

**Jesús Alberto Sosa Barón**
Corporación Universitaria Iberoamericana
