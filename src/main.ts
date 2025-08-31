import express from 'express';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

// Middleware para JSON
app.use(express.json());

// Usar todas as rotas da API em um único ponto
app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
