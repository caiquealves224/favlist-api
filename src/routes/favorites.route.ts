import { Router, Request, Response } from 'express';

const router = Router({ mergeParams: true }); // mergeParams para acessar clientId

// Rotas com tipagem explícita
router.get('/', (req: Request, res: Response) => {
    res.send('Favorites');
});

router.post('/', (req: Request, res: Response) => {
    res.send('Add to Favorites');
});

router.delete('/:favoriteId', (req: Request, res: Response) => {
    res.send('Remove from Favorites');
});

export default router;
