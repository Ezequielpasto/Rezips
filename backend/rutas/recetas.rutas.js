const express = require('express');

const router = express.Router();

const { ObtenerRecetas, ObtenerRecetaPorId, CrearReceta, ModificarReceta, EliminarReceta, ObtenerIngredientesReceta } = require('../controladores/recetas.controlador');
const { AgregarMeGusta, EliminarMeGusta, ObtenerMeGusta, ObtenerRecetasMeGusta } = require('../controladores/meGusta.controlador');
const { GuardarReceta, EliminarRecetaGuardada, ObtenerGuardados, ObtenerRecetasGuardadas } = require('../controladores/guardados.controlador');
const { ObtenerCalificaciones, AgregarCalificacion, EliminarCalificacion } = require('../controladores/calificaciones.controlador');

router.get('/', ObtenerRecetas);
router.get('/:id', ObtenerRecetaPorId)
router.get('/:id/ingredientes', ObtenerIngredientesReceta)
router.post('/', CrearReceta)
router.put('/:id', ModificarReceta)
router.delete('/:id', EliminarReceta)

router.post('/:id/me-gusta', AgregarMeGusta)
router.delete('/:id/me-gusta', EliminarMeGusta)
router.get('/:id/me-gusta', ObtenerMeGusta)
router.get('/usuario/:id/me-gusta', ObtenerRecetasMeGusta)

router.post('/:id/guardar', GuardarReceta);
router.delete('/:id/guardar', EliminarRecetaGuardada);
router.get('/:id/guardar', ObtenerGuardados)
router.get('/usuario/:id/guardadas', ObtenerRecetasGuardadas)

router.get('/:id/calificacion', ObtenerCalificaciones);
router.post('/:id/calificacion', AgregarCalificacion);
router.delete('/:id/calificacion', EliminarCalificacion);

module.exports = router;