import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('Favorites');
});

router.post('/', (req, res) => {
    res.send('Add to Favorites');
});

export default router;
