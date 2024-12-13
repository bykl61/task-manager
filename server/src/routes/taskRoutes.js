import { Router } from 'express';
import taskController from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../utils/fileUpload.js';


const router = Router();

router.use(authMiddleware);

router.post('/', upload.single('file'), taskController.create);
router.get('/', taskController.all);
router.get('/:id', taskController.get);
router.put('/:id', upload.single('file'), taskController.update);
router.delete('/:id', taskController.delete);

export default router;