# Contrato

## URL base 

http://localhost:xxxx/api/v1


## Endpoints

#### Recetas

GET /recetas
- Obtiene todas las recetas ya creadas.

GET /recetas/:id
- Obtiene una receta por id.

POST /recetas
- Crea una nueva receta.

PUT /recetas/:id
- Actualiza una receta especifica.

DELETE /recetas/:id
- Elimina una receta especifica.

### Ingrediente

GET /ingredientes
- Obtiene todos los ingredientes ya creados.

GET /ingredientes/:id
- Obtiene un ingrediente por id.

POST /ingredientes
- Crear un ingrediente.

### Categorías

GET /categorias
- Obtiene todas las categorias.

GET /categorias/:id
- Obtiene una categoria especifica.

### Usuarios

POST /auth/registro
- Registra un nuevo usuario.

POST /auth/login
- Inicia sesión un usuario.

GET /usuarios/:id
- Obtiene un usuario por id.

DELETE /usuarios/:id
- Elimina a un usuario por id.

### Me gusta

POST /recetas/:id/me-gusta
- Le inserta un me gusta a una receta.

DELETE /recetas/:id/me-gusta
- Le elimina un me gusta a una receta.

### Guardar recetas

POST /recetas/:id/guardar
- Guarda una receta.

DELETE /recetas/:id/guardar
- Elimina una receta guardada.

### Calificaciones

POST /recetas/:id/calificacion
- Califica una receta.

DELETE /recetas/:id/calificacion
- Elimina la calificacion de una receta.

### Comentarios

GET /recetas/:id/comentarios
- Obtiene los comentarios de una receta.

POST /recetas/:id/comentarios
- Crea un comentario a una receta.

DELETE /comentarios/:id
- Elimina un comentario.