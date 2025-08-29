import { Router } from 'express';
import clientsRoutes from './clients.route';
import favoritesRoutes from './favorites.route';

// Router principal que consolida todas as rotas
const apiRouter = Router();

// Montar todas as rotas no router principal
apiRouter.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});

apiRouter.use('/clients', clientsRoutes);
apiRouter.use('/favorites', favoritesRoutes);

// Exportar o router consolidado
export default apiRouter;
