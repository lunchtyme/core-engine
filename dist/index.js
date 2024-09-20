"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./utils/index");
const index_2 = require("./middlewares/index");
const infrastructure_1 = require("./infrastructure");
const morgan_1 = __importDefault(require("morgan"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routers_1 = require("./routers");
(0, index_1.validateEnvVariables)();
(0, index_1.loadEnv)(process.env.NODE_ENV);
const SERVER = (0, express_1.default)();
const PORT = parseInt(process.env.PORT) || 8080;
SERVER.use(express_1.default.urlencoded({ extended: false }));
SERVER.use(express_1.default.json());
SERVER.use((0, morgan_1.default)('dev'));
SERVER.use((0, cors_1.default)({}));
// Connect database
infrastructure_1.DB.connect();
// Start scheduler
infrastructure_1.agenda.start();
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
SERVER.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
SERVER.use('/auth', routers_1.authRouter);
SERVER.use('/invitations', routers_1.invitationRouter);
SERVER.use('/food-menu', routers_1.foodMenuRouter);
SERVER.use('/users', routers_1.userRouter);
SERVER.use('/billings', routers_1.billingRouter);
SERVER.use('/analytics', routers_1.analyticsRouter);
SERVER.use('/orders', routers_1.orderRouter);
SERVER.use(index_2.notFoundMiddleware);
SERVER.use(index_2.globalErrorMiddleware);
SERVER.listen(PORT, () => {
    console.log(`API server listening for requests on port: ${PORT}`);
});
