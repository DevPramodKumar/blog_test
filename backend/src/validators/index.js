import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const userValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
];

export const userUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Valid email is required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
];

const isValidImage = (value) => {
  if (!value) return true;
  if (value.startsWith('/uploads/')) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export const postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 500 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('image')
    .optional({ values: 'falsy' })
    .custom((value) => isValidImage(value))
    .withMessage('Image must be a valid URL or uploaded file'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
];

export const postUpdateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  body('image')
    .optional({ values: 'falsy' })
    .custom((value) => isValidImage(value))
    .withMessage('Image must be a valid URL or uploaded file'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
];
