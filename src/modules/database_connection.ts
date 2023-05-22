import { Client } from 'pg';

/* This code is exporting a constant variable named `database` which is an instance of the `Client`
class from the `pg` library. The `Client` class is used to connect to a PostgreSQL database. The
`connectionString` property is used to specify the URL of the database to connect to, and the `ssl`
property is used to specify whether to use SSL encryption for the connection. In this case,
`rejectUnauthorized` is set to `false` to allow self-signed SSL certificates. Finally, the
`database.connect()` method is called to establish a connection to the database. */
export const database = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
database.connect();