import { Router, Request, Response } from 'express';
import { event_fetching, event_storing } from "../modules/events";
import { UUID } from "crypto";
import { check_request } from "../modules/authentification";

const router : Router = Router();

interface Event {
    name: string;
    id: UUID;
    request_id: number
  }

/**
 This code block defines a POST request route for uploading events. It takes in the request and
response objects as parameters, where request has image_id and event_code in its body. Then the function
event_storing is called with the parametes and response is sent back to the requesting body. 
It uses the Express Router to define the route. 
*/
router.post("/events", check_request, async (req: Request, res: Response) => {
    try {
        let eventtype_id: null | UUID = null;
        let image_id_string;
        
        let image_id = req.body.image_id;
        let event_code = req.body.event_code;

        const eventtype_ids : Array<Event>= [
            {name: 'object_detection', id: '100eebce-4e6e-42df-bfad-f180d3207e3e', request_id: 1020},
            {name: 'moving', id: '1244e40b-441c-4f7c-b527-ba75e4e4aaf0', request_id: 1000}, 
            {name: 'stopped', id: '4786f1a5-2351-468a-9202-7c85e9194459', request_id: 1040}
        ];
        if (event_code == undefined) {
            res.status(400).send("'event_code' not defined");
            return;
        }
        for (let item of eventtype_ids) {
            if (item.request_id == event_code) {
                eventtype_id = item.id;
                break;
            }
        }
        if (eventtype_id == null) {
            res.status(400).send(`'event_code': ${req.body.event_code} not defined. Choose code from: 1000(moving), 1020(object_detection), 1040(stopped)`);
            return;
        }

        if (event_code != 1020 || image_id == null || image_id == undefined || image_id == "") {
            image_id_string = 'null';
        }else {
            image_id_string = `'${image_id}'`;
        }
        const db_resposnse = await event_storing(image_id_string, eventtype_id);
        res.status(201).send({id: db_resposnse});
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

/**
 This code block defines a GET request route for fetching events. It uses the Express Router to
define the route and calls the `event_fetching` function to handle the request. When a GET request
is made to the "/events" endpoint, the `event_fetching` function is called to retrieve the events
from the database and return them as a response. 
*/
router.get("/events", check_request, event_fetching);

export default router;