import express from 'express';
import apiRoutes from './routes';

const app = express();

// Middleware para JSON
app.use(express.json());

// Usar todas as rotas da API em um único ponto
app.use('/api', apiRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
