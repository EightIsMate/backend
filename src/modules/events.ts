import { Request, Response } from 'express';
import { database } from './database_connection';
import { UUID } from 'crypto';

export const event_storing = async (image_id: string, eventtype_id: UUID) => {

    const id = await database.query(`INSERT INTO events (image_id, eventtype_id) VALUES (${image_id}, '${eventtype_id}') returning id;`);
    return id.rows[0].id;
}

export const event_fetching = async () => {
    const data = await database.query('SELECT * FROM events ORDER BY timestamp DESC')
    return data.rows;
}