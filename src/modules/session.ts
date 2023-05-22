
import { database } from './database_connection';

export const session_clearing = async () => {
      await database.query(`DELETE FROM events`);
      await database.query(`DELETE FROM positions`);
      return true;
}