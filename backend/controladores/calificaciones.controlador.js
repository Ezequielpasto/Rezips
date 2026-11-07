const pool = require('../config/baseDatos')

async function AgregarCalificacion(req, res){
    const { id } = req.params
    const { id_usuario, valor } = req.body

    if(!id_usuario || !valor){
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        })
    }

    if(!Number.isInteger(valor) || valor < 1 || valor > 5){
        return res.status(400).json({
            mensaje: 'La calificación debe ser un número entre 1 y 5'
        })
    }

    try {
        const receta = await pool.query(
            'SELECT id_receta FROM receta WHERE id_receta = $1',
            [id]
        )

        if(receta.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            })
        }

        const resultado = await pool.query(
            `INSERT INTO calificacion (id_usuario, id_receta, valor)
             VALUES ($1, $2, $3)
             ON CONFLICT (id_usuario, id_receta)
             DO UPDATE SET valor = EXCLUDED.valor
             RETURNING *`,
            [id_usuario, id, valor]
        )

        res.status(201).json(resultado.rows[0])

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al agregar la calificación'
        })
    }
}

async function EliminarCalificacion(req, res){
    const { id } = req.params
    const { id_usuario } = req.body

    if(!id_usuario){
        return res.status(400).json({
            mensaje: 'Falta el ID del usuario'
        })
    }

    try {
        const resultado = await pool.query(
            `DELETE FROM calificacion
             WHERE id_usuario = $1 AND id_receta = $2
             RETURNING *`,
            [id_usuario, id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'La calificación no existe'
            })
        }

        res.json({
            mensaje: 'Calificación eliminada correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al eliminar la calificación'
        })
    }
}

module.exports = {
    AgregarCalificacion,
    EliminarCalificacion
}