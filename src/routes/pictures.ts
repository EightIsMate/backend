import multer from "multer";
import { picture_storing, picture_position_storing, picture_fetching, get_picture_by_id } from "../modules/pictures"
import { Router, Request, Response } from 'express';

// configure multer for file upload
const upload = multer({ dest: "uploads/" });
const router : Router = Router();

// create GET request route for fetching images
router.get("/image", picture_fetching);

// create POST request route for uploading images
router.post("/upload", upload.single("file"), picture_storing);

// create POST request route for uploading images and Positions
router.post("/image/store", upload.single("file"), picture_position_storing);


/**
 * This function fetches an image by ID and sends a response with the image data or an error message.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request
 * such as headers, query parameters, and request body.
 * @param {Response} res - The "res" parameter in this code refers to the response object that will be
 * sent back to the client making the request. It is an instance of the Response class from the
 * Express.js framework. The "res" object is used to set the HTTP status code and send the response
 * data back to the
 */
const fetch_image = async (req: Request, res: Response) => {
    try{
        const data = await get_picture_by_id(req, res);
        res.status(200).json(data);
    } catch(error){
        res.status(500).send(error)
    }
}

router.get('/image/:id', async (req: Request, res: Response) => {
    await fetch_image(req, res)
});

export default router;