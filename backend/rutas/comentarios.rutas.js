const express = require('express');

const router = express.Router();

const { ObtenerComentarios, AgregarComentario, EliminarComentario } = require('../controladores/comentarios.controlador');

router.get('/:id/comentarios', ObtenerComentarios);
router.post('/:id/comentarios', AgregarComentario);
router.delete('/:id', EliminarComentario);

module.exports = router;