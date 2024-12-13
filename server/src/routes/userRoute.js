import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import userController from '../controllers/userController.js';

const router = Router();


router.post('/register', userController.register);
router.post('/login', userController.login);
// router.post('/logout', authMiddleware, userController.logout);

export default router;
