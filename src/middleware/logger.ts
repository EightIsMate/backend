import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
    console.log(`\n${req.method}->${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log("body: ", req.body, "\n");

    next();
};

export default logger;
