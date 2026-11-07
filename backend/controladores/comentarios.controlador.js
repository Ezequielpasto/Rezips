const pool = require('../config/baseDatos')

async function ObtenerComentarios(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            `SELECT c.id_comentario, c.descripcion, c.fecha,
                    c.id_usuario, u.nombre, u.apellido
             FROM comentario c
             JOIN usuario u ON c.id_usuario = u.id_usuario
             WHERE c.id_receta = $1
             ORDER BY c.fecha DESC`,
            [id]
        )

        res.json(resultado.rows)

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener los comentarios'
        })
    }
}

async function AgregarComentario(req, res){
    const { id } = req.params
    const { id_usuario, descripcion } = req.body

    if(!id_usuario || !descripcion || !descripcion.trim()){
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        })
    }

    try {
        const resultado = await pool.query(
            `INSERT INTO comentario (descripcion, id_usuario, id_receta)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [descripcion.trim(), id_usuario, id]
        )

        res.status(201).json(resultado.rows[0])

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al agregar el comentario'
        })
    }
}

async function EliminarComentario(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            `DELETE FROM comentario
             WHERE id_comentario = $1
             RETURNING *`,
            [id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Comentario no encontrado'
            })
        }

        res.json({
            mensaje: 'Comentario eliminado correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al eliminar el comentario'
        })
    }
}

module.exports = {
    ObtenerComentarios,
    AgregarComentario,
    EliminarComentario
}