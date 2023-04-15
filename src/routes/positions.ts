import { Router, Request, Response } from 'express';
import { position_storing } from '../modules/positions';



const router : Router = Router();

router.post('/positions', async (req: Request, res: Response) => {
    try {
        const position_horizontal: string = req.body.position_horizontal || null;
        const position_vertical: string = req.body.position_vertical || null;
        
        if (position_horizontal == null || position_vertical == null) {
            res.status(400).send(`${position_horizontal == null ? "'position_horizontal'" : "'position_vertical'"} positions are missing`);
            return;
        }
        const id = await position_storing(position_horizontal, position_vertical);
        res.status(201).send({id: id});
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;