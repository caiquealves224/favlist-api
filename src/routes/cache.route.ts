import { Router, Request, Response } from 'express';
import CacheStatsController from '../controllers/cache/cache-stats.controller';
import { authorize } from '../middlewares/auth/authorize';

const router = Router();

// Middleware de autorização - apenas admins podem acessar estatísticas de cache
router.use(authorize(['admin']));

const cacheController = new CacheStatsController();

// GET /cache/stats - Estatísticas do cache
router.get('/stats', (req: Request, res: Response) =>
    cacheController.handler(req, res)
);

// DELETE /cache/clear - Limpar cache
router.delete('/clear', (req: Request, res: Response) =>
    cacheController.clearCache(req, res)
);

export default router;
