const Joi = require('joi');

const userValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must have at least 3 characters',
      'string.max': 'Username must have at most 50 characters',
      'string.empty': 'Username is required',
      'any.required': 'Username is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must have at least 6 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

module.exports = { userValidation };
