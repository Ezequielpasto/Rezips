const pool = require('../config/baseDatos');

async function AgregarIngrediente(req, res){
    const { id_receta, nombre, cantidad, unidad } = req.body;
    const idReceta = Number(id_receta);

    if(!idReceta || !nombre || !cantidad || cantidad <= 0){
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    try {
        // Comprobar que la receta exista
        const receta = await pool.query(
            'SELECT id_receta FROM receta WHERE id_receta = $1',
            [idReceta]
        );

        if(receta.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Receta no encontrada'
            });
        }

        // Buscar si el ingrediente ya existe
        let resultado = await pool.query(
            'SELECT * FROM ingrediente WHERE nombre = $1',
            [nombre]
        );

        let idIngrediente;    

        if(resultado.rows.length === 0){
            resultado = await pool.query(
                'INSERT INTO ingrediente (nombre) VALUES ($1) RETURNING *',
                [nombre]
            );
        }

        idIngrediente = resultado.rows[0].id_ingrediente;

        const existe = await pool.query(
            `SELECT * FROM ingrediente_receta
            WHERE id_ingrediente = $1 AND id_receta = $2`,
            [idIngrediente, idReceta]
        );

        if(existe.rows.length > 0){
            return res.status(409).json({
                mensaje: 'Este ingrediente ya está agregado a la receta'
            });
        }

        if(existe.rows.length > 0){
            return res.status(409).json({
                mensaje: 'Este ingrediente ya está agregado a la receta'
            });
        }

        // Relacionar ingrediente y receta
        await pool.query(
            `INSERT INTO ingrediente_receta
            (id_ingrediente, id_receta, cantidad, unidad)
            VALUES ($1, $2, $3, $4)`,
            [idIngrediente, idReceta, cantidad, unidad]
        );

        res.status(201).json({
            mensaje: 'Ingrediente agregado correctamente'
        });

    } catch(error){
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al agregar el ingrediente'
        });
    }
}

async function ObtenerIngredientes(req, res){
    try {
        const resultado = await pool.query(
            'SELECT * FROM ingrediente'
        )

        res.json(resultado.rows);
    } catch(error){
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los ingredientes'
        })
    }
}

async function ObtenerIngredientePorId(req, res){
    const { id } = req.params

    try{
        const resultado = await pool.query(
            'SELECT * FROM ingrediente WHERE id_ingrediente = $1',
            [id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Ingrediente no encontrado'
            })
        }

        res.json(resultado.rows[0])
    } catch(error){
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el ingrediente'
        });
    }
}

module.exports = {
    AgregarIngrediente,
    ObtenerIngredientes,
    ObtenerIngredientePorId
}
