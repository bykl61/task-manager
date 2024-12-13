import { Router } from 'express';
import userRoutes from './userRoute.js';
import taskRoutes from './taskRoutes.js';

const router = Router();

router.use('/auth', userRoutes);
router.use('/tasks', taskRoutes);

export default router;
