// src/routes/movieRoutes.js - CÓDIGO COMPLETO CORREGIDO
const express = require('express');
const MovieController = require('../controllers/movieController');

const router = express.Router();

router.get('/novelties', MovieController.getNovelties);

// Crear película
router.post('/', MovieController.create);

// Obtener todas las películas (con filtros y paginación)
router.get('/', MovieController.getAll);

// Marcar película como vista 
router.post('/:movieId/watched', MovieController.markAsWatched);

// Ruta de debug para verificar
router.get('/debug', (req, res) => {
  res.json({
    message: 'Movies routes are working!',
    availableEndpoints: {
      'POST /api/movies': 'Create a new movie',
      'GET /api/movies': 'Get all movies with filters (?title=x&category=y&page=1&limit=10)',
      'GET /api/movies/novelties': 'Get movies released in last 3 weeks',
      'POST /api/movies/:movieId/watched': 'Mark movie as watched by user'
    }
  });
});

module.exports = router;
