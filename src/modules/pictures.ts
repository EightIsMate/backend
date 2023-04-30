import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { database } from "./database_connection";

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const picture_storing = async (req: Request, res: Response) => {
    try {
      if (req.file) {
          // upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
          // const result = await cloudinary.uploader.upload(req.file.path, {public_id: ""}); // this can give the picture a name
          
          const rows = await database.query(`INSERT INTO Images (img_link, positionid) VALUES ('${result.secure_url}', '${req.body.positionid}') returning id`);
          // send back image URL
          res.status(201).json({ url: result.secure_url, id: rows.rows[0].id });
      } else {
          res.status(400).send("img missing");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error uploading image to Cloudinary: ${error}`);
    }
}

export const picture_fetching = async (req: Request, res: Response) => {
  try{
    const rows = await database.query('SELECT * FROM Images')
    if(rows.rowCount > 0){
      //console.log("image link: ", rows.rows[0].img_link)
      res.status(200).json(rows.rows[0])
    } else{
      res.status(301).send("No, images to fetch in the DB!")
    }
  } catch(error){
    console.error(error)
    res.status(500).send("Error fetching image from Database")
  }
}
