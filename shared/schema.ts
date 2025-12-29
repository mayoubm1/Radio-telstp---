import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  theme: text("theme").notNull(),
  sfxRequirements: text("sfx_requirements"),
  ambienceGoals: text("ambience_goals"),
  emotionalArc: text("emotional_arc"),
  audioUrl: text("audio_url"),
  duration: integer("duration"), // in seconds
  status: text("status", { enum: ["planning", "in_production", "review", "completed"] }).default("planning").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Claude", "Mistral"
  role: text("role").notNull(), // e.g., "Strategic Planning", "Sound Design"
  category: text("category").notNull(), // e.g., "Content Architecture", "Audio Production", "QA"
  isAi: boolean("is_ai").default(true).notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assignedToId: integer("assigned_to_id").references(() => teamMembers.id),
  episodeId: integer("episode_id").references(() => episodes.id),
  status: text("status", { enum: ["pending", "in_progress", "review", "completed"] }).default("pending").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productionAssets = pgTable("production_assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["blueprint", "sfx", "ambience", "compilation", "document"] }).notNull(),
  episodeId: integer("episode_id").references(() => episodes.id),
  version: text("version").notNull(), // e.g., "v1.0-sfx"
  url: text("url"), // Placeholder for file URL
  status: text("status", { enum: ["draft", "final"] }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export * from "./models/chat";

export const dailyBroadcasts = pgTable("daily_broadcasts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  audioUrl: text("audio_url").notNull(),
  type: text("type").notNull(), // e.g., "Tawasol", "Through Time"
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDailyBroadcastSchema = createInsertSchema(dailyBroadcasts).omit({ id: true, createdAt: true });
export type DailyBroadcast = typeof dailyBroadcasts.$inferSelect;
export type InsertDailyBroadcast = z.infer<typeof insertDailyBroadcastSchema>;

export const episodeIdeas = pgTable("episode_ideas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  suggestedBy: text("suggested_by").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEpisodeIdeaSchema = createInsertSchema(episodeIdeas).omit({ id: true, createdAt: true });
export type EpisodeIdea = typeof episodeIdeas.$inferSelect;
export type InsertEpisodeIdea = z.infer<typeof insertEpisodeIdeaSchema>;

// === RELATIONS ===

export const episodesRelations = relations(episodes, ({ many }) => ({
  tasks: many(tasks),
  assets: many(productionAssets),
}));

export const teamMembersRelations = relations(teamMembers, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  episode: one(episodes, {
    fields: [tasks.episodeId],
    references: [episodes.id],
  }),
  assignee: one(teamMembers, {
    fields: [tasks.assignedToId],
    references: [teamMembers.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertEpisodeSchema = createInsertSchema(episodes).omit({ id: true, createdAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertAssetSchema = createInsertSchema(productionAssets).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type ProductionAsset = typeof productionAssets.$inferSelect;
export type InsertProductionAsset = z.infer<typeof insertAssetSchema>;

// Request types
export type CreateEpisodeRequest = InsertEpisode;
export type UpdateEpisodeRequest = Partial<InsertEpisode>;

export type CreateTaskRequest = InsertTask;
export type UpdateTaskRequest = Partial<InsertTask>;

// Response types
export type EpisodeWithDetails = Episode & {
  tasks: (Task & { assignee: TeamMember | null })[];
  assets: ProductionAsset[];
};

export type DashboardStats = {
  totalEpisodes: number;
  completedEpisodes: number;
  activeTasks: number;
  teamSize: number;
};

export type EpisodeWithStats = Episode & {
  taskCount: number;
  completedTaskCount: number;
};
