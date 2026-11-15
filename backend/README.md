# Backend - Rezips

## Descripción

El backend de Rezips se encarga de procesar las solicitudes de la aplicación web y móvil, aplicar la lógica del sistema y comunicarse con la base de datos PostgreSQL.

Está desarrollado utilizando Node.js y Express.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- JavaScript

## Organización del proyecto

### config/

Contiene la configuración necesaria para conectar el servidor con la base de datos.

- `baseDatos.js`: configura el pool de conexiones a PostgreSQL.

### controllers/

Contiene los controladores que implementan la lógica de las operaciones del sistema.

Se encargan de recibir los datos, ejecutar las consultas necesarias y devolver las respuestas correspondientes.

### routes/

Contiene las rutas de la API.

Cada archivo organiza los endpoints relacionados con una funcionalidad del sistema.

### server.js

Es el archivo principal del backend.

Se encarga de configurar Express, utilizar los middlewares, conectar las rutas y poner en funcionamiento el servidor.

## Funcionalidades de la API

La API permite realizar operaciones relacionadas con:

- Recetas.
- Ingredientes.
- Pasos de preparación.
- Categorías.
- Usuarios y autenticación.
- Comentarios.
- Me gusta.
- Recetas guardadas.
- Calificaciones.

## Endpoints principales

URL base de producción:

`https://rezips-backend.onrender.com`

### Recetas

| Método | Endpoint | Función |
|---|---|---|
| GET | /recetas | Obtener recetas |
| GET | /recetas/:id | Obtener una receta |
| POST | /recetas | Crear una receta |
| PUT | /recetas/:id | Modificar una receta |
| DELETE | /recetas/:id | Eliminar una receta |

### Ingredientes

| Método | Endpoint | Función |
|---|---|---|
| GET | /ingredientes | Obtener ingredientes |
| GET | /ingredientes/:id | Obtener un ingrediente |
| POST | /ingredientes | Crear un ingrediente |

### Categorías

| Método | Endpoint | Función |
|---|---|---|
| GET | /categorias | Obtener categorías |
| GET | /categorias/:id | Obtener una categoría |

### Usuarios y autenticación

| Método | Endpoint | Función |
|---|---|---|
| POST | /auth/registro | Registrar usuario |
| POST | /auth/login | Iniciar sesión |
| GET | /usuarios/:id | Obtener usuario |
| DELETE | /usuarios/:id | Eliminar usuario |

También existen endpoints para comentarios, me gusta, recetas guardadas, calificaciones y pasos.

## Variables de entorno

El backend utiliza variables de entorno para configurar la conexión con PostgreSQL.

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `PORT`

Las credenciales no deben publicarse ni subirse a GitHub.

## Instalación y ejecución

Instalar dependencias:

\```bash
npm install
\```

Ejecutar en desarrollo:

\```bash
npm run dev
\```

Ejecutar el servidor:

\```bash
npm start
\```

## Despliegue

El backend se encuentra desplegado en Render:

https://rezips-backend.onrender.com

La conexión a PostgreSQL se realiza mediante Supabase.