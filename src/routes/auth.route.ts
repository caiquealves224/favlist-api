import { Router, Request, Response } from 'express';
import { LoginController } from '../controllers/auth/login.controller';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    return new LoginController().handler(req, res);
});

export default router;
