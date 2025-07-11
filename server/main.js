import { startServer } from './api.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Start the API server
startServer().catch(console.error);