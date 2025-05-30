import { pgTable, serial, varchar, text, integer, timestamp, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["Sovereign Lord", "admin", "member", "viewer"]);
export const robotStatusEnum = pgEnum("robot_status", ["validation", "canceled", "active", "retiree"]);

// Users table
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

// Competitions table
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

// Robots table
export const robots = pgTable("robots", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  status: robotStatusEnum("status").notNull().default("validation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// robot_competitions: many-to-many robots <-> competitions
export const robotCompetitions = pgTable(
  "robot_competitions",
  {
    robotId: integer("robot_id").notNull().references(() => robots.id),
    competitionId: integer("competition_id").notNull().references(() => competitions.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.robotId, table.competitionId] }),
  })
);

// robot_users: many-to-many robots <-> users
export const robotUsers = pgTable(
  "robot_users",
  {
    robotId: integer("robot_id").notNull().references(() => robots.id),
    userId: integer("user_id").notNull().references(() => users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.robotId, table.userId] }),
  })
);

// robot_members: track member contributions to robots over time
export const robotMembers = pgTable(
  "robot_members",
  {
    robotId: integer("robot_id").notNull().references(() => robots.id),
    memberId: integer("member_id").notNull().references(() => users.id),
    fromDate: timestamp("from_date").notNull(),
    toDate: timestamp("to_date"),
    isActive: integer("is_active").notNull().default(1),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.robotId, table.memberId, table.fromDate] }),
  })
);

// Awards table: each award belongs to a unique robot
export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  robotId: integer("robot_id").notNull().references(() => robots.id),
  competitionId: integer("competition_id").notNull().references(() => competitions.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  awardedAt: timestamp("awarded_at").notNull(),
});

// Relations
export const membersRelations = relations(users, ({ many }) => ({
  robots: many(robotUsers),
  contributions: many(robotMembers),
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  robots: many(robotCompetitions),
  awards: many(awards),
}));

export const robotsRelations = relations(robots, ({ many }) => ({
  competitions: many(robotCompetitions),
  users: many(robotUsers),
  contributors: many(robotMembers),
  awards: many(awards),
}));

export const robotCompetitionsRelations = relations(robotCompetitions, ({ one }) => ({
  robot: one(robots, {
    fields: [robotCompetitions.robotId],
    references: [robots.id],
  }),
  competition: one(competitions, {
    fields: [robotCompetitions.competitionId],
    references: [competitions.id],
  }),
}));

export const robotUsersRelations = relations(robotUsers, ({ one }) => ({
  robot: one(robots, {
    fields: [robotUsers.robotId],
    references: [robots.id],
  }),
  user: one(users, {
    fields: [robotUsers.userId],
    references: [users.id],
  }),
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

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Competition = typeof competitions.$inferSelect;
export type NewCompetition = typeof competitions.$inferInsert;

export type Robot = typeof robots.$inferSelect;
export type NewRobot = typeof robots.$inferInsert;

export type RobotCompetition = typeof robotCompetitions.$inferSelect;
export type NewRobotCompetition = typeof robotCompetitions.$inferInsert;

export type RobotUser = typeof robotUsers.$inferSelect;
export type NewRobotUser = typeof robotUsers.$inferInsert;

export type RobotMember = typeof robotMembers.$inferSelect;
export type NewRobotMember = typeof robotMembers.$inferInsert;

export type Award = typeof awards.$inferSelect;
export type NewAward = typeof awards.$inferInsert;