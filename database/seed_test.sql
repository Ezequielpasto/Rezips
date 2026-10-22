INSERT INTO usuario(nombre, apellido, correo, hash_contrasenia, fecha_nacimiento)
VALUES('Ezequiel', 'Pastorino', 'ezequielpastorino2020@gmail.com', 'dkekriwkwddd', '2007-01-25');

INSERT INTO categoria(nombre)
VALUES ('panaderia');

INSERT INTO receta(nombre, duracion, cantidad_porciones, imagen, id_usuario, id_categoria)
VALUES ('Pizza', 100, 8, NULL, 1, 1);

INSERT INTO ingrediente(nombre)
VALUES 
    ('Harina'),
    ('Sal'),
    ('Levadura'),
    ('Aceite'),
    ('azucar'),
    ('Agua');

INSERT INTO ingrediente_receta(id_ingrediente, id_receta, cantidad, unidad)
VALUES
    ( 1, 1, 500.00,'gr'),
    ( 2, 1, 0.5,'cda'),
    ( 3, 1, 50,'gr'),
    ( 4, 1, 2,'cda'),
    ( 5, 1, 1,'cdta'),
    ( 6, 1, 300,'ml');