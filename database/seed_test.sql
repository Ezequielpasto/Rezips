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

INSERT INTO paso(descripcion, numero, id_receta)
VALUES
    ('Mezclar la harina con la sal', 1, 1),
    ('Agregar la levadura con el azucar', 2, 1),
    ('Agregarle el aceite y agua', 3, 1),
    ('Amasar durante 5 minutos', 4, 1),
    ('Dejar leudar mediante media hora', 5, 1),
    ('Hornearla durante 45 minutos', 6, 1);

INSERT INTO comentario(descripcion, id_usuario, id_receta)
VALUES ('¡Buena receta!', 1, 1);