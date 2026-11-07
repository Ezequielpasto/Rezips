const pool = require('../config/baseDatos');

async function AgregarPaso(req, res){
    const { id } = req.params;
    const { descripcion, numero } = req.body;

    const idReceta = Number(id);

    if(!idReceta || !descripcion || !numero || numero < 1){
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

        // Agregar el paso
        const resultado = await pool.query(
            `INSERT INTO paso (descripcion, numero, id_receta)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [descripcion, numero, idReceta]
        );

        res.status(201).json({
            mensaje: 'Paso agregado correctamente',
            paso: resultado.rows[0]
        });

    } catch(error){
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al agregar el paso'
        });
    }
}

async function ObtenerPasos(req, res){
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            `SELECT * FROM paso
             WHERE id_receta = $1
             ORDER BY numero ASC`,
            [id]
        );

        res.json(resultado.rows);

    } catch(error){
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los pasos'
        });
    }
}

module.exports = {
    AgregarPaso,
    ObtenerPasos
};