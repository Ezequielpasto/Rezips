const pool = require('../config/baseDatos')

async function AgregarMeGusta(req, res){
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

        // Agregar me gusta
        await pool.query(
            `INSERT INTO me_gusta (id_usuario, id_receta)
             VALUES ($1, $2)`,
            [id_usuario, id]
        )

        res.status(201).json({
            mensaje: 'Me gusta agregado correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al agregar me gusta'
        })
    }
}

async function EliminarMeGusta(req, res){
    const { id } = req.params
    const { id_usuario } = req.body

    if(!id_usuario){
        return res.status(400).json({
            mensaje: 'Falta el ID del usuario'
        })
    }

    try {
        const resultado = await pool.query(
            `DELETE FROM me_gusta
             WHERE id_usuario = $1 AND id_receta = $2
             RETURNING *`,
            [id_usuario, id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Me gusta no encontrado'
            })
        }

        res.json({
            mensaje: 'Me gusta eliminado correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al eliminar me gusta'
        })
    }
}

module.exports = {
    AgregarMeGusta,
    EliminarMeGusta
}