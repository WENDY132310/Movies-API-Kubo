// src/controllers/movieController.js - VERSIÓN CORREGIDA PARA TU MODELO
const Movie = require('../models/Movie');
const Category = require('../models/Category');
const { movieValidation, watchedMovieValidation } = require('../validators/movieValidator');

class MovieController {
  static async create(req, res, next) {
    try {
      // Debug para ver qué llega
      console.log('=== MOVIE CREATE DEBUG ===');
      console.log('Headers:', req.headers['content-type']);
      console.log('Body received:', req.body);
      console.log('Body keys:', Object.keys(req.body || {}));
      console.log('========================');
      
      // Verificar si el body está vacío
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Request body is empty. Make sure to set Content-Type: application/json',
          debug: {
            contentType: req.headers['content-type'],
            bodyReceived: req.body
          }
        });
      }
      
      console.log('Creating movie with data:', req.body);
      
      const { error, value } = movieValidation.validate(req.body);
      if (error) {
        console.log('❌ Validation failed:', error.details);
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      // Verificar que la categoría existe
      const category = await Category.findById(value.category_id);
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: `Category with ID ${value.category_id} not found`
        });
      }

      const movie = await Movie.create(value);
      
      res.status(201).json({
        status: 'success',
        message: 'Movie created successfully',
        data: movie
      });
    } catch (error) {
      console.error('Error in MovieController.create:', error);
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      console.log('Getting movies with query params:', req.query);
      
      // Validar y limpiar filtros
      const filters = {};
      
      // Título - solo si existe y no está vacío
      if (req.query.title && typeof req.query.title === 'string' && req.query.title.trim()) {
        filters.title = req.query.title.trim();
      }
      
      // Categoría - solo si existe y no está vacío
      if (req.query.category && typeof req.query.category === 'string' && req.query.category.trim()) {
        filters.category = req.query.category.trim();
      }
      
      // Paginación - convertir a números con valores por defecto
      filters.page = Math.max(1, parseInt(req.query.page) || 1);
      filters.limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));

      console.log('Processed filters:', filters);

      let result;
      
      try {
        // Intentar con el método principal getAll
        result = await Movie.getAll(filters);
        console.log('✅ Primary getAll method succeeded');
        
      } catch (dbError) {
        console.error('❌ Primary getAll failed:', dbError.message);
        console.log('🔄 Trying fallback getAllSimple method...');
        
        // Si falla, usar el método alternativo
        result = await Movie.getAllSimple(filters);
        console.log('✅ Fallback getAllSimple method succeeded');
      }
      
      res.status(200).json({
        status: 'success',
        message: 'Movies retrieved successfully',
        data: result.movies,
        pagination: result.pagination,
        filters_applied: {
          title: filters.title || null,
          category: filters.category || null,
          page: filters.page,
          limit: filters.limit
        },
        count: result.movies.length
      });
      
    } catch (error) {
      console.error('❌ Error in MovieController.getAll:', error);
      next(error);
    }
  }

  static async getNovelties(req, res, next) {
    try {
      console.log('🆕 Getting movie novelties...');
      
      const novelties = await Movie.getNovelties();
      
      // Calcular cuántas semanas han pasado para debug
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
      
      console.log(`✅ Found ${novelties.length} novelties`);
      
      res.status(200).json({
        status: 'success',
        message: 'Movie novelties retrieved successfully',
        data: novelties,
        metadata: {
          criteria: `Movies released after ${threeWeeksAgo.toISOString().split('T')[0]}`,
          count: novelties.length,
          threeWeeksAgo: threeWeeksAgo.toISOString().split('T')[0]
        }
      });
    } catch (error) {
      console.error('❌ Error in MovieController.getNovelties:', error);
      next(error);
    }
  }

  static async markAsWatched(req, res, next) {
    try {
      const { movieId } = req.params;
      console.log('🎬 Marking movie as watched:', { movieId, body: req.body });
      
      // Validar el body
      const { error, value } = watchedMovieValidation.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      // Verificar que la película existe
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({
          status: 'error',
          message: `Movie with ID ${movieId} not found`
        });
      }

      // Verificar que el usuario existe
      const User = require('../models/User');
      const user = await User.findById(value.userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: `User with ID ${value.userId} not found`
        });
      }

      // Marcar como vista
      const marked = await Movie.markAsWatched(value.userId, movieId);
      
      if (!marked) {
        return res.status(409).json({
          status: 'error',
          message: 'Movie already marked as watched by this user'
        });
      }

      console.log('✅ Movie marked as watched successfully');

      res.status(200).json({
        status: 'success',
        message: 'Movie marked as watched successfully',
        data: {
          user: { 
            id: user.id, 
            username: user.username 
          },
          movie: { 
            id: movie.id, 
            title: movie.title,
            category: movie.category_name
          },
          watched_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Error in MovieController.markAsWatched:', error);
      next(error);
    }
  }

  // Método adicional para debug
  static async debug(req, res) {
    try {
      // Contar películas
      const allMovies = await Movie.getAll({ page: 1, limit: 1000 });
      
      // Contar por categoría
      const categories = await Category.getAll();
      
      const categoryStats = await Promise.all(
        categories.map(async (cat) => {
          const movies = await Movie.getAll({ category: cat.name, page: 1, limit: 1000 });
          return {
            category: cat.name,
            id: cat.id,
            count: movies.pagination.total
          };
        })
      );

      res.json({
        message: 'Movies debug information',
        stats: {
          totalMovies: allMovies.pagination.total,
          categoriesStats: categoryStats
        },
        availableEndpoints: {
          'POST /api/movies': 'Create a new movie',
          'GET /api/movies': 'Get all movies with filters (?title=x&category=y&page=1&limit=10)',
          'GET /api/movies/novelties': 'Get movies released in last 3 weeks',
          'POST /api/movies/:movieId/watched': 'Mark movie as watched by user'
        },
        sampleRequests: {
          createMovie: {
            method: 'POST',
            url: '/api/movies',
            body: {
              title: 'Sample Movie',
              description: 'A sample movie description',
              release_date: '2024-09-15',
              category_id: 1
            }
          },
          markWatched: {
            method: 'POST',
            url: '/api/movies/1/watched',
            body: { userId: 1 }
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Debug failed',
        error: error.message
      });
    }
  }
}

module.exports = MovieController;