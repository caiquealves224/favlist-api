import { Router, Request, Response } from 'express';
import { LoginController } from '../controllers/auth/login.controller';
import { loginSchema } from '../schemas/login.schema';
import { validate } from '../middlewares/validate-request';

const router = Router();

router.post('/', validate(loginSchema), (req: Request, res: Response) => {
    return new LoginController().handler(req, res);
});

export default router;
