import { Router } from 'express';
const router = Router();
router.post('/login', (req, res) => res.json({ token: 'stub-token' }));
export default router;
