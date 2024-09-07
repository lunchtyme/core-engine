import express from 'express';
import cors from 'cors';
import { loadEnv, validateEnvVariables } from './utils/index';
import { globalErrorMiddleware, notFoundMiddleware } from './middlewares/index';
import { DB } from './infrastructure';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { authRouter, invitationRouter } from './routers';

validateEnvVariables();
loadEnv(process.env.NODE_ENV!);
const SERVER = express();
const PORT = parseInt(process.env.PORT!) || 8080;
SERVER.use(express.urlencoded({ extended: false }));
SERVER.use(express.json());
SERVER.use(morgan('dev'));
SERVER.use(cors({}));
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
  apis: ['./src/routers/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
// API Docs
SERVER.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// Auth Routes
SERVER.use('/auth', authRouter);
// Invitation Routes
SERVER.use('/invitations', invitationRouter);
// Global error interceptor
SERVER.use(globalErrorMiddleware);
// Not found route handler
SERVER.use(notFoundMiddleware);
SERVER.listen(PORT, () => {
  console.log(`API server listening for requests on port: ${PORT}`);
});
