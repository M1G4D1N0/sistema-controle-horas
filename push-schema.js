const { drizzle } = require('drizzle-orm/neon-serverless');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure websocket constructor
neonConfig.webSocketConstructor = ws;

async function pushSchema() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    console.log('Connecting to database...');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool });

    // Execute schema creation SQL directly
    const sql = `
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "username" text NOT NULL UNIQUE,
        "email" text NOT NULL UNIQUE,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "timesheet_entries" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer REFERENCES "users"("id"),
        "date" date NOT NULL,
        "day_of_week" text NOT NULL,
        "full_day" boolean DEFAULT false NOT NULL,
        "half_day" boolean DEFAULT false NOT NULL,
        "daily_value" numeric(10, 2) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "weekly_summaries" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer REFERENCES "users"("id"),
        "week_start" date NOT NULL,
        "week_end" date NOT NULL,
        "full_days_count" integer NOT NULL,
        "half_days_count" integer NOT NULL,
        "total_value" numeric(10, 2) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "users_username_unique" ON "users" ("username");
      CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
    `;

    await pool.query(sql);
    console.log('✅ Database schema created successfully!');
    
    // Create default user
    const defaultUser = await pool.query(`
      INSERT INTO users (username, email) 
      VALUES ('default_user', 'user@example.com') 
      ON CONFLICT (username) DO NOTHING
      RETURNING *
    `);
    
    if (defaultUser.rows.length > 0) {
      console.log('✅ Default user created:', defaultUser.rows[0]);
    } else {
      console.log('✅ Default user already exists');
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error pushing schema:', error);
    process.exit(1);
  }
}

pushSchema();