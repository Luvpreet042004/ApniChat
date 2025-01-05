import express from 'express';
import userRoutes from './userRoute'

const router = express.Router();

// Define your routes here
<<<<<<< HEAD
router.use('/users',userRoutes);
=======
router.use('/user',userRoutes);
>>>>>>> 0c51cc92771aceba8e6df1da9fa2d6f823e085d7

export default router;