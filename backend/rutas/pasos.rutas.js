const express = require('express');

const router = express.Router();

const { AgregarPaso, ObtenerPasos } = require('../controladores/pasos.controlador');

router.post('/:id/pasos', AgregarPaso);
router.get('/:id/pasos', ObtenerPasos)

module.exports = router;