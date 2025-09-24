const express = require('express');
const MovieController = require('../controllers/movieController');

const router = express.Router();

// Crear película
router.post('/', MovieController.create);

// Obtener todas las películas (con filtros y paginación)
router.get('/', MovieController.getAll);

// Obtener novedades (películas de menos de 3 semanas)
router.get('/novelties', MovieController.getNovelties);

// Marcar película como vista
router.post('/:movieId/watched', MovieController.markAsWatched);

module.exports = router;