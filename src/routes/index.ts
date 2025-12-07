import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import wordRoutes from './word.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/words', wordRoutes);

export default router;