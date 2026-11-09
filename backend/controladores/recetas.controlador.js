const pool = require('../config/baseDatos')

async function ObtenerRecetas(req, res){
    const idUsuario = req.query.id_usuario || null
    
    try{
        const resultado = await pool.query(`
            SELECT r.id_receta, r.nombre, r.duracion, r.cantidad_porciones, r.imagen, r.id_usuario, r.id_categoria,
                c.nombre AS categoria,

                json_build_object(
                    'nombre', u.nombre,
                    'apellido', u.apellido
                ) AS creador,

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
                    JOIN ingrediente i
                        ON i.id_ingrediente = ir.id_ingrediente
                    WHERE ir.id_receta = r.id_receta
                ), '[]'::json) AS ingredientes,

                COALESCE((
                    SELECT json_agg(
                        json_build_object('valor', ca.valor)
                    )
                    FROM calificacion ca
                    WHERE ca.id_receta = r.id_receta
                ), '[]'::json) AS calificaciones,

                COALESCE((
                    SELECT json_agg(us.correo)
                    FROM me_gusta mg
                    JOIN usuario us ON us.id_usuario = mg.id_usuario
                    WHERE mg.id_receta = r.id_receta
                ), '[]'::json) AS "meGusta",

                COALESCE((
                    SELECT json_agg(us.correo)
                    FROM receta_guardada rg
                    JOIN usuario us ON us.id_usuario = rg.id_usuario
                    WHERE rg.id_receta = r.id_receta
                ), '[]'::json) AS guardados

            FROM receta r
            JOIN categoria c ON c.id_categoria = r.id_categoria
            JOIN usuario u ON u.id_usuario = r.id_usuario
            WHERE ($1::INTEGER IS NULL OR r.id_usuario = $1)
            ORDER BY r.id_receta DESC
        `, [idUsuario])
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
        const resultado = await pool.query(`SELECT r.*, c.nombre AS categoria
                                            FROM receta r
                                            INNER JOIN categoria c ON r.id_categoria = c.id_categoria
                                            WHERE r.id_receta = $1`, [id])

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            })
        }
        
        res.json(resultado.rows[0])
    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener la receta'
        })
    }
}

async function CrearReceta(req, res){
    const { nombre, duracion, cantidad_porciones, imagen, id_usuario, id_categoria } = req.body

    if(!nombre || !duracion || !cantidad_porciones || !id_usuario || !id_categoria){
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
            [nombre, duracion, cantidad_porciones, imagen || null, id_usuario, id_categoria]

            
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
    const { id } = req.params
    const { nombre, duracion, cantidad_porciones, imagen, id_usuario, id_categoria, ingredientes, pasos} = req.body
    const idReceta = Number(id)

    // Validar datos principales
    if( !idReceta || !nombre || !duracion || duracion <= 0 || !cantidad_porciones || cantidad_porciones <= 0 ||
        !id_usuario || !id_categoria || !Array.isArray(ingredientes) || !Array.isArray(pasos)
    ){
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        })
    }

    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Actualizar datos principales de la receta
        const resultado = await client.query(
            `UPDATE receta
             SET nombre = $1,
                 duracion = $2,
                 cantidad_porciones = $3,
                 imagen = COALESCE($4, imagen),
                 id_categoria = $5
             WHERE id_receta = $6 AND id_usuario = $7
             RETURNING *`,
            [
                nombre,
                duracion,
                cantidad_porciones,
                imagen || null,
                id_categoria,
                idReceta,
                id_usuario
            ]
        )

        if(resultado.rows.length === 0){
            await client.query('ROLLBACK')

            return res.status(404).json({
                mensaje: 'Receta no encontrada o no pertenece al usuario'
            })
        }

        // Eliminar ingredientes anteriores de la receta
        await client.query(
            `DELETE FROM ingrediente_receta
             WHERE id_receta = $1`,
            [idReceta]
        )

        // Insertar los ingredientes actualizados
        for(const ingrediente of ingredientes){

            if(
                !ingrediente.nombre ||
                !ingrediente.cantidad ||
                ingrediente.cantidad <= 0
            ){
                throw new Error('Datos de ingrediente inválidos')
            }

            // Buscar si el ingrediente ya existe
            let resultadoIngrediente = await client.query(
                `SELECT id_ingrediente
                 FROM ingrediente
                 WHERE LOWER(nombre) = LOWER($1)`,
                [ingrediente.nombre]
            )

            let idIngrediente

            if(resultadoIngrediente.rows.length === 0){

                resultadoIngrediente = await client.query(
                    `INSERT INTO ingrediente (nombre)
                     VALUES ($1)
                     RETURNING id_ingrediente`,
                    [ingrediente.nombre]
                )
            }

            idIngrediente = resultadoIngrediente.rows[0].id_ingrediente

            // Relacionar ingrediente con receta
            await client.query(
                `INSERT INTO ingrediente_receta
                 (id_ingrediente, id_receta, cantidad, unidad)
                 VALUES ($1, $2, $3, $4)`,
                [
                    idIngrediente,
                    idReceta,
                    ingrediente.cantidad,
                    ingrediente.unidad
                ]
            )
        }

        // Eliminar pasos anteriores
        await client.query(
            `DELETE FROM paso
             WHERE id_receta = $1`,
            [idReceta]
        )

        // Insertar los pasos actualizados
        for(let i = 0; i < pasos.length; i++){

            const paso = pasos[i]

            if(!paso.descripcion){
                throw new Error('Descripción de paso inválida')
            }

            await client.query(
                `INSERT INTO paso (descripcion, numero, id_receta)
                 VALUES ($1, $2, $3)`,
                [
                    paso.descripcion,
                    i + 1,
                    idReceta
                ]
            )
        }

        await client.query('COMMIT')

        res.json({
            mensaje: 'Receta modificada correctamente',
            receta: resultado.rows[0]
        })

    } catch(error){

        await client.query('ROLLBACK')

        console.error(error)

        res.status(500).json({
            mensaje: 'Error al modificar la receta'
        })

    } finally {
        client.release()
    }
}

async function EliminarReceta(req, res){
    const id = Number(req.params.id)
    const conexion = await pool.connect()

    try {
        await conexion.query('BEGIN')

        // Verificar que exista la receta
        const receta = await conexion.query(
            'SELECT * FROM receta WHERE id_receta = $1',
            [id]
        )

        if(receta.rows.length === 0){
            await conexion.query('ROLLBACK')
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            })
        }

        // Eliminar registros relacionados
        await conexion.query(
            'DELETE FROM comentario WHERE id_receta = $1',
            [id]
        )

        await conexion.query(
            'DELETE FROM paso WHERE id_receta = $1',
            [id]
        )

        await conexion.query(
            'DELETE FROM ingrediente_receta WHERE id_receta = $1',
            [id]
        )

        await conexion.query(
            'DELETE FROM me_gusta WHERE id_receta = $1',
            [id]
        )

        await conexion.query(
            'DELETE FROM calificacion WHERE id_receta = $1',
            [id]
        )

        await conexion.query(
            'DELETE FROM receta_guardada WHERE id_receta = $1',
            [id]
        )

        // Finalmente, eliminar la receta
        await conexion.query(
            'DELETE FROM receta WHERE id_receta = $1',
            [id]
        )

        await conexion.query('COMMIT')

        res.json({
            mensaje: 'Receta eliminada correctamente'
        })

    } catch(error){
        await conexion.query('ROLLBACK')
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al eliminar la receta'
        })

    } finally {
        conexion.release()
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