const Movie = require('../models/Movie');
const Category = require('../models/Category');
const { movieValidation } = require('../validators/movieValidator');

class MovieController {
  static async create(req, res, next) {
    try {
      const { error, value } = movieValidation.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          details: error.details
        });
      }

      // Verificar que la categoría existe
      const category = await Category.findById(value.category_id);
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Category not found'
        });
      }

      const movie = await Movie.create(value);
      
      res.status(201).json({
        status: 'success',
        message: 'Movie created successfully',
        data: movie
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const filters = {
        title: req.query.title,
        category: req.query.category,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await Movie.getAll(filters);
      
      res.status(200).json({
        status: 'success',
        message: 'Movies retrieved successfully',
        data: result.movies,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNovelties(req, res, next) {
    try {
      const novelties = await Movie.getNovelties();
      
      res.status(200).json({
        status: 'success',
        message: 'Movie novelties retrieved successfully',
        data: novelties
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsWatched(req, res, next) {
    try {
      const { movieId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          status: 'error',
          message: 'userId is required'
        });
      }

      // Verificar que la película existe
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({
          status: 'error',
          message: 'Movie not found'
        });
      }

      const marked = await Movie.markAsWatched(userId, movieId);
      
      if (!marked) {
        return res.status(409).json({
          status: 'error',
          message: 'Movie already marked as watched by this user'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Movie marked as watched successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MovieController;