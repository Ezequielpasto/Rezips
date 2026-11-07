const express = require('express');

const router = express.Router();

const { ObtenerRecetas, ObtenerRecetaPorId, CrearReceta, ModificarReceta, EliminarReceta, ObtenerIngredientesReceta } = require('../controladores/recetas.controlador');
const { AgregarMeGusta, EliminarMeGusta } = require('../controladores/meGusta.controlador');
const { GuardarReceta, EliminarRecetaGuardada } = require('../controladores/guardados.controlador');
const { AgregarCalificacion, EliminarCalificacion } = require('../controladores/calificaciones.controlador');

router.get('/', ObtenerRecetas);
router.get('/:id', ObtenerRecetaPorId)
router.get('/:id/ingredientes', ObtenerIngredientesReceta)
router.post('/', CrearReceta)
router.put('/:id', ModificarReceta)
router.delete('/:id', EliminarReceta)

router.post('/:id/me-gusta', AgregarMeGusta)
router.delete('/:id/me-gusta', EliminarMeGusta)

router.post('/:id/guardar', GuardarReceta);
router.delete('/:id/guardar', EliminarRecetaGuardada);

router.post('/:id/calificacion', AgregarCalificacion);
router.delete('/:id/calificacion', EliminarCalificacion);

module.exports = router;