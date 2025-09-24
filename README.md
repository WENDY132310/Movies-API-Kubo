# Movies API - Kubo Technical Test

API REST desarrollada en Node.js para gestionar usuarios, películas y categorías.

## 🚀 Características

- ✅ CRUD de usuarios con autenticación JWT
- ✅ CRUD de películas con categorías
- ✅ Filtrado por título y categoría
- ✅ Paginación implementada
- ✅ Ordenamiento por fecha de estreno
- ✅ Endpoint de novedades (< 3 semanas)
- ✅ Sistema de películas vistas por usuario
- ✅ Validación de datos con Joi
- ✅ Manejo de errores centralizado
- ✅ Preparado para Heroku

## 🛠 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación
- **Joi** - Validación de datos
- **bcryptjs** - Encriptación de contraseñas

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- MySQL >= 8.0
- Git

## 🔧 Instalación Local

1. **Clonar el repositorio**
```bash
git clone 
cd movies-api-kubo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus valores:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=movies_kubo
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRE=7d
```

4. **Crear la base de datos**
```sql
CREATE DATABASE movies_kubo;
```

5. **Ejecutar migraciones**
```bash
npm run migrate
```

6. **Insertar datos iniciales**
```bash
npm run seed
```

7. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run dev


## 🌐 Despliegue en Heroku

1. **Crear app en Heroku**
```bash
heroku create tu-movies-api
```

2. **Añadir base de datos MySQL**
```bash
heroku addons:create jawsdb:kitefin
```

3. **Configurar variables de entorno**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_jwt_secret_muy_seguro
```

4. **Desplegar**
```bash
git push heroku main
```

5. **Ejecutar migraciones en producción**
```bash
heroku run npm run migrate
heroku run npm run seed
```

## 📚 Documentación API

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | Listar categorías |
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/watched-movies` | Usuarios con películas vistas |
| POST | `/api/movies` | Crear película |
| GET | `/api/movies` | Listar películas (con filtros) |
| GET | `/api/movies/novelties` | Películas novedades |
| POST | `/api/movies/:id/watched` | Marcar como vista |

### Ejemplos de Uso

**Crear usuario:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "123456"
  }'
```

**Listar películas con filtros:**
```bash
curl "http://localhost:3000/api/movies?title=conjuro&category=Terror&page=1&limit=5"
```

**Marcar película como vista:**
```bash
curl -X POST http://localhost:3000/api/movies/1/watched \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

## 🏗 Estructura del Proyecto

```
src/
├── config/
│   └── database.js          # Configuración MySQL
├── controllers/
│   ├── userController.js    # Lógica de usuarios
│   ├── movieController.js   # Lógica de películas
│   └── categoryController.js # Lógica de categorías
├── database/
│   ├── schema.sql          # Esquema de base de datos
│   ├── migrate.js          # Script de migración
│   └── seed.js             # Datos iniciales
├── middleware/
│   ├── auth.js             # Middleware de autenticación
│   └── errorHandler.js     # Manejo de errores
├── models/
│   ├── User.js             # Modelo de usuario
│   ├── Movie.js            # Modelo de película
│   └── Category.js         # Modelo de categoría
├── routes/
│   ├── userRoutes.js       # Rutas de usuarios
│   ├── movieRoutes.js      # Rutas de películas
│   └── categoryRoutes.js   # Rutas de categorías
├── validators/
│   ├── userValidator.js    # Validaciones de usuario
│   └── movieValidator.js   # Validaciones de película
└── app.js                  # Aplicación principal
```

## 🗄 Base de Datos

### Modelo Relacional

```sql
categories (1) ----< movies (N)
users (N) >----< user_watched_movies >----< movies (N)
```

### Tablas

- **categories**: id, name, created_at, updated_at
- **users**: id, username, email, password, created_at, updated_at
- **movies**: id, title, description, release_date, category_id, created_at, updated_at
- **user_watched_movies**: id, user_id, movie_id, watched_at

## 🧪 Testing

Para probar la API puedes usar:

- **Postman Collection**: [Importar aquí]
- **Thunder Client** (VS Code)
- **Insomnia**
- **cURL** (ejemplos en documentación)

## 📝 Scripts NPM

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm run migrate` - Ejecutar migraciones de BD
- `npm run seed` - Insertar datos iniciales

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Validación de entrada con Joi
- Helmet para headers de seguridad
- CORS configurado

## 🚀 Mejoras Futuras

- [ ] Tests unitarios e integración
- [ ] Documentación automática con Swagger
- [ ] Rate limiting
- [ ] Logs estructurados
- [ ] Cache con Redis
- [ ] Websockets para tiempo real
- [ ] Dockerización completa

## 👤 Autor

Tu Nombre - Desarrollador Backend
Email: tu-email@ejemplo.com

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Nota**: Esta API fue desarrollada como parte de la prueba técnica para la posición de Desarrollador Backend en Kubo S.A.S.