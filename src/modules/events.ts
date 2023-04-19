import { Request, Response } from 'express';
import { database } from './database_connection';
import { UUID } from 'crypto';

export const event_storing = async (image_id: string, eventtype_id: UUID) => {

    const id = await database.query(`INSERT INTO events (image_id, eventtype_id) VALUES (${image_id}, '${eventtype_id}') returning id;`);
    return id.rows[0].id;
}

export const event_fetching = async (req: Request, res: Response) => {
    try {
        const data = await database.query('SELECT e.id, image_id, timestamp, message FROM events e join event_types et ON e.eventtype_id = et.id ORDER BY timestamp DESC')
        res.status(200).json({data: data.rows})
    }
    catch (err) {
        res.status(500).send(err)
    }
}