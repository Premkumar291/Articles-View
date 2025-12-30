import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import process from 'process';
import dotenv from 'dotenv';

import articleRoutes from './routes/articleRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/articles', articleRoutes);

// Manual trigger for AI Worker (since Cron is not free on Render Config)
import { exec } from 'child_process';
app.post('/trigger-ai-update', (req, res) => {
    console.log('Manual trigger: Starting AI Worker...');
    // Execute the worker script in the background
    exec('npm run worker', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });

    res.json({ success: true, message: 'AI Worker started in background' });
});

app.get('/', (req, res) => {
    res.send('BeyondChats Backend API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
