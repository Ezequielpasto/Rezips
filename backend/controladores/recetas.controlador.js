const pool = require('../config/baseDatos')

async function ObtenerRecetas(req, res){
    
    try{
        const resultado = await pool.query('SELECT * FROM receta')
        res.json(resultado.rows)
    }
    catch(error){
        res.status(500).json({
            mensaje: 'Error al obtener las recetas'
        })
    }
}

async function ObtenerRecetaPorId(req, res){
    const id = Number(req.params.id)
    try{
        const resultado = await pool.query('SELECT * FROM receta WHERE id_receta = $1', [id])

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            })
        }
        
        res.json(resultado.rows[0])
    } catch(error){
        onsole.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener la receta'
        })
    }
}

async function CrearReceta(req, res){
    const { nombre, duracion, cantidadPorciones, imagen, id_usuario, id_categoria } = req.body

    if(!nombre || !duracion || !cantidadPorciones || !id_usuario || !id_categoria){
        return res.status(400).json({
            mensaje: "Faltan datos obligatorios"
        })
    }

    try {
        const resultado = await pool.query(
            `INSERT INTO receta 
            (nombre, duracion, cantidad_porciones, imagen, id_usuario, id_categoria)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [nombre, duracion, cantidadPorciones, imagen || null, id_usuario, id_categoria]

            
        )

        res.status(201).json({
            mensaje: 'Receta creada correctamente',
            receta: resultado.rows[0]
        })

    }catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al crear la receta'
        })
    }
}

async function ModificarReceta(req, res){
    const id = Number(req.params.id)

    const { nombre, duracion, cantidadPorciones, imagen, id_usuario, id_categoria } = req.body

    try {
        const resultado = await pool.query(
            `UPDATE receta
             SET nombre = $1,
                 duracion = $2,
                 cantidad_porciones = $3,
                 imagen = $4,
                 id_usuario = $5,
                 id_categoria = $6
             WHERE id_receta = $7
             RETURNING *`,
            [nombre, duracion, cantidadPorciones, imagen || null, id_usuario, id_categoria, id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            })
        }
        res.json({
            mensaje: 'Receta modificada correctamente',
            receta: resultado.rows[0]
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({
            mensaje: 'Error al modificar la receta'
        })
        }
}

async function EliminarReceta(req, res){
    const id = Number(req.params.id)

    try {
        const resultado = await pool.query(
            'DELETE FROM receta WHERE id_receta = $1 RETURNING *', [id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            })
        }

        res.json({
            mensaje: 'Receta eliminada correctamente'
        })

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al eliminar la receta'
        })
    }
}

async function ObtenerIngredientesReceta(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            `SELECT i.id_ingrediente, i.nombre,
                    ir.cantidad, ir.unidad
             FROM ingrediente_receta ir
             JOIN ingrediente i ON ir.id_ingrediente = i.id_ingrediente
             WHERE ir.id_receta = $1`,
            [id]
        )

        res.json(resultado.rows)

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener los ingredientes de la receta'
        })
    }
}


module.exports = {
    ObtenerRecetas,
    ObtenerRecetaPorId,
    CrearReceta,
    ModificarReceta,
    EliminarReceta,
    ObtenerIngredientesReceta
}