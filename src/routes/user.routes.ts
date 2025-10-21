import { Router } from 'express';
import { handleCreateUser, handleGetUserById, handleGetUsers } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
const router = Router();

router.post('/',handleCreateUser);
router.get('/getUsers', authenticateToken, handleGetUsers);
router.get('/getUser/:id', authenticateToken, handleGetUserById);

export default router;