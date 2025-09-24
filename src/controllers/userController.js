const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { userValidation } = require('../validators/userValidator');

class UserController {
  static async create(req, res, next) {
    try {
      console.log('Creating user with data:', req.body); // Debug log
      
      const { error, value } = userValidation.validate(req.body);
      if (error) {
        console.log('Validation error:', error.details); // Debug log
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(value.email);
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          message: 'User already exists with this email'
        });
      }

      const user = await User.create(value);
      
      // Generar JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      console.log('User created successfully:', user); // Debug log

      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Error in UserController.create:', error); // Debug log
      next(error);
    }
  }

  static async getUsersWithWatchedMovies(req, res, next) {
    try {
      console.log('Getting users with watched movies'); // Debug log
      
      const users = await User.getUsersWithWatchedMovies();
      
      res.status(200).json({
        status: 'success',
        message: 'Users with watched movies retrieved successfully',
        data: users
      });
    } catch (error) {
      console.error('Error in UserController.getUsersWithWatchedMovies:', error); // Debug log
      next(error);
    }
  }
}

module.exports = UserController;