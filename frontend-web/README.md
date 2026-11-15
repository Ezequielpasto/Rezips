# Frontend Web - Rezips

## Descripción

El frontend web de Rezips es la interfaz que permite a los usuarios interactuar con la aplicación desde un navegador.

Está desarrollado utilizando React y Vite.

Se comunica con el backend mediante solicitudes HTTP utilizando fetch.

## Tecnologías utilizadas

- React
- JavaScript
- HTML
- CSS
- Vite

## Organización del proyecto

### src/

Contiene el código principal de la aplicación.

Dentro de esta carpeta se encuentran los componentes, las pantallas, los estilos y la lógica de interacción.

### Componentes

Los componentes permiten dividir la interfaz en partes reutilizables.

Entre ellos se encuentran:

- Menú superior.
- Menú lateral.
- Listas de recetas.
- Detalles de recetas.
- Ingredientes.
- Pasos de preparación.

### Pantallas

La aplicación cuenta con diferentes pantallas para las funcionalidades principales:

- Inicio de sesión.
- Registro.
- Página principal.
- Perfil.
- Crear receta.
- Detalles de receta.
- Me gusta.
- Recetas guardadas.
- Búsqueda.
- Configuración.

### Estilos CSS

Los archivos CSS se encargan de definir la apariencia visual de los componentes y las pantallas.

### public/

Contiene los recursos estáticos públicos de la aplicación.

### package.json

Contiene las dependencias y los comandos disponibles para ejecutar y construir el proyecto.

## Comunicación con el backend

La aplicación utiliza fetch para comunicarse con la API de Rezips.

La URL del backend se configura mediante la variable de entorno:

`VITE_API_URL`

En desarrollo puede utilizarse:

`http://localhost:3000`

En producción se utiliza:

`https://rezips-backend.onrender.com`

## Instalación y ejecución

Instalar dependencias:

\```bash
npm install
\```

Ejecutar el servidor de desarrollo:

\```bash
npm run dev
\```

Construir la aplicación:

\```bash
npm run build
\```

## Despliegue

La aplicación web se encuentra desplegada en Vercel:

https://rezips.vercel.app

Los cambios subidos a la rama principal de GitHub generan un nuevo despliegue automático.