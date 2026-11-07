const express = require('express');
const router = express.Router();

const { RegistrarUsuario, IniciarSesion, ObtenerUsuarios, ObtenerUsuarioPorId, EliminarUsuario } = require('../controladores/usuarios.controlador');

router.post('/registro', RegistrarUsuario);
router.post('/login', IniciarSesion);
router.get('/', ObtenerUsuarios);
router.get('/:id', ObtenerUsuarioPorId);
router.delete('/:id', EliminarUsuario);

module.exports = router;