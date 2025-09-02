// Extensão de tipos para Express
declare namespace Express {
    interface Request {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user?: any;
    }
}
