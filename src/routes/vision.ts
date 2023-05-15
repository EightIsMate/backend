

import { get_picture_link } from "../modules/pictures"
import { Router, Request, Response } from 'express';
import { annotate_image } from "../modules/vision"

const router : Router = Router();

/**
 * This function takes a request and response object, retrieves an image link from the request by calling the get_picture_by_id,
 * annotates the image using Google Cloud Vision API, and sends the annotated data in the response.
 * @param {Request} req - Request object, which contains information about the HTTP request made by the
 * client.
 * @param {Response} res - `res` stands for response and is an object that represents the HTTP response
 * that an Express app sends when it receives an HTTP request. It contains methods for setting the HTTP
 * status code, headers, and sending the response body.
 */
const vision_by_id = async (req: Request, res: Response) => {
    try{
        const data = await get_picture_link(req, res);
        const img_link = data.img_link
        //console.log("Line 21, vision.ts, routes. img link = ", img_link)
        if(img_link != ""){
            try{
            const anotData = await annotate_image(img_link);
            //console.log("Line 24, vision by id vision.ts, routes, data = ", anotData)
            res.status(200).json(anotData);
            }
            catch(error){
                //console.log("Line 26, vision by id vision.ts routes error img anotation: ", error)
                res.status(502).json(error)
            }
        } else{
            //console.log("Line 26, vision by id vision.ts routes no image link: ")
            res.status(404).json("no image with the provided id in the DB")
            /*
            410 Gone client error response code indicates that access to the target resource is no longer available 
            at the origin server and that this condition is likely to be permanent.
            */
        }
    } catch(error){
        res.status(500).send(error)
    }
}

/* This code is defining a route for the HTTP GET method with the path '/vision/:id'. The ':id' part of
the path is a parameter that can be used to retrieve a specific image by its ID. When a client makes
a GET request to this route, the function `vision_by_id` is called with the request and response
objects as arguments. This function retrieves the image link from the request, annotates the image
using Google Cloud Vision API, and sends the annotated data in the response. The `await` keyword is
used to wait for the asynchronous `vision_by_id` function to complete before sending the response. */
router.get('/vision/:id', async (req: Request, res: Response) => {
    await vision_by_id(req, res)
});

export default router;