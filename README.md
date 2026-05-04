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

### 🛍️ Productos

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
│   ├── config/          # Configuración base de datos
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

## 👨‍💻 Desarrollado por

**Jesús Alberto Sosa Barón**
Corporación Universitaria Iberoamericana
