import { Router, Request, Response } from 'express';
import { position_fetching, position_storing } from '../modules/positions';
import console from 'console';



export const router : Router = Router();

const _storing = async (req: Request, res: Response, type: string) => {
    try {
        const position_horizontal: string = req.body.position_horizontal || null;
        const position_vertical: string = req.body.position_vertical || null;
        
        if (position_horizontal == null || position_vertical == null) {
            res.status(400).send(`${position_horizontal == null ? "'position_horizontal'" : "'position_vertical'"} positions are missing`);
            return;
        }
        const id = await position_storing(position_horizontal, position_vertical, type);
        res.status(201).send({id: id});
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

const _fetching = async (req: Request, res: Response, type: string) => {
    try{
        const data = await position_fetching(type);
        res.status(200).json(data);
    } catch(error){
        res.status(500).send(error)
    }
}

router.post('/mover', async (req: Request, res: Response) => {
       await _storing(req, res, 'mover')
});

router.get('/mover', async (req: Request, res: Response) => {
    await _fetching(req, res, 'mover')
});

router.post('/obstacle', async (req: Request, res: Response) => {
    await _storing(req, res, 'obstacle')
});

router.get('/obstacle', async (req: Request, res: Response) => {
 await _fetching(req, res, 'obstacle')
});

export default router;