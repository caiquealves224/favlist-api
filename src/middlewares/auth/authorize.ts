import { Request, Response, NextFunction } from 'express';

interface UserPayload {
    id: string;
    role: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const authorize =
    (roles: string[]) =>
    (
        req: Request & { user?: UserPayload },
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.user?.role)) {
            return res
                .status(403)
                .json({ message: 'Forbidden: insufficient permissions' });
        }

        next();
    };
