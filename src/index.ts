import express from 'express';
import cors from 'cors';
import { loadEnv, validateEnvVariables } from './utils/index';
import { globalErrorMiddleware, notFoundMiddleware } from './middlewares/index';
import { agenda, DB } from './infrastructure';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import {
  analyticsRouter,
  authRouter,
  billingRouter,
  foodMenuRouter,
  invitationRouter,
  orderRouter,
  userRouter,
} from './routers';

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
// Start scheduler
agenda.start();
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
SERVER.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
SERVER.use('/auth', authRouter);
SERVER.use('/invitations', invitationRouter);
SERVER.use('/food-menu', foodMenuRouter);
SERVER.use('/users', userRouter);
SERVER.use('/billings', billingRouter);
SERVER.use('/analytics', analyticsRouter);
SERVER.use('/orders', orderRouter);
SERVER.use(notFoundMiddleware);
SERVER.use(globalErrorMiddleware);
SERVER.listen(PORT, () => {
  console.log(`API server listening for requests on port: ${PORT}`);
});
