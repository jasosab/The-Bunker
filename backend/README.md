# TheBunker Backend

Backend API REST para el sistema de gesti¨®n de barber¨ªa TheBunker.

## ?? Tecnolog¨ªas

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT para autenticaci¨®n
* bcryptjs para encriptaci¨®n
* express-validator para validaciones

## ??? Instalaci¨®n

### Opci¨®n 1: Autom¨¢tica (Windows)

```bash
instalar.bat
```

### Opci¨®n 2: Manual

```bash
npm install
```

## ?? Configuraci¨®n

1. Copia el archivo `.env.example` y ren¨®mbralo a `.env`
2. Configura tus variables de entorno:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/TheBunker
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

## ?? Ejecutar

### Opci¨®n 1: Autom¨¢tica (Windows)

```bash
iniciar.bat
```

### Opci¨®n 2: Manual

#### Desarrollo

```bash
npm run dev
```

#### Producci¨®n

```bash
npm start
```

## ?? API Endpoints

### Autenticaci¨®n

* `POST /api/auth/registro` - Registrar usuario
* `POST /api/auth/login` - Iniciar sesi¨®n
* `GET /api/auth/perfil` - Obtener perfil (requiere token)

### Servicios

* `GET /api/servicios` - Listar servicios
* `POST /api/servicios` - Crear servicio (admin)
* `PUT /api/servicios/:id` - Actualizar servicio (admin)
* `DELETE /api/servicios/:id` - Eliminar servicio (admin)

### Citas

* `GET /api/citas/mis-citas` - Mis citas
* `GET /api/citas` - Todas las citas (admin/barbero)
* `POST /api/citas` - Crear cita
* `PUT /api/citas/:id` - Actualizar cita
* `PUT /api/citas/:id/cancelar` - Cancelar cita
* `GET /api/citas/disponibilidad` - Ver horarios disponibles

### Productos

* `GET /api/productos` - Listar productos
* `POST /api/productos` - Crear producto (admin)
* `PUT /api/productos/:id` - Actualizar producto (admin)
* `DELETE /api/productos/:id` - Eliminar producto (admin)

### Pedidos

* `GET /api/pedidos/mis-pedidos` - Mis pedidos
* `GET /api/pedidos` - Todos los pedidos (admin)
* `POST /api/pedidos` - Crear pedido

### Usuarios

* `GET /api/usuarios` - Listar usuarios (admin)
* `PUT /api/usuarios/:id` - Actualizar usuario (admin)
* `DELETE /api/usuarios/:id` - Eliminar usuario (admin)

## ?? Roles

### Cliente

* Puede agendar citas
* Puede realizar compras

### Barbero

* Gestiona sus citas asignadas

### Recepcionista

* Acceso administrativo

### Admin

* Control total del sistema

## ?? Estructura

```text
backend/
©À©¤©¤ src/
©¦   ©À©¤©¤ config/          # Configuraci¨®n (DB)
©¦   ©À©¤©¤ controllers/     # L¨®gica de negocio
©¦   ©À©¤©¤ middleware/      # Middleware personalizado
©¦   ©À©¤©¤ models/          # Modelos de MongoDB
©¦   ©À©¤©¤ routes/          # Definici¨®n de rutas
©¦   ©À©¤©¤ utils/           # Utilidades (JWT)
©¦   ©À©¤©¤ app.js           # Configuraci¨®n de Express
©¦   ©¸©¤©¤ server.js        # Punto de entrada
©À©¤©¤ .env.example         # Variables de entorno ejemplo
©À©¤©¤ .gitignore
©À©¤©¤ package.json
©¸©¤©¤ README.md
```

## ????? Desarrollado por

**Jes¨²s Alberto Sosa Bar¨®n**
Corporaci¨®n Universitaria Iberoamericana
