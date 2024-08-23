import express, { Request, Response } from 'express';
import cors from 'cors';
import { loadEnv } from './utils/index';
import { notFound } from './middlewares/index';
import { DB } from './infrastructure';

loadEnv(process.env.NODE_ENV!);

const SERVER = express();
const PORT = parseInt(process.env.PORT!) || 8080;

SERVER.use(express.urlencoded({ extended: false }));
SERVER.use(express.json());
SERVER.use(cors());

// Connect database
DB.connect();

// Not found route handler
SERVER.use(notFound);

SERVER.listen(PORT, () => {
  console.log(`API server listening for requests on port: ${PORT}`);
});
