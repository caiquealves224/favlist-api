import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
