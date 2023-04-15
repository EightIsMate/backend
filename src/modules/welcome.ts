import { Request, Response } from 'express';


export const sayWelcome = (req: Request, res: Response) => {
    res.status(200).send("Welcome 🙌");
} 


// get mower position

// npm install path, multer, knex