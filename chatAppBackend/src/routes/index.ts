import express from 'express';
import userRoutes from './userRoute'

const router = express.Router();

// Define your routes here
router.use('/users',userRoutes);

export default router;