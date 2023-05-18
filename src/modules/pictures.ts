import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { database } from "./database_connection";
import { annotate_image } from "./vision";

import { image_position_storing } from "./positions"

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

/**
 * This function uploads an image to Cloudinary, inserts the image link and labels into a database, and
 * returns the image URL, ID, and labels.
 * @param {Request} req - The `req` parameter is an object representing the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and any data sent in the
 * request body. The request body must have a file-path and position-id (UUID with foreign key constraint in positions table)
 * @param {Response} res - The `res` parameter is an object representing the HTTP response that will be
 * sent back to the client. It contains methods and properties that allow the server to send data,
 * headers, and status codes back to the client.
 */
export const picture_storing = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      // upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // const result = await cloudinary.uploader.upload(req.file.path, {public_id: ""}); // this can give the picture a name

      //create the image database insert
      const rows = await database.query(`INSERT INTO Images (img_link, positionid) VALUES ('${result.secure_url}', '${req.body.positionid}') returning id`);

      //create the labeling for the image
      const labeling = await annotate_image(result.secure_url)
      const image_id = rows.rows[0].id
      let query = "INSERT INTO labels(imageid, label) VALUES "
      labeling.forEach((element, i) => {
        query += `( '${image_id}' , '${element}')` + (labeling.length > i + 1 ? ", " : ";")
      });
      console.log(query)
      if (query.endsWith(");")) {
        await database.query(query);
      }

      // send back image URL
      res.status(201).json({ url: result.secure_url, id: image_id, labels: labeling });
    } else {
      res.status(400).send("img missing");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error uploading image to Cloudinary: ${error}`);
  }
}

/**
 * This function first stores position in a database, uploads image to Cloudinary, then stores image-data 
 * in database, creates labels for the image which is stored in the database as well,
 * and returns the image URL, image-ID, and labels.
 * @param {Request} req - The request object containing information about the HTTP request made to the
 * server consists of horizontal, vertical and a file-path of the image.
 * @param {Response} res - The "res" parameter is the response object that is used to send a response
 * back to the client who made the request. It contains methods such as "status" to set the HTTP status
 * code of the response, "json" to send a JSON response, and "send" to send a plain
 */
export const picture_position_storing = async (req: Request, res: Response) => {
  //console.log("Line 69, picture storing, pictures.ts, modules. horizontal: ", req.body.position_horizontal)
  try {
    if (req.file) {
      const position_id = await image_position_storing(req.body.position_horizontal, req.body.position_vertical, "mover")
      //console.log("Line 59, picture storing, pictures.ts, modules. pos_id: ", position_id)
      // upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      //create the image database insert
      const rows = await database.query(`INSERT INTO Images (img_link, positionid) VALUES ('${result.secure_url}', '${position_id}') returning id`);
      
      //create the labeling for the image
      const labeling = await annotate_image(result.secure_url)
      const image_id = rows.rows[0].id
      let query = "INSERT INTO labels(imageid, label) VALUES "
      labeling.forEach( (element, i) => {
        query += `( '${image_id}' , '${element}')` + (labeling.length > i + 1 ? ", " : ";")
      });
      if (query.endsWith(");")) {
        await database.query(query);
      }
      // send back image URL
      res.status(201).json({ url: result.secure_url, id: image_id, labels: labeling });
    } else {
      res.status(400).send("img missing");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error uploading image to Cloudinary: ${error}`);
  }
}

/**
 * This function fetches the latest image from a database and returns it as a JSON response, or returns
 * an error message if there are no images or an error occurs.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request.
 * @param {Response} res - `res` is the response object that is used to send a response back to the
 * client making the request. It contains methods like `status()` to set the HTTP status code, `json()`
 * to send a JSON response, and `send()` to send a plain text response.
 */
export const picture_fetching = async (req: Request, res: Response) => {
  try {
    const rows = await database.query('SELECT * FROM Images')
    if (rows.rowCount > 0) {
      res.status(200).json(rows.rows[rows.rowCount - 1])
    } else {
      res.status(204).send("No, images to fetch in the DB!")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error fetching image from Database")
  }
}

/**
 * This function retrieves an image from a database based on its ID.
 * @param {Request} req - Request object, which contains information about the incoming HTTP request.
 * @param {Response} res - Response is an object that represents the HTTP response that an Express app
 * sends when it gets an HTTP request. It is used to send the response back to the client with data,
 * status codes, headers, etc.
 * @returns If the query is successful and there is at least one row returned, the function will return
 * the first row of the result set. If there are no rows returned, the function will return the string
 * "No image in the DB". If there is an error, the function will return the error object.
 */
export const get_picture_by_id = async (req: Request, res: Response) => {
  var id = req.params.id
  console.log("Line 48, pictures.ts modules, id = ", id)
  try {
    const rows = await database.query('SELECT img_link, i.positionid, label FROM Images i LEFT JOIN  labels l ON l.imageid = i.id WHERE i.id = $1', [id])
    //console.log("Line 50, link = ", rows)
    if (rows.rowCount > 0) {
      let data = {
        img_link: rows.rows[0].img_link,
        id: id,
        position_id: rows.rows[0].positionid,
        labels: [] as string[]
      }
      for (let row of rows.rows) {
        if (!row.label) {
          continue
        }
        data.labels.push(row.label)
      }
      res.status(200).json(data)
    } else {
      res.status(204).send("No, images to fetch in the DB!")

    }
  } catch (error) {
    console.error(error)
    return error
  }
}

/**
 * This function retrieves a picture link from a database based on the provided ID.
 * @param {Request} req - The req parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, URL, and any data sent in the
 * request body.
 * @param {Response} res - Response object from the Express.js framework, used to send a response back
 * to the client making the request.
 * @returns If the query is successful and there is at least one row returned, the function will return
 * the first row of the result set. If there is no image in the database with the given ID, the
 * function will return the string "No image in the DB". If there is an error during the query, the
 * function will return the error object.
 */
export const get_picture_link = async (req: Request, res: Response) => {
  var id = req.params.id
  try {
    const rows = await database.query('SELECT * FROM Images WHERE id = $1', [id])
    if (rows) {
      return rows.rows[0]
    } else {
      return "No image in the DB"
    }

  }
  catch (error) {
    return error
  }
}