import multer from "multer";
import { picture_storing, picture_position_storing, picture_fetching, get_picture_by_id } from "../modules/pictures"
import { Router, Request, Response } from 'express';


/* 
Used for configuring the multer middleware for file upload. It sets the destination directory 
for uploaded files to be stored in the server. In this case, the destination directory is set to 
"uploads/". This means that when a file is uploaded through the
"/upload" or "/image/store" endpoints, it will be stored in the "uploads/" directory on the server. 
*/
const upload = multer({ dest: "uploads/" });
const router : Router = Router();


/* 
This code creates a GET request route for fetching images. When a client makes a GET request to the
"/image" endpoint, the "picture_fetching" function will be called to handle the request and send a
response with the image data or an error message. 
*/
router.get("/image", picture_fetching);


/* 
This code creates a POST request route for uploading images. When a client makes a POST request to
the "/upload" endpoint, the "picture_storing" function will be called to handle the request and
store the image data in the server. The "upload.single("file")" middleware from the multer library
is used to handle the file upload and store the file in the "uploads/" directory. 
*/
router.post("/upload", upload.single("file"), picture_storing);


/* 
This code creates a POST request route for uploading images and positions. When a client makes a
POST request to the "/image/store" endpoint, the "picture_position_storing" function will be called
to handle the request and store the image data and position in the server. The
"upload.single("file")" middleware from the multer library is used to handle the file upload and
store the file in the "uploads/" directory. 
*/
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
/**
 * This is an asynchronous function that fetches an image by ID and returns it as JSON data, with error
 * handling.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request
 * such as headers, query parameters, and request body.
 * @param {Response} res - `res` is an object representing the HTTP response that will be sent back to
 * the client. It contains methods and properties that allow the server to send data, set headers, and
 * control the status code of the response. In this code snippet, `res` is used to send a JSON response
 * with
 */
const fetch_image = async (req: Request, res: Response) => {
    try{
        const data = await get_picture_by_id(req, res);
        res.status(200).json(data);
    } catch(error){
        res.status(500).send(error)
    }
}

/* This code creates a GET request route for fetching a specific image by its ID. When a client makes a
GET request to the "/image/:id" endpoint, the "fetch_image" function will be called to handle the
request and send a response with the image data or an error message. The ":id" parameter in the
endpoint URL is used to specify the ID of the image to be fetched. The "async/await" syntax is used
to handle asynchronous operations within the function. */
router.get('/image/:id', async (req: Request, res: Response) => {
    await fetch_image(req, res)
});

export default router;