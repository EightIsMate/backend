
import { database } from '../../server';



export const position_storing = async (position_horizontal: string, position_vertical: string) => {
      const id = await database.query(`INSERT INTO positions (position_horizontal, position_vertical) VALUES ('${position_horizontal}', '${position_vertical}') returning id;`);
      return id.rows[0].id;
}

export const position_fetching = async () => {
      const data = await database.query('SELECT * FROM positions ORDER BY timestamp DESC')
      return data.rows;
}