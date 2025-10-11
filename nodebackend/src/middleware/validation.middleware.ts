import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message
      });
      return;
    }
    
    next();
  };
};

// Validation schemas
export const authSchemas = {
  signup: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be a valid 10-digit Indian number',
        'any.required': 'Phone number is required'
      }),
    referralCode: Joi.string().optional().allow('')
  }),

  verifyOtp: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required(),
    otp: Joi.string().length(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
  }),

  setupProfile: Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    dob: Joi.date().max(new Date()).required(),
    address: Joi.string().min(5).max(500).required(),
    city: Joi.string().min(2).max(100).required(),
    state: Joi.string().min(2).max(100).required()
  }),

  kycDocument: Joi.object({
    docType: Joi.string().valid('PAN Card', 'Aadhaar Card').required(),
    fileUrl: Joi.string().uri().required()
  })
};