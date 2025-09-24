const Category = require('../models/Category');

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const categories = await Category.getAll();
      
      res.status(200).json({
        status: 'success',
        message: 'Categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
