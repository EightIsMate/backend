import express, { Express } from 'express';
import welcomeRouter from './src/routes/welcome'
import {router as positionsRouter} from './src/routes/positions'
import picuresRouter from './src/routes/pictures'
import eventRouter from './src/routes/events'
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import logger from './src/middleware/logger';

// export const database = require("knex")({
//   client: "pg",
//   connection: {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   },
// });

// export const database = require("knex")({
//   client: 'postgresql',
//   connection: process.env.DATABASE_URL,
//   searchPath: ['public'],
// });


dotenv.config();

const server: Express = express();
const port = process.env.PORT;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());
server.use(express.json({ limit: '200kb' }));
server.use(express.urlencoded({ extended: true }));

server.use(logger);


server.use(welcomeRouter);
server.use(positionsRouter);
server.use(picuresRouter);
server.use(eventRouter);

server.get("/", (req, res) => {
  res.send("nice");
});
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});