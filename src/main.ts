import express, { Request, Response } from 'express';

const app = express();

import routes from './routes';

app.use(routes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
