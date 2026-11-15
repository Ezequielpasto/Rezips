# Base de datos - Rezips

## Descripción

La base de datos de Rezips se encarga de almacenar y organizar toda la información necesaria para el funcionamiento de la aplicación.

Se utiliza PostgreSQL y está alojada en Supabase.

## Tecnología utilizada

- PostgreSQL
- Supabase
- SQL

## Organización de la base de datos

La base de datos está organizada mediante tablas relacionadas entre sí.

### Tablas principales

| Tabla | Descripción |
|---|---|
| usuario | Almacena la información de los usuarios registrados. |
| receta | Almacena las recetas publicadas. |
| categoria | Almacena las categorías de las recetas. |
| ingrediente | Almacena los ingredientes disponibles. |
| ingrediente_receta | Relaciona las recetas con sus ingredientes, cantidades y unidades. |
| paso | Almacena los pasos de preparación de cada receta. |
| comentario | Almacena los comentarios realizados por los usuarios. |
| me_gusta | Registra los me gusta de las recetas. |
| receta_guardada | Registra las recetas guardadas por los usuarios. |
| calificacion | Almacena las calificaciones de las recetas. |

## Relaciones

Las tablas se relacionan mediante claves primarias y claves foráneas.

Entre las relaciones principales se encuentran:

- Un usuario puede publicar varias recetas.
- Una categoría puede estar asociada a varias recetas.
- Una receta puede tener varios pasos.
- Una receta puede contener varios ingredientes.
- Un usuario puede realizar comentarios.
- Los usuarios pueden dar me gusta, guardar y calificar recetas.

## Restricciones

Se utilizan diferentes restricciones para mantener la integridad de los datos:

- Claves primarias (PRIMARY KEY).
- Claves foráneas (FOREIGN KEY).
- Campos obligatorios (NOT NULL).
- Valores únicos (UNIQUE).
- Restricciones de validación (CHECK).
- Valores predeterminados (DEFAULT).

## Conexión

La base de datos está alojada en Supabase y el backend se conecta mediante PostgreSQL utilizando el paquete pg.

Las credenciales de conexión se configuran mediante variables de entorno en el backend.

## Ejecución del esquema

El esquema SQL permite crear la estructura inicial de la base de datos.

Para ejecutarlo localmente se puede utilizar PostgreSQL mediante pgAdmin o la terminal psql.

También se pueden ejecutar consultas desde el editor SQL de Supabase.

## Importante

Las credenciales de acceso a la base de datos no deben compartirse ni incluirse en archivos públicos del repositorio.