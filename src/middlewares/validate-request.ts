import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): Response | void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
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

            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
            });
        }
    };
