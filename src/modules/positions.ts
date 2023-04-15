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

export const position_storing = async (position_horizontal: string, position_vertical: string) => {
      const id = await database.query(`INSERT INTO positions (position_horizontal, position_vertical) VALUES ('${position_horizontal}', '${position_vertical}') returning id;`);
      return id.rows[0].id;
}