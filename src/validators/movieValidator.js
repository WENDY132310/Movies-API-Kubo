const Joi = require('joi');

const movieValidation = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title is required',
      'string.max': 'Title must have at most 200 characters'
    }),
  
  description: Joi.string()
    .allow('')
    .optional(),
  
  release_date: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Please provide a valid release date (YYYY-MM-DD)'
    }),
  
  category_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Category ID must be a number',
      'number.positive': 'Category ID must be positive'
    })
});

module.exports = { movieValidation };