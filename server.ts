import express, { Express } from 'express';
import welcomeRouter from './src/routes/welcome'
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from "cors";
import logger from './src/middleware/logger';

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
server.get("/", (req, res) => {
  res.send("nice");
});
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});