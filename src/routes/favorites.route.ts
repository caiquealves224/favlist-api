import { Router, Request, Response } from 'express';
import { validate } from '../middlewares/validate-request';
import { FavoriteSchema } from '../schemas/favorites.schema';

const router = Router({ mergeParams: true }); // mergeParams para acessar clientId

router.get('/', (req: Request, res: Response) => {
    res.send('Favorites');
});

router.post('/', validate(FavoriteSchema), (req: Request, res: Response) => {
    res.send('Add to Favorites');
});

router.delete('/:favoriteId', (req: Request, res: Response) => {
    res.send('Remove from Favorites');
});

export default router;
