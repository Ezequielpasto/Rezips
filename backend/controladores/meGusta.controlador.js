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

async function ObtenerMeGusta(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            `SELECT id_usuario, id_receta
             FROM me_gusta
             WHERE id_receta = $1`,
            [id]
        )

        res.json(resultado.rows)

    } catch(error){
        console.error(error)
        res.status(500).json({
            mensaje: 'Error al obtener los me gusta'
        })
    }
}

async function ObtenerRecetasMeGusta(req, res){
    const { id } = req.params

    try {
        
const resultado = await pool.query(
            `SELECT r.*, c.nombre AS categoria,
            COALESCE((
                SELECT json_agg(
                    json_build_object(
                        'id_ingrediente', i.id_ingrediente,
                        'nombre', i.nombre,
                        'cantidad', ir.cantidad,
                        'unidad', ir.unidad
                    )
                )
                FROM ingrediente_receta ir
                JOIN ingrediente i ON i.id_ingrediente = ir.id_ingrediente
                WHERE ir.id_receta = r.id_receta
            ), '[]'::json) AS ingredientes,

            COALESCE((
                SELECT json_agg(json_build_object('valor', ca.valor))
                FROM calificacion ca
                WHERE ca.id_receta = r.id_receta
            ), '[]'::json) AS calificaciones,

            COALESCE((
                SELECT json_agg(us.correo)
                FROM me_gusta mg2
                JOIN usuario us ON us.id_usuario = mg2.id_usuario
                WHERE mg2.id_receta = r.id_receta
            ), '[]'::json) AS "meGusta",

            COALESCE((
                SELECT json_agg(us.correo)
                FROM receta_guardada rg
                JOIN usuario us ON us.id_usuario = rg.id_usuario
                WHERE rg.id_receta = r.id_receta
            ), '[]'::json) AS guardados

        FROM me_gusta mg
        JOIN receta r ON r.id_receta = mg.id_receta
        JOIN categoria c ON c.id_categoria = r.id_categoria
        WHERE mg.id_usuario = $1
        ORDER BY r.id_receta DESC`,
        [id]
    )


        res.json(resultado.rows)

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener los me gusta'
        })
    }
}

module.exports = {
    AgregarMeGusta,
    EliminarMeGusta,
    ObtenerMeGusta,
    ObtenerRecetasMeGusta
}