const express = require('express');
const router = express.Router();

const { ObtenerCategorias, ObtenerCategoriaPorId } = require('../controladores/categorias.controlador');

router.get('/', ObtenerCategorias);
router.get('/:id', ObtenerCategoriaPorId)

module.exports = router;