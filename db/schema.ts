import { pgTable, serial, varchar, text, integer, timestamp, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Enums
 */
export const userRoleEnum = pgEnum("user_role", ["Sovereign Lord", "admin", "member", "viewer"]);
export const robotStatusEnum = pgEnum("robot_status", ["validation", "canceled", "active", "retiree"]);

/**
 * Members table: project users
 */

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("viewer"),
  instagram: varchar("instagram", { length: 100 }).default(""),
  linkedin: varchar("linkedin", { length: 100 }).default(""),
  bio: varchar("bio", { length: 500 }).default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Competitions table: events where robots compete
 */
export const competitions = pgTable("competitions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("upcoming"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Robots table: robots created by members
 */
export const robots = pgTable("robots", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  competitionId: integer("competition_id")
    .notNull()
    .references(() => competitions.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  status: robotStatusEnum("status").notNull().default("validation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * robot_members: track member contributions to robots over time
 */
export const robotMembers = pgTable(
  "robot_members",
  {
    robotId: integer("robot_id")
      .notNull()
      .references(() => robots.id),
    memberId: integer("member_id")
      .notNull()
      .references(() => users.id),
    fromDate: timestamp("from_date").notNull(),
    toDate: timestamp("to_date"),
  },
  (table) => ({
    pk: primaryKey(table.robotId, table.memberId, table.fromDate),
  })
);

/**
 * Awards table: records awards granted to robots in competitions
 */
export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  robotId: integer("robot_id")
    .notNull()
    .references(() => robots.id),
  competitionId: integer("competition_id")
    .notNull()
    .references(() => competitions.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  awardedAt: timestamp("awarded_at").notNull(),
});

/**
 * Relations
 */
export const membersRelations = relations(users, ({ many }) => ({
  robots: many(robots),
  contributions: many(robotMembers),
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  robots: many(robots),
  awards: many(awards),
}));

export const robotsRelations = relations(robots, ({ one, many }) => ({
  member: one(users, {
    fields: [robots.userId],
    references: [users.id],
  }),
  competition: one(competitions, {
    fields: [robots.competitionId],
    references: [competitions.id],
  }),
  contributors: many(robotMembers),
  awards: many(awards),
}));

export const robotMembersRelations = relations(robotMembers, ({ one }) => ({
  robot: one(robots, {
    fields: [robotMembers.robotId],
    references: [robots.id],
  }),
  member: one(users, {
    fields: [robotMembers.memberId],
    references: [users.id],
  }),
}));

export const awardsRelations = relations(awards, ({ one }) => ({
  robot: one(robots, {
    fields: [awards.robotId],
    references: [robots.id],
  }),
  competition: one(competitions, {
    fields: [awards.competitionId],
    references: [competitions.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;