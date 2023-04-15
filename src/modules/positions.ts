import { Request, Response } from 'express';
import path from 'path';
import { database } from '../../server';


// export const getMowerPosition = (req: Request, res: Response) => {
//     const { filename } = req.params
//     const dirname = path.resolve()
//     const fullfilepath = path.join(dirname, 'images/'+ filename)
//     console.log("The fullfile path is: ", fullfilepath)
//     res.sendFile(fullfilepath)
// }

export const storeMowerPosition = (req: Request, res: Response) =>{
    const position = {
        position_horizontal: req.body.position_horizontal,
        position_vertical: req.body.position_vertical,
      };
      
      database("positions")
        .insert(position)
        .then(() => {
          console.log("User inserted successfully");
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {
          database.destroy();
        });
}