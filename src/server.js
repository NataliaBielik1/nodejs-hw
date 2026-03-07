import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';

dotenv.config();

const setupServer = async () => {
    const app = express();

    // Database connection
    await connectMongoDB();

    // Standard Middleware
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(logger);

    // Routes
    app.use(authRouter);
    app.use(notesRouter);

    app.get('/', (req, res) => {
        res.json({ message: 'Server is running' });
    });

    // Error handling
    app.use(errors());
    app.use(notFoundHandler);
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
};

setupServer();
