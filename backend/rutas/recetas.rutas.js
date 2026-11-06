const express = require('express');

const router = express.Router();

const { ObtenerRecetas, ObtenerRecetaPorId, CrearReceta, ModificarReceta, EliminarReceta } = require('../controladores/recetas.controlador');

router.get('/', ObtenerRecetas);
router.get('/:id', ObtenerRecetaPorId)
router.post('/', CrearReceta)
router.put('/:id', ModificarReceta)
router.delete('/:id', EliminarReceta)

module.exports = router;