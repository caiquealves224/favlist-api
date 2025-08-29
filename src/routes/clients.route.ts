import { Router, Request, Response } from 'express';
import { CreateClientController } from '../controllers/clientes';
import { UpdateClientController } from '../controllers/clientes';
import { DeleteClientController } from '../controllers/clientes';
import { GetClientsController } from '../controllers/clientes';

const router = Router();

router.get('/clients', (req: Request, res: Response) => {
    return new GetClientsController().handler(req, res);
});

router.post('/clients', (req: Request, res: Response) => {
    return new CreateClientController().handler(req, res);
});

router.patch('/clients/:id', (req: Request, res: Response) => {
    return new UpdateClientController().handler(req, res);
});

router.delete('/clients/:id', (req: Request, res: Response) => {
    return new DeleteClientController().handler(req, res);
});

export default router;
