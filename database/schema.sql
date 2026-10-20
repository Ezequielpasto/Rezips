CREATE TABLE usuario(
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    correo VARCHAR(100) UNIQUE NOT NULL,
    hash_contrasenia TEXT NOT NULL,
    fecha_nacimiento DATE
);

CREATE TABLE receta(
    id_receta SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    duracion INT CHECK (duracion > 0),
    cantidad_porciones INT CHECK (cantidad_porciones > 0),
    imagen TEXT,
    id_usuario INT REFERENCES usuario(id_usuario),
    id_categoria INT REFERENCES categoria(id_categoria)
);