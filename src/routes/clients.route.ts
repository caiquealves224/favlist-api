import { Router, Request, Response } from 'express';
import { CreateClientController } from '../controllers/clientes';
import { UpdateClientController } from '../controllers/clientes';
import { DeleteClientController } from '../controllers/clientes';
import { GetClientsController } from '../controllers/clientes';

const router = Router();

// Instanciar controllers
const createClientController = new CreateClientController();
const updateClientController = new UpdateClientController();
const deleteClientController = new DeleteClientController();
const getClientsController = new GetClientsController();

// Rotas com tipagem explícita
router.get('/clients', (req: Request, res: Response) => {
    return getClientsController.handler(req, res);
});

router.post('/clients', (req: Request, res: Response) => {
    return createClientController.handler(req, res);
});

router.patch('/clients/:id', (req: Request, res: Response) => {
    return updateClientController.handler(req, res);
});

router.delete('/clients/:id', (req: Request, res: Response) => {
    return deleteClientController.handler(req, res);
});

export default router;
