import { Router } from 'express';

const router = Router();

router.get('/clients', (req, res) => {
    res.send('Clients');
});

router.post('/clients', (req, res) => {
    res.send('Add Client');
});

router.patch('/clients/:id', (req, res) => {
    res.send(`Update Client with ID ${req.params.id}`);
});

router.delete('/clients/:id', (req, res) => {
    res.send(`Delete Client with ID ${req.params.id}`);
});

export default router;
