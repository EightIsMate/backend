
import { database } from './database_connection';


/**
 * This TypeScript function stores image position data in a database and returns the ID of the newly
 * created position.
 * @param {string} position_horizontal - a string representing the horizontal position of the object 
 * when the image was taken.
 * @param {string} position_vertical - The vertical position of a the object when the image was taken.
 * @param {string} position_type - This parameter is a string that represents the type of position
 * being stored. It is used to query the database for the corresponding position type ID.
 * @returns the id of the newly inserted position record in the database, which is a UUID in string.
 */
export const image_position_storing =async (position_horizontal: string, position_vertical: string, position_type: string) => {
      console.log("Line 8, positions.ts, modules, image_position_storing. horizontal: ", position_horizontal, " vertical: ", position_vertical, " type: ", position_type)
      const id = await database.query(`INSERT INTO positions (position_horizontal, position_vertical, position_type_id) VALUES ('${position_horizontal}', '${position_vertical}', (SELECT id FROM position_type WHERE name = '${position_type}')) returning id;`);
      console.log("Line 10, positions.ts, modules, image_position_storing. position id: ", id.rows[0])
      return id.rows[0].id;
}

/**
 * This function stores a position in a database and returns its ID.
 * @param {string} position_horizontal - A string representing the horizontal position of an object which is a decimal.
 * @param {string} position_vertical - The position_vertical parameter is a string that represents the
 * vertical position of the object which is decimal.
 * @param {string} position_type - The parameter "position_type" is a string that represents the type
 * of position being stored. It is used to query the "position_type" table to retrieve the
 * corresponding ID for the position type.
 * @returns The function `position_storing` is returning the `id` of the newly inserted row in the
 * `positions` table, which is a UUID.
 */
export const position_storing = async (position_horizontal: string, position_vertical: string, position_type: string) => {
      const id = await database.query(`INSERT INTO positions (position_horizontal, position_vertical, position_type_id) VALUES ('${position_horizontal}', '${position_vertical}', (SELECT id FROM position_type WHERE name = '${position_type}')) returning id;`);
      return id.rows[0].id;
}


/**
 * This function fetches positions from a database based on a given position type.
 * @param {string} type - The `type` parameter is a string that represents the name of the position
 * type that we want to fetch from the database. It is used in the SQL query to filter the results and
 * only return positions that belong to the specified type.
 * @returns The function `position_fetching` is returning an array of objects that represent positions
 * fetched from a database. The positions are filtered by the `type` parameter, which is used to query
 * the database for positions of a specific type. The positions are sorted by timestamp in descending
 * order. Return values consist of list with position_horizontal, position_vertical, timestamp, id, position_type_id, and name.
 */
export const position_fetching = async (type: string) => {
      const data = await database.query(`SELECT * FROM positions p JOIN position_type pt on p.position_type_id = pt.id WHERE pt.name = '${type}' ORDER BY timestamp DESC`)
      return data.rows;
}