import { Router } from 'express';
import { sayWelcome } from '../modules/welcome';
const router : Router = Router();

router.post('/welcome', sayWelcome);

export default router;