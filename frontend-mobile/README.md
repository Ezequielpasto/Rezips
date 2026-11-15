# Frontend Mobile - Rezips

## Descripción

La aplicación mobile de Rezips permite acceder a las funcionalidades principales del sistema desde dispositivos Android.

Está desarrollada utilizando React Native y Expo.

## Tecnologías utilizadas

- React Native
- Expo
- JavaScript
- Expo Router
- AsyncStorage
- Expo Image Picker

## Organización del proyecto

### app/

Contiene las pantallas de la aplicación y la navegación mediante Expo Router.

Entre las pantallas se encuentran:

- Inicio de sesión.
- Registro.
- Página principal.
- Perfil.
- Crear receta.
- Detalles de receta.
- Búsqueda.
- Recetas guardadas.
- Me gusta.

### components/

Contiene los componentes reutilizables de la aplicación.

### assets/

Contiene los recursos gráficos utilizados en la aplicación, como imágenes e iconos.

### config/

Contiene configuraciones necesarias para el funcionamiento de la aplicación.

- `api.js`: define la dirección del backend al que se conecta la aplicación.

### app.json

Contiene la configuración general de Expo, como el nombre de la aplicación, versión, iconos y configuración de Android.

### eas.json

Contiene la configuración utilizada para generar compilaciones mediante Expo Application Services (EAS).

## Comunicación con el backend

La aplicación utiliza fetch para comunicarse con el backend.

La URL de producción es:

`https://rezips-backend.onrender.com`

La dirección se centraliza en el archivo `config/api.js`.

## Almacenamiento local

Se utiliza AsyncStorage para guardar información localmente en el dispositivo.

Por ejemplo, se utiliza para conservar los datos del usuario durante la sesión.

## Funcionalidades

La aplicación permite:

- Registrar usuarios e iniciar sesión.
- Consultar recetas.
- Publicar recetas.
- Consultar ingredientes y pasos.
- Comentar recetas.
- Dar me gusta.
- Guardar recetas.
- Calificar recetas.
- Seleccionar o tomar una fotografía de perfil.

## Instalación y ejecución

Instalar dependencias:

\```bash
npm install
\```

Iniciar Expo:

\```bash
npx expo start
\```

Esto permite ejecutar y probar la aplicación durante el desarrollo mediante Expo Go o un emulador compatible.

## Generación del APK

Para generar una versión instalable de Android mediante EAS:

\```bash
eas build --platform android --profile preview
\```

Al finalizar la compilación, Expo proporciona un enlace para descargar el APK.

## Actualizaciones

Cuando se realizan modificaciones en el código mobile, es necesario probar los cambios y generar una nueva compilación APK para distribuirlos.

También se puede configurar Expo EAS Update para enviar determinadas actualizaciones sin generar una nueva compilación.

## Distribución

La aplicación Android se distribuye mediante archivos APK generados con Expo EAS.