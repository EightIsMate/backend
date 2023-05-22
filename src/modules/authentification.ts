import { NextFunction, Request, Response } from 'express';
import { database } from './database_connection';
import { UUID } from 'crypto';
import { send } from 'process';

export const escapeSQL = (arg: string | null): string => {
    if (!arg) { return ''; }
    arg = arg.replaceAll("'", "''");

    return arg;
};

const authentification = async (token: string) => {
    const response = await database.query(`SELECT developer FROM api_keys WHERE api_key = '${escapeSQL(token)}';`);
    if (response.rowCount > 0) {
        return response.rows[0].developer
    }
    return "";
}

export const check_request = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token
    if (!token || typeof token != "string") {
        res.status(401).send("No token provided");
        console.log(`Unauthorized. No token ${token} provided.`);
    return
    }

    const user = await authentification(token)
    if (user != "") {
        console.log(`User ${user} requested.`);
        next();
        return
    }
    console.log(`Unauthorized user tried with token ${token} to request. IP of client: ${req.socket.remoteAddress} .`);
    res.status(401).send(`Unauthorized token provided!`);
}