import express from 'express';
import cors from 'cors';
import { storage } from './storage';
import { TimesheetEntry, WeeklySummary } from '../shared/schema';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// For simplicity, we'll use a default user (in a real app, you'd have authentication)
const DEFAULT_USER_ID = 1;

// Initialize default user
async function initializeDefaultUser() {
  try {
    let user = await storage.getUser(DEFAULT_USER_ID);
    if (!user) {
      user = await storage.createUser({
        username: 'default_user',
        email: 'user@example.com'
      });
      console.log('Created default user:', user);
    }
  } catch (error) {
    console.error('Error initializing default user:', error);
  }
}

// API Routes

// Get timesheet entries for a week
app.get('/api/timesheet/:weekStart/:weekEnd', async (req, res) => {
  try {
    const { weekStart, weekEnd } = req.params;
    const entries = await storage.getTimesheetEntries(DEFAULT_USER_ID, weekStart, weekEnd);
    res.json(entries);
  } catch (error) {
    console.error('Error getting timesheet entries:', error);
    res.status(500).json({ error: 'Failed to get timesheet entries' });
  }
});

// Save or update timesheet entry
app.post('/api/timesheet', async (req, res) => {
  try {
    const { date, dayOfWeek, fullDay, halfDay, dailyValue } = req.body;
    
    // Check if entry already exists
    const existingEntries = await storage.getTimesheetEntries(DEFAULT_USER_ID, date, date);
    
    if (existingEntries.length > 0) {
      // Update existing entry
      const updatedEntry = await storage.updateTimesheetEntry(existingEntries[0].id, {
        fullDay,
        halfDay,
        dailyValue
      });
      res.json(updatedEntry);
    } else {
      // Create new entry
      const newEntry = await storage.saveTimesheetEntry({
        userId: DEFAULT_USER_ID,
        date,
        dayOfWeek,
        fullDay,
        halfDay,
        dailyValue
      });
      res.json(newEntry);
    }
  } catch (error) {
    console.error('Error saving timesheet entry:', error);
    res.status(500).json({ error: 'Failed to save timesheet entry' });
  }
});

// Get weekly summary
app.get('/api/summary/:weekStart', async (req, res) => {
  try {
    const { weekStart } = req.params;
    const summary = await storage.getWeeklySummary(DEFAULT_USER_ID, weekStart);
    res.json(summary);
  } catch (error) {
    console.error('Error getting weekly summary:', error);
    res.status(500).json({ error: 'Failed to get weekly summary' });
  }
});

// Save or update weekly summary
app.post('/api/summary', async (req, res) => {
  try {
    const { weekStart, weekEnd, fullDaysCount, halfDaysCount, totalValue } = req.body;
    
    // Check if summary already exists
    const existingSummary = await storage.getWeeklySummary(DEFAULT_USER_ID, weekStart);
    
    if (existingSummary) {
      // Update existing summary
      const updatedSummary = await storage.updateWeeklySummary(existingSummary.id, {
        fullDaysCount,
        halfDaysCount,
        totalValue
      });
      res.json(updatedSummary);
    } else {
      // Create new summary
      const newSummary = await storage.saveWeeklySummary({
        userId: DEFAULT_USER_ID,
        weekStart,
        weekEnd,
        fullDaysCount,
        halfDaysCount,
        totalValue
      });
      res.json(newSummary);
    }
  } catch (error) {
    console.error('Error saving weekly summary:', error);
    res.status(500).json({ error: 'Failed to save weekly summary' });
  }
});

// Get all weekly summaries (for history)
app.get('/api/summaries', async (req, res) => {
  try {
    // Since we don't have a direct method for this, we'll simulate it
    // In a real app, you'd add this method to the storage interface
    res.json([]);
  } catch (error) {
    console.error('Error getting summaries:', error);
    res.status(500).json({ error: 'Failed to get summaries' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
  await initializeDefaultUser();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running on port ${PORT}`);
  });
}

export { app, startServer };