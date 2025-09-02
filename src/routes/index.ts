import { Router } from 'express';
import clientsRoutes from './clients.route';
import authRoutes from './auth.route';

const apiRouter = Router();

apiRouter.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});

apiRouter.use('/auth', authRoutes);

apiRouter.use('/clients', clientsRoutes);

// Exportar o router consolidado
export default apiRouter;
