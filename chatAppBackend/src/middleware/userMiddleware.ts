import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

declare global {
    namespace Express {
      interface Request {
        user?: {
          id: number;
          email: string;
          name: string;
        };
      }
    }
  }

const userAuthorization = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization token missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  

    try {
        const decoded = jwt.verify(token, JWT_SECRET as string) as {id:number, email:string};
        

        const thisUser = await prisma.user.findUnique({where :{id : decoded.id,email : decoded.email}})
        if (!thisUser) {
            res.status(401).json({ error: 'invalid token' });
            return;
          }

        req.user = {
            id : thisUser?.id,
            email : thisUser?.email,
            name : thisUser?.name
        }
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export default userAuthorization;
