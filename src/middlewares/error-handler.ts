import { Request, Response } from 'express';
import { AppError } from '../errors/appError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response
): Response => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err); // log para debug
    console.error(typeof err); // log para debug
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};
