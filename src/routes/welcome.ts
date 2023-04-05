import { Router } from 'express';
import { sayWelcome } from '../modules/welcome';
const router : Router = Router();

router.get('/welcome', sayWelcome);

export default router;