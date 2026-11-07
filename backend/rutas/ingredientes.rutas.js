const express = require('express');

const router = express.Router();

const { AgregarIngrediente, ObtenerIngredientes, ObtenerIngredientePorId } = require('../controladores/ingredientes.controlador');

router.post('/', AgregarIngrediente)
router.get('/', ObtenerIngredientes)
router.get('/:id', ObtenerIngredientePorId)

module.exports = router;