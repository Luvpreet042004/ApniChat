import express from 'express';
import { registerUser, loginUser,updateUser,deleteUser} from '../controllers/userContollers';
import userAuthorization from '../middleware/userMiddleware';

const router = express.Router();

<<<<<<< HEAD
router.post('/login', loginUser);
router.post('/register', registerUser);
=======
router.get('/login', loginUser);
router.post('/create', registerUser);
>>>>>>> 0c51cc92771aceba8e6df1da9fa2d6f823e085d7
router.put('/update',userAuthorization ,updateUser);
router.delete('/delete', userAuthorization,deleteUser);

export default router;