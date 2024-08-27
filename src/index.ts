import express, { Request, Response } from 'express';
import cors from 'cors';
import { loadEnv } from './utils/index';
import { notFound } from './middlewares/index';
import { DB } from './infrastructure';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

loadEnv(process.env.NODE_ENV!);

const SERVER = express();
const PORT = parseInt(process.env.PORT!) || 8080;

SERVER.use(express.urlencoded({ extended: false }));
SERVER.use(express.json());
SERVER.use(morgan('dev'));
SERVER.use(cors());

// Connect database
DB.connect();

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lunchtyme API docs',
      version: '1.0.0',
      description: 'Lunchtyme API documentation',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/router/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// API Docs
SERVER.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Not found route handler
SERVER.use(notFound);

SERVER.listen(PORT, () => {
  console.log(`API server listening for requests on port: ${PORT}`);
});
