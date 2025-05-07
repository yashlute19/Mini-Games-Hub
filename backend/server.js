const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Debug: Print environment variables
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();

// CORS Configuration
const corsOptions = {
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/mini-games-hub';
console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

// Check if MongoDB is running
const checkMongoDBService = async () => {
    try {
        const { exec } = require('child_process');
        return new Promise((resolve) => {
            exec('sc query MongoDB', (error, stdout, stderr) => {
                if (error) {
                    console.error('Error checking MongoDB service:', error);
                    resolve(false);
                }
                const isRunning = stdout.includes('RUNNING');
                console.log('MongoDB service status:', isRunning ? 'Running' : 'Not running');
                resolve(isRunning);
            });
        });
    } catch (error) {
        console.error('Error checking MongoDB service:', error);
        return false;
    }
};

const connectWithRetry = async () => {
    // First check if MongoDB service is running
    const isMongoRunning = await checkMongoDBService();
    if (!isMongoRunning) {
        console.error('MongoDB service is not running. Please start MongoDB service first.');
        return false;
    }

    let retries = 5;
    while (retries > 0) {
        try {
            console.log(`Attempting to connect to MongoDB (Attempt ${6 - retries}/5)...`);
            await mongoose.connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected to MongoDB successfully!');
            console.log('MongoDB connection state:', mongoose.connection.readyState);
            return true;
        } catch (error) {
            retries--;
            console.error(`MongoDB connection attempt ${6 - retries} failed:`, error.message);
            console.error('Full error:', error);
            if (retries === 0) {
                console.error('Max retries reached. Could not connect to MongoDB.');
                console.error('Please make sure MongoDB is installed and running locally.');
                console.error('You can download MongoDB from: https://www.mongodb.com/try/download/community');
                return false;
            }
            console.log(`Retrying in 2 seconds... (${retries} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    return false;
};

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
// Get all feedbacks
app.get('/api/feedbacks', async (req, res) => {
    try {
        console.log('Fetching feedbacks...');
        const feedbacks = await Feedback.find().sort({ date: -1 }).limit(5);
        console.log('Found feedbacks:', feedbacks);
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Add new feedback
app.post('/api/feedbacks', async (req, res) => {
    try {
        console.log('Received feedback data:', req.body);
        const feedback = new Feedback(req.body);
        const savedFeedback = await feedback.save();
        console.log('Saved feedback:', savedFeedback);
        res.status(201).json(savedFeedback);
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(400).json({ message: 'Invalid feedback data', error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Start server only after MongoDB connection
const startServer = async () => {
    const connected = await connectWithRetry();
    if (connected) {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Health check available at http://localhost:${PORT}/api/health`);
            console.log(`Feedbacks endpoint available at http://localhost:${PORT}/api/feedbacks`);
        });
    } else {
        process.exit(1);
    }
};

startServer(); 