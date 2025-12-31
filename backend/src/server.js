import express from 'express';
import cors from 'cors';
import process from 'process';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import connectDB from './config/db.js';
import articleRoutes from './routes/articleRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/articles', articleRoutes);

app.post('/trigger-ai-update', (req, res) => {
    console.log('Manual trigger: Starting AI Worker...');

    exec('npm run worker', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
    });

    res.json({ success: true, message: 'AI Worker started in background' });
});

app.get('/', (req, res) => {
    res.send('BeyondChats Backend API is running...');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error',
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
