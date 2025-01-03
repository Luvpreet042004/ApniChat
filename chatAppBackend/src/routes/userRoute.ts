import express from 'express';
import { registerUser, loginUser,updateUser,deleteUser} from '../controllers/userContollers';
import userAuthorization from '../middleware/userMiddleware';

const router = express.Router();

router.get('/login', loginUser);
router.post('/create', registerUser);
router.put('/update',userAuthorization ,updateUser);
router.delete('/delete', userAuthorization,deleteUser);

export default router;