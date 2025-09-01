import express from 'express';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/error-handler';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(
    new URL('../openapi.yaml', import.meta.url).pathname
);

const app = express();

// Middleware para JSON
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Usar todas as rotas da API em um único ponto
app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
