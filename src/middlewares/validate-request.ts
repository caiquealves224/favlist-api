import { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: ZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (err: any) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: err.errors, // array de erros detalhados do Zod
            });
        }
    };
