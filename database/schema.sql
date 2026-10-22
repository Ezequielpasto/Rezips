CREATE TABLE usuario(
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    correo VARCHAR(100) UNIQUE NOT NULL,
    hash_contrasenia TEXT NOT NULL,
    fecha_nacimiento DATE
);

CREATE TABLE categoria(
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE receta(
    id_receta SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    duracion INT CHECK (duracion > 0),
    cantidad_porciones INT CHECK (cantidad_porciones > 0),
    imagen TEXT,
    id_usuario INT REFERENCES usuario(id_usuario) NOT NULL,
    id_categoria INT REFERENCES categoria(id_categoria) NOT NULL
);

CREATE TABLE ingrediente(
    id_ingrediente SERIAL PRIMARY KEY,
    nombre VARCHAR(20) UNIQUE NOT NULL 
);

CREATE TABLE ingrediente_receta(
    id_ingrediente INT REFERENCES ingrediente(id_ingrediente),
    id_receta INT REFERENCES receta(id_receta),
    PRIMARY KEY (id_ingrediente, id_receta),
    cantidad DECIMAL(10,2) CHECK (cantidad > 0) NOT NULL,
    unidad VARCHAR(10)
);

CREATE TABLE paso(
    id_paso SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    numero INT CHECK (numero >= 1) NOT NULL,
    id_receta INT REFERENCES receta(id_receta) NOT NULL,
    UNIQUE (id_receta, numero)
);

CREATE TABLE comentario(
    id_comentario SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    id_usuario INT REFERENCES usuario(id_usuario) NOT NULL,
    id_receta INT REFERENCES receta(id_receta) NOT NULL
);

CREATE TABLE me_gusta(
    id_usuario INT REFERENCES usuario(id_usuario),
    id_receta INT REFERENCES receta(id_receta),
    PRIMARY KEY (id_usuario, id_receta)
);

CREATE TABLE calificacion(
    id_usuario INT REFERENCES usuario(id_usuario),
    id_receta INT REFERENCES receta(id_receta),
    PRIMARY KEY (id_usuario, id_receta),
    valor INT CHECK (valor BETWEEN 1 AND 5) NOT NULL
);

CREATE TABLE receta_guardada(
    id_usuario INT REFERENCES usuario(id_usuario),
    id_receta INT REFERENCES receta(id_receta),
    PRIMARY KEY (id_usuario, id_receta)
);