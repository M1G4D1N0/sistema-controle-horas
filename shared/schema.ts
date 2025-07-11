import { pgTable, serial, text, boolean, timestamp, decimal, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for future authentication/multi-user support
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Timesheet entries table
export const timesheetEntries = pgTable('timesheet_entries', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  date: date('date').notNull(),
  dayOfWeek: text('day_of_week').notNull(),
  fullDay: boolean('full_day').default(false).notNull(),
  halfDay: boolean('half_day').default(false).notNull(),
  dailyValue: decimal('daily_value', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Weekly summaries table
export const weeklySummaries = pgTable('weekly_summaries', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  weekStart: date('week_start').notNull(),
  weekEnd: date('week_end').notNull(),
  fullDaysCount: serial('full_days_count').notNull(),
  halfDaysCount: serial('half_days_count').notNull(),
  totalValue: decimal('total_value', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  timesheetEntries: many(timesheetEntries),
  weeklySummaries: many(weeklySummaries),
}));

export const timesheetEntriesRelations = relations(timesheetEntries, ({ one }) => ({
  user: one(users, {
    fields: [timesheetEntries.userId],
    references: [users.id],
  }),
}));

export const weeklySummariesRelations = relations(weeklySummaries, ({ one }) => ({
  user: one(users, {
    fields: [weeklySummaries.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TimesheetEntry = typeof timesheetEntries.$inferSelect;
export type InsertTimesheetEntry = typeof timesheetEntries.$inferInsert;
export type WeeklySummary = typeof weeklySummaries.$inferSelect;
export type InsertWeeklySummary = typeof weeklySummaries.$inferInsert;