import { Router, Request, Response } from 'express';
import { validate } from '../middlewares/validate-request';
import { FavoriteSchema } from '../schemas/favorites.schema';
import AddFavoritesService from '../services/favorites/add.service';
import AddFavoritesController from '../controllers/favoritos/add.controller';
import GetFavoritesService from '../services/favorites/get.service';
import GetFavoritesController from '../controllers/favoritos/get.controller';
import DeleteFavoritesController from '../controllers/favoritos/delete.controller';
import DeleteFavoritesService from '../services/favorites/delete.service';

const router = Router({ mergeParams: true }); // mergeParams para acessar clientId

router.get('/:itemId', (req: Request, res: Response) =>
    new GetFavoritesController(new GetFavoritesService()).handler(req, res)
);

router.post('/', validate(FavoriteSchema), (req: Request, res: Response) =>
    new AddFavoritesController(new AddFavoritesService()).handler(req, res)
);

router.delete('/:itemId', (req: Request, res: Response) =>
    new DeleteFavoritesController(new DeleteFavoritesService()).handler(
        req,
        res
    )
);

export default router;
