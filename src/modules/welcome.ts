import { Request, Response, Express } from 'express';


export const sayWelcome = (req: Request, res: Response) => {
    res.status(200).send("Welcome 🙌");
} 