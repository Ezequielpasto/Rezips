const express = require('express');
const router = express.Router();

const { RegistrarUsuario, IniciarSesion, ObtenerUsuarios, ObtenerUsuarioPorId, EliminarUsuario, ObtenerRecetasMeGusta, ObtenerRecetasGuardadas, ModificarDatosUsuario, CambiarCorreo, CambiarContraseña } = require('../controladores/usuarios.controlador');

router.post('/registro', RegistrarUsuario);
router.post('/login', IniciarSesion);
router.get('/', ObtenerUsuarios);
router.get('/:id', ObtenerUsuarioPorId);
router.delete('/:id', EliminarUsuario);
router.get('/:id/guardadas', ObtenerRecetasGuardadas);
router.get('/:id/me-gusta', ObtenerRecetasMeGusta);
router.put('/:id', ModificarDatosUsuario);
router.put('/:id/correo', CambiarCorreo);
router.put('/:id/contrasenia', CambiarContraseña);

module.exports = router;