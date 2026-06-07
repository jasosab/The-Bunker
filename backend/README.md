# TheBunker Backend

Backend API REST para el sistema de gestión de barbería TheBunker.

## Tecnologías

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para encriptación
- express-validator para validaciones

## Instalación

### Opción 1: Automática (Windows)

```bash
instalar.bat
```

### Opción 2: Manual

```bash
npm install
```

## Configuración

1. Copia el archivo `.env.example` y renómbralo a `.env`
2. Configura tus variables de entorno:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/TheBunker
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

## Ejecutar

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

## API Endpoints

### Autenticación

- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil (requiere token)

### Servicios

- `GET /api/servicios` - Listar servicios
- `POST /api/servicios` - Crear servicio (admin)
- `PUT /api/servicios/:id` - Actualizar servicio (admin)
- `DELETE /api/servicios/:id` - Eliminar servicio (admin)

### Citas

- `GET /api/citas/mis-citas` - Mis citas
- `GET /api/citas` - Todas las citas (admin/barbero)
- `POST /api/citas` - Crear cita
- `PUT /api/citas/:id` - Actualizar cita
- `PUT /api/citas/:id/cancelar` - Cancelar cita
- `GET /api/citas/disponibilidad` - Ver horarios disponibles

### Productos

- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto (admin)
- `PUT /api/productos/:id` - Actualizar producto (admin)
- `DELETE /api/productos/:id` - Eliminar producto (admin)

### Pedidos

- `GET /api/pedidos/mis-pedidos` - Mis pedidos
- `GET /api/pedidos` - Todos los pedidos (admin)
- `POST /api/pedidos` - Crear pedido

### Usuarios

- `GET /api/usuarios` - Listar usuarios (admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (admin)
- `DELETE /api/usuarios/:id` - Eliminar usuario (admin)

## Roles

### Cliente
- Puede agendar citas
- Puede realizar compras

### Barbero
- Gestiona sus citas asignadas

### Recepcionista
- Acceso administrativo

### Admin
- Control total del sistema

## Estructura

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Desarrollado por

**Jesús Alberto Sosa Barón**
Corporación Universitaria Iberoamericana
