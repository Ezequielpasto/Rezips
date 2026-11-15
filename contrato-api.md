# Contrato de API - Rezips

## URL base

Desarrollo local:
http://localhost:3000

Producción:
https://rezips-backend.onrender.com

## Endpoints

### Recetas

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/recetas` | Obtiene todas las recetas. |
| GET | `/recetas? id_usuario=:id` | Obtiene las recetas de un usuario específico. |
| GET | `/recetas/:id` | Obtiene una receta por su ID. |
| GET | `/recetas/:id/ingredientes` | Obtiene los ingredientes de una receta. |
| POST | `/recetas` | Crea una nueva receta. |
| PUT | `/recetas/:id` | Modifica una receta, sus ingredientes y sus pasos. |
| DELETE | `/recetas/:id` | Elimina una receta y sus datos relacionados. |

**POST /recetas**

Datos requeridos:
```json
{
  "nombre": "Torta de chocolate",
  "duracion": 45,
  "cantidad_porciones": 8,
  "imagen": "url_imagen",
  "id_usuario": 1,
  "id_categoria": 2
}
```

**PUT /recetas/:id**

Datos requeridos:
```json
{
  "nombre": "Torta de chocolate",
  "duracion": 45,
  "cantidad_porciones": 8,
  "imagen": "url_imagen",
  "id_usuario": 1,
  "id_categoria": 2,
  "ingredientes": [
    {
      "nombre": "Harina",
      "cantidad": 200,
      "unidad": "gramos"
    }
  ],
  "pasos": [
    {
      "descripcion": "Mezclar los ingredientes"
    }
  ]
}
```

### Ingredientes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/ingredientes` | Obtiene todos los ingredientes. |
| GET | `/ingredientes/:id` | Obtiene un ingrediente por su ID. |
| POST | `/ingredientes` | Agrega un ingrediente a una receta. |

**POST /ingredientes**

Datos requeridos:
```json
{
  "id_receta": 1,
  "nombre": "Harina",
  "cantidad": 200,
  "unidad": "gramos"
}
```

### Pasos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/recetas/:id/pasos` | Obtiene los pasos de una receta. |
| POST | `/recetas/:id/pasos` | Agrega un paso a una receta. |

**POST /recetas/:id/pasos**

Datos requeridos:
```json
{
  "descripcion": "Mezclar los ingredientes",
  "numero": 1
}
```

### Categorías

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/categorias` | Obtiene todas las categorías. |
| GET | `/categorias/:id` | Obtiene una categoría por su ID. |

### Usuarios y autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/registro` | Registra un nuevo usuario. |
| POST | `/auth/login` | Inicia sesión. |
| GET | `/usuarios` | Obtiene todos los usuarios. |
| GET | `/usuarios/:id` | Obtiene un usuario por su ID. |
| DELETE | `/usuarios/:id` | Elimina un usuario y sus datos relacionados. |
| PUT | `/usuarios/:id` | Modifica los datos personales del usuario. |
| PUT | `/usuarios/:id/correo` | Cambia el correo electrónico. |
| PUT | `/usuarios/:id/contrasenia` | Cambia la contraseña. |
| PUT | `/usuarios/:id/imagen` | Cambia la imagen de perfil. |

**POST /auth/registro**

Datos requeridos:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@gmail.com",
  "contrasena": "123456",
  "fecha_nacimiento": "2005-05-20"
}
```

**POST /auth/login**

Datos requeridos:
```json
{
  "correo": "juan@gmail.com",
  "contrasena": "123456"
}
```

**PUT /usuarios/:id**

Datos requeridos:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "fecha_nacimiento": "2005-05-20"
}
```

**PUT /usuarios/:id/correo**

Datos requeridos:
```json
{
  "correo": "nuevo@gmail.com"
}
```

**PUT /usuarios/:id/contrasenia**

Datos requeridos:
```json
{
  "contrasenaActual": "123456",
  "contrasenaNueva": "654321"
}
```

**PUT /usuarios/:id/imagen**

Datos requeridos:
```json
{
  "imagen_perfil": "url_imagen"
}
```

### Me gusta

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/recetas/:id/me-gusta` | Agrega un me gusta a una receta. |
| DELETE | `/recetas/:id/me-gusta` | Elimina un me gusta de una receta. |
| GET | `/recetas/:id/me-gusta` | Obtiene los usuarios que dieron me gusta a una receta. |
| GET | `/recetas/usuario/:id/me-gusta` | Obtiene las recetas que le gustan a un usuario. |
| GET | `/usuarios/:id/me-gusta` | Obtiene las recetas que le gustan a un usuario. |

Para agregar o eliminar un me gusta:

```json
{
  "id_usuario": 1
}
```

### Recetas guardadas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/recetas/:id/guardar` | Guarda una receta. |
| DELETE | `/recetas/:id/guardar` | Elimina una receta de guardados. |
| GET | `/recetas/:id/guardar` | Obtiene los usuarios que guardaron una receta. |
| GET | `/recetas/usuario/:id/guardadas` | Obtiene las recetas guardadas por un usuario. |
| GET | `/usuarios/:id/guardadas` | Obtiene las recetas guardadas por un usuario. |

Para guardar o eliminar una receta:

```json
{
  "id_usuario": 1
}
```

### Calificaciones

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/recetas/:id/calificacion` | Obtiene las calificaciones de una receta. |
| POST | `/recetas/:id/calificacion` | Agrega o actualiza la calificación de un usuario. |
| DELETE | `/recetas/:id/calificacion` | Elimina la calificación de un usuario. |

Para agregar o actualizar una calificación:

```json
{
  "id_usuario": 1,
  "valor": 5
}
```

Para eliminar una calificación:

```json
{
  "id_usuario": 1
}
```

El valor de la calificación debe ser un número entero entre 1 y 5.

### Comentarios

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/recetas/:id/comentarios` | Obtiene los comentarios de una receta. |
| POST | `/recetas/:id/comentarios` | Agrega un comentario a una receta. |
| DELETE | `/comentarios/:id` | Elimina un comentario por su ID. |

**POST /recetas/:id/comentarios**

Datos requeridos:
```json
{
  "id_usuario": 1,
  "descripcion": "¡Muy buena receta!"
}
```

## Respuestas y códigos HTTP

| Código | Descripción |
|---|---|
| 200 | Operación realizada correctamente. |
| 201 | Recurso creado correctamente. |
| 400 | Faltan datos o son inválidos. |
| 401 | Credenciales incorrectas o contraseña actual incorrecta. |
| 404 | Recurso no encontrado. |
| 409 | Conflicto, por ejemplo, correo ya registrado o receta ya guardada. |
| 500 | Error interno del servidor. |