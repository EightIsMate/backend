import { Router, Request, Response } from 'express';
import { check_request } from "../modules/authentification";
import { session_clearing } from '../modules/session';

export const router : Router = Router();

router.delete("/session", check_request, async (req: Request, res: Response) => {
    await session_clearing();
    console.log("Session data deleted!")
    res.status(200).send();
});

export default router;
