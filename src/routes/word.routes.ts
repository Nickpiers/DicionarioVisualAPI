import { Router } from 'express';
import { 
  handleCreateWord, 
  handleDeleteWord, 
  handleGetWordById, 
  handleGetWords, 
  handleUpdateWord 
} from '../controllers/word.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();


router.get('/', handleGetWords);
router.get('/:id', handleGetWordById);

router.post('/', authenticateToken, handleCreateWord);
router.put('/:id', authenticateToken, handleUpdateWord);
router.delete('/:id', authenticateToken, handleDeleteWord);

export default router;