const { body, param, validationResult } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

// Registration validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Grievance submission validation
const grievanceValidation = [
  body('category')
    .trim()
    .isIn(['Academic Issues', 'Administration Issues', 'Infrastructure Issues', 'Hostel Issues', 'Other'])
    .withMessage('Invalid category selected'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  handleValidationErrors
];

// Grievance update validation (admin)
const updateGrievanceValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid grievance ID'),
  body('status')
    .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
    .withMessage('Invalid status value'),
  body('admin_remark')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Admin remark must not exceed 1000 characters'),
  body('assigned_department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department name must not exceed 100 characters'),
  handleValidationErrors
];

// Password reset validation
const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6, max: 100 })
    .withMessage('New password must be at least 6 characters long'),
  handleValidationErrors
];

// Profile update validation
const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('currentPassword')
    .optional()
    .notEmpty()
    .withMessage('Current password is required when updating password'),
  body('newPassword')
    .optional()
    .isLength({ min: 6, max: 100 })
    .withMessage('New password must be at least 6 characters long'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  grievanceValidation,
  updateGrievanceValidation,
  resetPasswordValidation,
  profileUpdateValidation,
  handleValidationErrors
};
