import { Request, Response } from 'express';
import path from 'path';
import { database } from './database_connection';


// export const getMowerPosition = (req: Request, res: Response) => {
//     const { filename } = req.params
//     const dirname = path.resolve()
//     const fullfilepath = path.join(dirname, 'images/'+ filename)
//     console.log("The fullfile path is: ", fullfilepath)
//     res.sendFile(fullfilepath)
// }

export const position_storing = async (position_horizontal: string, position_vertical: string, position_type: string) => {
      const id = await database.query(`INSERT INTO positions (position_horizontal, position_vertical, position_type_id) VALUES ('${position_horizontal}', '${position_vertical}', (SELECT id FROM position_type WHERE name = '${position_type}')) returning id;`);
      return id.rows[0].id;
}


export const position_fetching = async (type: string) => {
      const data = await database.query(`SELECT * FROM positions p JOIN position_type pt on p.position_type_id = pt.id WHERE pt.name = '${type}' ORDER BY timestamp DESC`)
      return data.rows;
}