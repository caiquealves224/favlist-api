import { Router, Request, Response } from 'express';

const router = Router();

// Rotas com tipagem explícita
router.get('/', (req: Request, res: Response) => {
    res.send('Favorites');
});

router.post('/', (req: Request, res: Response) => {
    res.send('Add to Favorites');
});

export default router;
