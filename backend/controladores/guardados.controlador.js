const pool = require('../config/baseDatos')

async function GuardarReceta(req, res){
    const { id } = req.params
    const { id_usuario } = req.body

    if(!id_usuario){
        return res.status(400).json({
            mensaje: 'Falta el ID del usuario'
        })
    }

    try {
        // Comprobar que la receta exista
        const receta = await pool.query(
            'SELECT id_receta FROM receta WHERE id_receta = $1',
            [id]
        )

        if(receta.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            })
        }

        // Comprobar si ya está guardada
        const existe = await pool.query(
            `SELECT * FROM receta_guardada
             WHERE id_usuario = $1 AND id_receta = $2`,
            [id_usuario, id]
        )

        if(existe.rows.length > 0){
            return res.status(409).json({
                mensaje: 'La receta ya está guardada'
            })
        }

        await pool.query(
            `INSERT INTO receta_guardada (id_usuario, id_receta)
             VALUES ($1, $2)`,
            [id_usuario, id]
        )

        res.status(201).json({
            mensaje: 'Receta guardada correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al guardar la receta'
        })
    }
}

async function EliminarRecetaGuardada(req, res){
    const { id } = req.params
    const { id_usuario } = req.body

    if(!id_usuario){
        return res.status(400).json({
            mensaje: 'Falta el ID del usuario'
        })
    }

    try {
        const resultado = await pool.query(
            `DELETE FROM receta_guardada
             WHERE id_usuario = $1 AND id_receta = $2
             RETURNING *`,
            [id_usuario, id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'La receta guardada no existe'
            })
        }

        res.json({
            mensaje: 'Receta eliminada de guardados correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al eliminar la receta guardada'
        })
    }
}

module.exports = {
    GuardarReceta,
    EliminarRecetaGuardada
}