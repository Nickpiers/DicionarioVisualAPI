import { Router } from 'express';
import { handleCreateUser, handleDeleteUser, handleGetUserById, handleGetUsers, handleUpdateUser } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
const router = Router();

router.post('/',handleCreateUser);
router.get('/getUsers', authenticateToken, handleGetUsers);
router.get('/getUser/:id', authenticateToken, handleGetUserById);
router.post('/updateUser/:id', authenticateToken, handleUpdateUser);
router.delete('/deleteUser/:id', authenticateToken, handleDeleteUser);

export default router;