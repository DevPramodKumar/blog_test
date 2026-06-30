import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getRelatedPosts,
  getDashboardStats,
} from '../controllers/postController.js';
import { protect, authorize } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { validate } from '../middleware/validate.js';
import { postValidation, postUpdateValidation } from '../validators/index.js';

const router = Router();

router.get('/dashboard/stats', protect, authorize('admin'), getDashboardStats);
router.get('/', optionalAuth, getPosts);
router.get('/:id/related', getRelatedPosts);
router.get('/:id', optionalAuth, getPostById);
router.post('/', protect, postValidation, validate, createPost);
router.put('/:id', protect, postUpdateValidation, validate, updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

export default router;
