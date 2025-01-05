import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            console.log("User already exists");
            
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(name, email, hashedPassword);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id, email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const loginUser = async (req: Request, res: Response):Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where : {email}});
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return ;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return 
        }

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET as string, { expiresIn: '2days' });
        

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req: Request, res: Response):Promise<void> => {
    const {oldPassword,newPassword} = req.body;
    const email = req.user?.email;

    if(!email){
        res.status(400).json({ message: 'Invalid credentials' });
            return ;
    }

    try {
        const user = await prisma.user.findUnique({where :{email}});
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return ;
        }


        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return 
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword
            },
        });
        const token = jwt.sign({ userId: user.id, email }, JWT_SECRET as string, { expiresIn: '2days' });

        res.status(200).json({ message: 'Password updated successfully',token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteUser = async (req: Request, res: Response):Promise<void> => {
    const email = req.user?.email;
    const password = req.body.password;

    if(!email){
        res.status(400).json({ message: 'Invalid credentials' });
            return ;
    }

    try {
        const user = await prisma.user.findUnique({where :{email}});
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return ;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return 
        }

        await prisma.user.delete({where : {id : user.id}});

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}