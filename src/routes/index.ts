import { Router } from 'express';
import clientsRoutes from './clients.route';
import authRoutes from './auth.route';
import cacheRoutes from './cache.route';
import { authenticate } from '../middlewares/auth/authenticate';

const apiRouter = Router();

apiRouter.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});

apiRouter.use('/auth', authRoutes);

apiRouter.use('/clients', authenticate, clientsRoutes);

apiRouter.use('/cache', authenticate, cacheRoutes);

// Exportar o router consolidado
export default apiRouter;
