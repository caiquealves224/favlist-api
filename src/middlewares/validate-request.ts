import { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: ZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            const formattedErrors = error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
                code: issue.code,
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: formattedErrors, // array de erros detalhados do Zod
            });
        }
    };
