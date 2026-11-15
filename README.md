# Rezips

## Descripción

Rezips es una aplicación web y móvil para compartir, publicar y descubrir recetas de cocina.

Los usuarios pueden registrarse, iniciar sesión, publicar recetas, consultar ingredientes y pasos de preparación, comentar, calificar y guardar recetas.

El proyecto fue desarrollado como parte de la materia Desarrollo Web y Mobile.

## Tecnologías utilizadas

- Frontend Web: React + Vite.
- Frontend Mobile: React Native + Expo.
- Backend: Node.js + Express.
- Base de datos: PostgreSQL.
- Almacenamiento local: AsyncStorage.
- Control de versiones: Git y GitHub.

## Arquitectura del proyecto

El proyecto está dividido en las siguientes partes:

- `backend/`: contiene el servidor, la API, las rutas y los controladores.
- `web-frontend/`: contiene la aplicación web desarrollada con React.
- `frontend-mobile/`: contiene la aplicación móvil desarrollada con React Native y Expo.
- `database/`: contiene los archivos relacionados con la estructura de la base de datos.

## Aplicaciones publicadas

**Web:** https://rezips.vercel.app

**Backend:** https://rezips-backend.onrender.com

**Base de datos:** alojada en Supabase.

## Ejecución del proyecto

Cada parte se ejecuta por separado.

### Backend

\```bash
cd backend
npm install
npm run dev
\```

### Frontend Web

\```bash
cd web-frontend
npm install
npm run dev
\```

### Frontend Mobile

\```bash
cd frontend-mobile
npm install
npx expo start
\```

## Base de datos

El sistema utiliza PostgreSQL y cuenta con las siguientes tablas:

- usuario
- receta
- categoria
- ingrediente
- ingrediente_receta
- paso
- comentario
- me_gusta
- receta_guardada
- calificacion

## Despliegue

- Web: Vercel.
- Backend: Render.
- Base de datos: Supabase.
- Mobile: archivos APK generados mediante Expo EAS.

## Control de versiones

Se utiliza Git para administrar los cambios y GitHub como repositorio remoto.

La rama `main` contiene la versión principal del proyecto.

## Autor

Proyecto académico desarrollado para la materia Desarrollo Web y Mobile.