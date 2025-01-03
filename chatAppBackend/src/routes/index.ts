import express from 'express';
import userRoutes from './userRoute'

const router = express.Router();

// Define your routes here
router.use('/user',userRoutes);

export default router;