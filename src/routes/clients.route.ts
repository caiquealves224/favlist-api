import { Router, Request, Response } from 'express';
import { CreateClientController } from '../controllers/clientes';
import { UpdateClientController } from '../controllers/clientes';
import { DeleteClientController } from '../controllers/clientes';
import { GetClientsController } from '../controllers/clientes';
import { CreateClientService } from '../services/clients/create.service';
import { UpdateClientService } from '../services/clients/update.service';
import { validate } from '../middlewares/validate-request';
import {
    createClientSchema,
    updateClientSchema,
} from '../schemas/client.schema';
import { GetClientService } from '../services/clients/get.service';

const router = Router();

router.get('/:id', (req: Request, res: Response) => {
    return new GetClientsController(new GetClientService()).handler(req, res);
});

router.post(
    '/',
    validate(createClientSchema),
    (req: Request, res: Response) => {
        return new CreateClientController(new CreateClientService()).handler(
            req,
            res
        );
    }
);

router.patch(
    '/:id',
    validate(updateClientSchema),
    (req: Request, res: Response) => {
        return new UpdateClientController(new UpdateClientService()).handler(
            req,
            res
        );
    }
);

router.delete('/:id', (req: Request, res: Response) => {
    return new DeleteClientController().handler(req, res);
});

export default router;
