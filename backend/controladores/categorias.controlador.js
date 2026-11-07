const pool = require('../config/baseDatos')

async function ObtenerCategorias(req, res){
    try {
        const resultado = await pool.query(
            'SELECT * FROM categoria'
        )

        res.json(resultado.rows)

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener las categorías'
        })
    }
}

async function ObtenerCategoriaPorId(req, res){
    const { id } = req.params

    try {
        const resultado = await pool.query(
            'SELECT * FROM categoria WHERE id_categoria = $1',
            [id]
        )

        if(resultado.rows.length === 0){
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            })
        }

        res.json(resultado.rows[0])

    } catch(error){
        console.error(error)

        res.status(500).json({
            mensaje: 'Error al obtener la categoría'
        })
    }
}

module.exports = {
    ObtenerCategorias,
    ObtenerCategoriaPorId
}