import express from 'express';
import { registerUser, loginUser,updateUser,deleteUser, addConnection, getUser, connections} from '../controllers/userContollers';
import userAuthorization from '../middleware/userMiddleware';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.put('/update',userAuthorization ,updateUser);
router.delete('/delete', userAuthorization,deleteUser);
router.post('/connect',userAuthorization,addConnection);
router.get('/get',userAuthorization,getUser) ;
router.get('/connections',userAuthorization,connections) ;


export default router;