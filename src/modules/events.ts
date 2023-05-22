import { Request, Response } from 'express';
import { database } from './database_connection';
import { UUID } from 'crypto';



/**
 * This function stores an event with an image ID and event type ID in a database and returns the ID of
 * the stored event.
 * @param {string} image_id - a string representing the ID of an image that the event is associated
 * with.
 * @param {UUID} eventtype_id - The eventtype_id parameter is a UUID (Universally Unique Identifier)
 * that represents the type of event being stored in the database. It is used to categorize and
 * differentiate between different types of events.
 * @returns The function `event_storing` is returning the `id` of the newly inserted row in the
 * `events` table. The `id` is obtained by executing a SQL query that inserts a new row with the
 * specified `image_id` and `eventtype_id` values, and then returns the `id` of the inserted row. The
 * returned `id` is accessed from the `id`.
 */
export const event_storing = async (image_id: string, eventtype_id: UUID) => {
    const id = await database.query(`INSERT INTO events (image_id, eventtype_id) VALUES (${image_id}, '${eventtype_id}') returning id;`);
    return id.rows[0].id;
}

/**
 * This function fetches events from a database and sends them as a response to a request.
 * @param {Request} req - Request object that contains information about the incoming HTTP request,
 * such as headers, query parameters, and request body.
 * @param {Response} res - The "res" parameter is an object representing the HTTP response that will be
 * sent back to the client. It contains methods and properties that allow the server to send data, set
 * headers, and control the response status code. In this case, the "res" object is used to send a JSON
 * response.
 */
export const event_fetching = async (req: Request, res: Response) => {
    try {
        const data = await database.query('SELECT e.id, image_id, timestamp, message FROM events e join event_types et ON e.eventtype_id = et.id ORDER BY timestamp DESC')
        res.status(200).send(data.rows)
    }
    catch (err) {
        res.status(500).send(err)
    }
}