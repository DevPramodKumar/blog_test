import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { userValidation, userUpdateValidation } from '../validators/index.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', userValidation, validate, createUser);
router.put('/:id', userUpdateValidation, validate, updateUser);
router.delete('/:id', deleteUser);

export default router;
