import { users, timesheetEntries, weeklySummaries, type User, type InsertUser, type TimesheetEntry, type InsertTimesheetEntry, type WeeklySummary, type InsertWeeklySummary } from "../shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Timesheet operations
  getTimesheetEntries(userId: number, weekStart: string, weekEnd: string): Promise<TimesheetEntry[]>;
  saveTimesheetEntry(entry: InsertTimesheetEntry): Promise<TimesheetEntry>;
  updateTimesheetEntry(id: number, entry: Partial<InsertTimesheetEntry>): Promise<TimesheetEntry | undefined>;
  deleteTimesheetEntry(id: number): Promise<void>;
  
  // Weekly summary operations
  getWeeklySummary(userId: number, weekStart: string): Promise<WeeklySummary | undefined>;
  saveWeeklySummary(summary: InsertWeeklySummary): Promise<WeeklySummary>;
  updateWeeklySummary(id: number, summary: Partial<InsertWeeklySummary>): Promise<WeeklySummary | undefined>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Timesheet operations
  async getTimesheetEntries(userId: number, weekStart: string, weekEnd: string): Promise<TimesheetEntry[]> {
    return await db
      .select()
      .from(timesheetEntries)
      .where(
        and(
          eq(timesheetEntries.userId, userId),
          gte(timesheetEntries.date, weekStart),
          lte(timesheetEntries.date, weekEnd)
        )
      )
      .orderBy(timesheetEntries.date);
  }

  async saveTimesheetEntry(entry: InsertTimesheetEntry): Promise<TimesheetEntry> {
    const [savedEntry] = await db
      .insert(timesheetEntries)
      .values(entry)
      .returning();
    return savedEntry;
  }

  async updateTimesheetEntry(id: number, entry: Partial<InsertTimesheetEntry>): Promise<TimesheetEntry | undefined> {
    const [updatedEntry] = await db
      .update(timesheetEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(timesheetEntries.id, id))
      .returning();
    return updatedEntry || undefined;
  }

  async deleteTimesheetEntry(id: number): Promise<void> {
    await db
      .delete(timesheetEntries)
      .where(eq(timesheetEntries.id, id));
  }

  // Weekly summary operations
  async getWeeklySummary(userId: number, weekStart: string): Promise<WeeklySummary | undefined> {
    const [summary] = await db
      .select()
      .from(weeklySummaries)
      .where(
        and(
          eq(weeklySummaries.userId, userId),
          eq(weeklySummaries.weekStart, weekStart)
        )
      );
    return summary || undefined;
  }

  async saveWeeklySummary(summary: InsertWeeklySummary): Promise<WeeklySummary> {
    const [savedSummary] = await db
      .insert(weeklySummaries)
      .values(summary)
      .returning();
    return savedSummary;
  }

  async updateWeeklySummary(id: number, summary: Partial<InsertWeeklySummary>): Promise<WeeklySummary | undefined> {
    const [updatedSummary] = await db
      .update(weeklySummaries)
      .set({ ...summary, updatedAt: new Date() })
      .where(eq(weeklySummaries.id, id))
      .returning();
    return updatedSummary || undefined;
  }
}

// Memory storage implementation (for local development/fallback)
export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private timesheetEntries: Map<number, TimesheetEntry> = new Map();
  private weeklySummaries: Map<number, WeeklySummary> = new Map();
  private nextUserId = 1;
  private nextTimesheetId = 1;
  private nextSummaryId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      username: insertUser.username,
      email: insertUser.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getTimesheetEntries(userId: number, weekStart: string, weekEnd: string): Promise<TimesheetEntry[]> {
    const entries = Array.from(this.timesheetEntries.values())
      .filter(entry => 
        entry.userId === userId &&
        entry.date >= weekStart &&
        entry.date <= weekEnd
      )
      .sort((a, b) => a.date.localeCompare(b.date));
    return entries;
  }

  async saveTimesheetEntry(entry: InsertTimesheetEntry): Promise<TimesheetEntry> {
    const savedEntry: TimesheetEntry = {
      id: this.nextTimesheetId++,
      userId: entry.userId,
      date: entry.date,
      dayOfWeek: entry.dayOfWeek,
      fullDay: entry.fullDay,
      halfDay: entry.halfDay,
      dailyValue: entry.dailyValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.timesheetEntries.set(savedEntry.id, savedEntry);
    return savedEntry;
  }

  async updateTimesheetEntry(id: number, entry: Partial<InsertTimesheetEntry>): Promise<TimesheetEntry | undefined> {
    const existingEntry = this.timesheetEntries.get(id);
    if (!existingEntry) return undefined;
    
    const updatedEntry = {
      ...existingEntry,
      ...entry,
      updatedAt: new Date(),
    };
    this.timesheetEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteTimesheetEntry(id: number): Promise<void> {
    this.timesheetEntries.delete(id);
  }

  async getWeeklySummary(userId: number, weekStart: string): Promise<WeeklySummary | undefined> {
    for (const summary of this.weeklySummaries.values()) {
      if (summary.userId === userId && summary.weekStart === weekStart) {
        return summary;
      }
    }
    return undefined;
  }

  async saveWeeklySummary(summary: InsertWeeklySummary): Promise<WeeklySummary> {
    const savedSummary: WeeklySummary = {
      id: this.nextSummaryId++,
      userId: summary.userId,
      weekStart: summary.weekStart,
      weekEnd: summary.weekEnd,
      fullDaysCount: summary.fullDaysCount,
      halfDaysCount: summary.halfDaysCount,
      totalValue: summary.totalValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.weeklySummaries.set(savedSummary.id, savedSummary);
    return savedSummary;
  }

  async updateWeeklySummary(id: number, summary: Partial<InsertWeeklySummary>): Promise<WeeklySummary | undefined> {
    const existingSummary = this.weeklySummaries.get(id);
    if (!existingSummary) return undefined;
    
    const updatedSummary = {
      ...existingSummary,
      ...summary,
      updatedAt: new Date(),
    };
    this.weeklySummaries.set(id, updatedSummary);
    return updatedSummary;
  }
}

// Export storage instance
export const storage = new DatabaseStorage();