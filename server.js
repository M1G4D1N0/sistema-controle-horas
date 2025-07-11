const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

// Configure websocket constructor
neonConfig.webSocketConstructor = ws;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Default user ID (in a real app, you'd have authentication)
const DEFAULT_USER_ID = 1;

// API Routes

// Get timesheet entries for a week
app.get('/api/timesheet/:weekStart/:weekEnd', async (req, res) => {
  try {
    const { weekStart, weekEnd } = req.params;
    const result = await pool.query(
      `SELECT * FROM timesheet_entries 
       WHERE user_id = $1 AND date >= $2 AND date <= $3 
       ORDER BY date`,
      [DEFAULT_USER_ID, weekStart, weekEnd]
    );
    res.json(result.rows);
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
    const existingResult = await pool.query(
      'SELECT * FROM timesheet_entries WHERE user_id = $1 AND date = $2',
      [DEFAULT_USER_ID, date]
    );
    
    if (existingResult.rows.length > 0) {
      // Update existing entry
      const updateResult = await pool.query(
        `UPDATE timesheet_entries 
         SET full_day = $1, half_day = $2, daily_value = $3, updated_at = NOW()
         WHERE user_id = $4 AND date = $5
         RETURNING *`,
        [fullDay, halfDay, dailyValue, DEFAULT_USER_ID, date]
      );
      res.json(updateResult.rows[0]);
    } else {
      // Create new entry
      const insertResult = await pool.query(
        `INSERT INTO timesheet_entries (user_id, date, day_of_week, full_day, half_day, daily_value)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [DEFAULT_USER_ID, date, dayOfWeek, fullDay, halfDay, dailyValue]
      );
      res.json(insertResult.rows[0]);
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
    const result = await pool.query(
      'SELECT * FROM weekly_summaries WHERE user_id = $1 AND week_start = $2',
      [DEFAULT_USER_ID, weekStart]
    );
    res.json(result.rows[0] || null);
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
    const existingResult = await pool.query(
      'SELECT * FROM weekly_summaries WHERE user_id = $1 AND week_start = $2',
      [DEFAULT_USER_ID, weekStart]
    );
    
    if (existingResult.rows.length > 0) {
      // Update existing summary
      const updateResult = await pool.query(
        `UPDATE weekly_summaries 
         SET full_days_count = $1, half_days_count = $2, total_value = $3, updated_at = NOW()
         WHERE user_id = $4 AND week_start = $5
         RETURNING *`,
        [fullDaysCount, halfDaysCount, totalValue, DEFAULT_USER_ID, weekStart]
      );
      res.json(updateResult.rows[0]);
    } else {
      // Create new summary
      const insertResult = await pool.query(
        `INSERT INTO weekly_summaries (user_id, week_start, week_end, full_days_count, half_days_count, total_value)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [DEFAULT_USER_ID, weekStart, weekEnd, fullDaysCount, halfDaysCount, totalValue]
      );
      res.json(insertResult.rows[0]);
    }
  } catch (error) {
    console.error('Error saving weekly summary:', error);
    res.status(500).json({ error: 'Failed to save weekly summary' });
  }
});

// Get all weekly summaries (for history)
app.get('/api/summaries', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM weekly_summaries WHERE user_id = $1 ORDER BY week_start DESC',
      [DEFAULT_USER_ID]
    );
    res.json(result.rows);
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});