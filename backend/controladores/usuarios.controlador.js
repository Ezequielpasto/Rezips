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

async function EliminarUsuario(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            'DELETE FROM usuario WHERE id_usuario = $1 RETURNING id_usuario',
            [id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            })
        }

        res.json({
            mensaje: 'Usuario eliminado correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al eliminar el usuario'
        })
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

module.exports = {
    RegistrarUsuario,
    IniciarSesion,
    ObtenerUsuarios,
    ObtenerUsuarioPorId,
    EliminarUsuario,
    ObtenerRecetasMeGusta,
    ObtenerRecetasGuardadas
}