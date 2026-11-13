const pool = require('../config/baseDatos')
const bcrypt = require('bcrypt')

async function RegistrarUsuario(req, res){
    const {
        nombre,
        apellido,
        correo,
        contrasena,
        fecha_nacimiento
    } = req.body

    if(!nombre || !correo || !contrasena){
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        })
    }

    try {
        // Comprobar si el correo ya está registrado
        const existe = await pool.query(
            'SELECT id_usuario FROM usuario WHERE correo = $1',
            [correo]
        )

        if(existe.rows.length > 0){
            return res.status(409).json({
                mensaje: 'El correo ya está registrado'
            })
        }

        // Encriptar la contraseña
        const hash = await bcrypt.hash(contrasena, 10)

        // Crear usuario
        const resultado = await pool.query(
            `INSERT INTO usuario
            (nombre, apellido, correo, hash_contrasenia, fecha_nacimiento)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_usuario, nombre, apellido, correo, fecha_nacimiento`,
            [nombre, apellido || null, correo, hash, fecha_nacimiento || null]
        )

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: resultado.rows[0]
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al registrar el usuario'
        })
    }
}

async function IniciarSesion(req, res){
    const { correo, contrasena } = req.body

    if(!correo || !contrasena){
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        })
    }

    try {
        // Buscar usuario por correo
        const resultado = await pool.query(
            'SELECT * FROM usuario WHERE correo = $1',
            [correo]
        )

        if(resultado.rows.length === 0){
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            })
        }

        const usuario = resultado.rows[0]

        // Comparar contraseña con el hash guardado
        const coincide = await bcrypt.compare(
            contrasena,
            usuario.hash_contrasenia
        )

        if(!coincide){
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            })
        }

        res.json({
            mensaje: 'Inicio de sesión correcto',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo
            }
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al iniciar sesión'
        })
    }
}

async function ObtenerUsuarios(req, res){
    try {
        const resultado = await pool.query(
            `SELECT id_usuario, nombre, apellido, correo, fecha_nacimiento
             FROM usuario`
        )

        res.json(resultado.rows)

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener los usuarios'
        })
    }
}

async function ObtenerUsuarioPorId(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            `SELECT id_usuario, nombre, apellido, correo, fecha_nacimiento
             FROM usuario
             WHERE id_usuario = $1`,
            [id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            })
        }

        res.json(resultado.rows[0])

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener el usuario'
        })
    }
}


async function EliminarUsuario(req, res) {
    const { id } = req.params;
    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        // 1. Eliminar comentarios escritos por el usuario
        // y comentarios de otros usuarios en sus recetas.
        await conexion.query(
            `DELETE FROM comentario
             WHERE id_usuario = $1
             OR id_receta IN (
                 SELECT id_receta
                 FROM receta
                 WHERE id_usuario = $1
             )`,
            [id]
        );

        // 2. Eliminar los me gusta del usuario
        // y los me gusta recibidos por sus recetas.
        await conexion.query(
            `DELETE FROM me_gusta
             WHERE id_usuario = $1
             OR id_receta IN (
                 SELECT id_receta
                 FROM receta
                 WHERE id_usuario = $1
             )`,
            [id]
        );

        // 3. Eliminar las recetas guardadas por el usuario
        // y las veces que otros usuarios guardaron sus recetas.
        await conexion.query(
            `DELETE FROM receta_guardada
             WHERE id_usuario = $1
             OR id_receta IN (
                 SELECT id_receta
                 FROM receta
                 WHERE id_usuario = $1
             )`,
            [id]
        );

        // 4. Eliminar las calificaciones realizadas por el usuario
        // y las calificaciones recibidas por sus recetas.
        await conexion.query(
            `DELETE FROM calificacion
             WHERE id_usuario = $1
             OR id_receta IN (
                 SELECT id_receta
                 FROM receta
                 WHERE id_usuario = $1
             )`,
            [id]
        );

        // 5. Eliminar los pasos de sus recetas.
        await conexion.query(
            `DELETE FROM paso
             WHERE id_receta IN (
                 SELECT id_receta
                 FROM receta
                 WHERE id_usuario = $1
             )`,
            [id]
        );

        // 6. Eliminar los ingredientes asociados a sus recetas.
        await conexion.query(
            `DELETE FROM ingrediente_receta
             WHERE id_receta IN (
                 SELECT id_receta
                 FROM receta
                 WHERE id_usuario = $1
             )`,
            [id]
        );

        // 7. Eliminar sus recetas.
        await conexion.query(
            'DELETE FROM receta WHERE id_usuario = $1',
            [id]
        );

        // 8. Eliminar el usuario.
        const resultado = await conexion.query(
            `DELETE FROM usuario
             WHERE id_usuario = $1
             RETURNING id_usuario`,
            [id]
        );

        if (resultado.rows.length === 0) {
            await conexion.query('ROLLBACK');

            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        // Confirmar todas las eliminaciones.
        await conexion.query('COMMIT');

        res.json({
            mensaje: 'Usuario y todos sus datos eliminados correctamente'
        });

    } catch (error) {
        await conexion.query('ROLLBACK');

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el usuario'
        });

    } finally {
        conexion.release();
    }
}


async function ObtenerRecetasGuardadas(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            `SELECT r.*
             FROM receta_guardada rg
             JOIN receta r ON rg.id_receta = r.id_receta
             WHERE rg.id_usuario = $1`,
            [id]
        )

        res.json(resultado.rows)

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener las recetas guardadas'
        })
    }
}

async function ObtenerRecetasMeGusta(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            `SELECT r.*
             FROM me_gusta mg
             JOIN receta r ON mg.id_receta = r.id_receta
             WHERE mg.id_usuario = $1`,
            [id]
        )

        res.json(resultado.rows)

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener las recetas con me gusta'
        })
    }
}

async function ModificarDatosUsuario(req, res) {
    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento } = req.body;

    if (!nombre) {
        return res.status(400).json({
            mensaje: 'El nombre es obligatorio'
        });
    }

    try {
        const resultado = await pool.query(
            `UPDATE usuario
             SET nombre = $1,
                 apellido = $2,
                 fecha_nacimiento = $3
             WHERE id_usuario = $4
             RETURNING id_usuario, nombre, apellido, correo, fecha_nacimiento`,
            [nombre, apellido || null, fecha_nacimiento || null, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json({
            mensaje: 'Datos personales actualizados correctamente',
            usuario: resultado.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al modificar los datos personales'
        });
    }
}

async function CambiarCorreo(req, res) {
    const { id } = req.params;
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({
            mensaje: 'El correo es obligatorio'
        });
    }

    try {
        const existe = await pool.query(
            `SELECT id_usuario
             FROM usuario
             WHERE correo = $1 AND id_usuario != $2`,
            [correo, id]
        );

        if (existe.rows.length > 0) {
            return res.status(409).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        const resultado = await pool.query(
            `UPDATE usuario
             SET correo = $1
             WHERE id_usuario = $2
             RETURNING id_usuario, nombre, apellido, correo, fecha_nacimiento`,
            [correo, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json({
            mensaje: 'Correo actualizado correctamente',
            usuario: resultado.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al cambiar el correo'
        });
    }
}

async function CambiarContraseña(req, res) {
    const { id } = req.params;
    const { contrasenaActual, contrasenaNueva } = req.body;

    if (!contrasenaActual || !contrasenaNueva) {
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    try {
        const resultado = await pool.query(
            `SELECT hash_contrasenia
             FROM usuario
             WHERE id_usuario = $1`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const coincide = await bcrypt.compare(
            contrasenaActual,
            resultado.rows[0].hash_contrasenia
        );

        if (!coincide) {
            return res.status(401).json({
                mensaje: 'La contraseña actual es incorrecta'
            });
        }

        const hash = await bcrypt.hash(contrasenaNueva, 10);

        await pool.query(
            `UPDATE usuario
             SET hash_contrasenia = $1
             WHERE id_usuario = $2`,
            [hash, id]
        );

        res.json({
            mensaje: 'Contraseña actualizada correctamente'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al cambiar la contraseña'
        });
    }
}


module.exports = {
    RegistrarUsuario,
    IniciarSesion,
    ObtenerUsuarios,
    ObtenerUsuarioPorId,
    EliminarUsuario,
    ObtenerRecetasMeGusta,
    ObtenerRecetasGuardadas,
    ModificarDatosUsuario,
    CambiarCorreo,
    CambiarContraseña
}