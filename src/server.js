import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

dotenv.config();

const setupServer = async () => {
    const app = express();

    // Database connection
    await connectMongoDB();

    // Standard Middleware
    app.use(cors());
    app.use(express.json());
    app.use(logger);

    // Routes
    app.use('/notes', notesRouter);

    app.get('/', (req, res) => {
        res.json({ message: 'Server is running' });
    });

    // Error handling
    app.use(notFoundHandler);
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
};

setupServer();
