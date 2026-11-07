const express = require('express');
const router = express.Router();

const { RegistrarUsuario, IniciarSesion, ObtenerUsuarios, ObtenerUsuarioPorId, EliminarUsuario, ObtenerRecetasMeGusta, ObtenerRecetasGuardadas } = require('../controladores/usuarios.controlador');

router.post('/registro', RegistrarUsuario);
router.post('/login', IniciarSesion);
router.get('/', ObtenerUsuarios);
router.get('/:id', ObtenerUsuarioPorId);
router.delete('/:id', EliminarUsuario);
router.get('/:id/guardadas', ObtenerRecetasGuardadas);
router.get('/:id/me-gusta', ObtenerRecetasMeGusta);

module.exports = router;