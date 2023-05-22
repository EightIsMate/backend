import { Router, Request, Response } from 'express';
import { position_fetching, position_storing } from '../modules/positions';
import console from 'console';
import { check_request } from '../modules/authentification';



export const router : Router = Router();

/**
 * This function stores the horizontal and vertical positions of an object and returns an ID.
 * @param {Request} req - Request object containing information about the HTTP request made by the
 * client.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods for setting the status code, headers, and body of the response. In
 * this function, `res` is used to send a response with a status code and a JSON object containing an id
 * @param {string} type - The `type` parameter is a string that represents the type of position being
 * stored. It is used in the `position_storing` function to determine which type of position to store.
 * @returns This code is defining an async function called `_storing` that takes in three parameters:
 * `req` (of type `Request`), `res` (of type `Response`), and `type` (of type `string`).
 */
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

/**
 * This is an async function that fetches data from a position and sends a response with the fetched
 * data or an error status code.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request
 * such as headers, query parameters, and request body.
 * @param {Response} res - `res` is a parameter representing the response object in an Express route
 * handler function. It is used to send a response back to the client making the request. In this case,
 * the response is being sent as a JSON object with a status code of 200 if the data is successfully
 * fetched, or status code of 500 if there is an error.
 * @param {string} type - The "type" parameter is a string that is used as an argument for the
 * "position_fetching" function. It is likely used to specify what type of data is being requested or
 * fetched.
 */
const _fetching = async (req: Request, res: Response, type: string) => {
    try{
        const data = await position_fetching(type);
        res.status(200).json(data);
    } catch(error){
        res.status(500).send(error)
    }
}

/* This code is defining a route for handling HTTP POST requests to the '/mower' endpoint. When a POST
request is made to this endpoint, the function `_storing` is called with the `req` and `res`
objects, as well as the string 'mover'. The `_storing` function is responsible for storing the
horizontal and vertical positions of an object and returning an ID. Once the `_storing` function has
completed, the response is sent back to the client with a status code of 201 and a JSON object
containing the ID. */
router.post('/mower', check_request, async (req: Request, res: Response) => {
       await _storing(req, res, 'mover')
});

/* This code is defining a route for handling HTTP GET requests to the '/mower' endpoint. When a GET
request is made to this endpoint, the function `_fetching` is called with the `req` and `res`
objects, as well as the string 'mover'. The `_fetching` function is responsible for fetching data
from a position and sending a response with the fetched data or an error status code. Once the
`_fetching` function has completed, the response is sent back to the client with a status code of
200 and a JSON object containing the fetched data. */
router.get('/mower', check_request, async (req: Request, res: Response) => {
    await _fetching(req, res, 'mover')
});

/* This code is defining a route for handling HTTP POST requests to the '/obstacle' endpoint. When a
POST request is made to this endpoint, the function `_storing` is called with the `req` and `res`
objects, as well as the string 'obstacle'. The `_storing` function is responsible for storing the
horizontal and vertical positions of an obstacle and returning an ID. Once the `_storing` function
has completed, the response is sent back to the client with a status code of 201 and a JSON object
containing the ID. */
router.post('/obstacle', check_request, async (req: Request, res: Response) => {
    await _storing(req, res, 'obstacle')
});

/* This code is defining a route for handling HTTP GET requests to the '/obstacle' endpoint. When a GET
request is made to this endpoint, the function `_fetching` is called with the `req` and `res`
objects, as well as the string 'obstacle'. The `_fetching` function is responsible for fetching data
from a position and sending a response with the fetched data or an error status code. Once the
`_fetching` function has completed, the response is sent back to the client with a status code of
200 and a JSON object containing the fetched data. */
router.get('/obstacle', check_request, async (req: Request, res: Response) => {

 await _fetching(req, res, 'obstacle')
});

export default router;