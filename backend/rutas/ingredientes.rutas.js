const express = require('express');

const router = express.Router();

const { AgregarIngrediente } = require('../controladores/ingredientes.controlador');

router.post('/', AgregarIngrediente)

module.exports = router;