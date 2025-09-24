const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

// Crear usuario
router.post('/', UserController.create);

// Listar usuarios con películas vistas
router.get('/watched-movies', UserController.getUsersWithWatchedMovies);

// Ruta de prueba para verificar que funciona
router.get('/', (req, res) => {
  res.json({
    message: 'Users endpoint is working!',
    availableEndpoints: {
      'POST /api/users': 'Create a new user',
      'GET /api/users/watched-movies': 'Get users with watched movies'
    }
  });
});

module.exports = router;