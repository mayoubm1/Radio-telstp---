import { db } from "./db";
import { 
  episodes, teamMembers, tasks, productionAssets, dailyBroadcasts, episodeIdeas,
  type Episode, type InsertEpisode,
  type TeamMember, type InsertTeamMember,
  type Task, type InsertTask,
  type ProductionAsset, type InsertProductionAsset,
  type DailyBroadcast, type InsertDailyBroadcast,
  type EpisodeIdea, type InsertEpisodeIdea
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Episodes
  getEpisodes(): Promise<Episode[]>;
  getEpisode(id: number): Promise<Episode | undefined>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode>;

  // Episode Ideas
  getEpisodeIdeas(): Promise<EpisodeIdea[]>;
  createEpisodeIdea(idea: InsertEpisodeIdea): Promise<EpisodeIdea>;

  // Daily Broadcasts
  getDailyBroadcasts(): Promise<DailyBroadcast[]>;
  createDailyBroadcast(broadcast: InsertDailyBroadcast): Promise<DailyBroadcast>;

  // Team
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;

  // Tasks
  getTasks(): Promise<(Task & { assignee: TeamMember | null, episode: Episode | null })[]>;
  getTasksByEpisode(episodeId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task>;

  // Assets
  getAssets(episodeId: number): Promise<ProductionAsset[]>;
  createAsset(asset: InsertProductionAsset): Promise<ProductionAsset>;
  
  // Dashboard
  getDashboardStats(): Promise<{
    totalEpisodes: number;
    completedEpisodes: number;
    activeTasks: number;
    teamSize: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getEpisodes(): Promise<Episode[]> {
    return await db.select().from(episodes).orderBy(episodes.id);
  }

  async getEpisode(id: number): Promise<Episode | undefined> {
    const [episode] = await db.select().from(episodes).where(eq(episodes.id, id));
    return episode;
  }

  async createEpisode(episode: InsertEpisode): Promise<Episode> {
    const [newEpisode] = await db.insert(episodes).values(episode).returning();
    return newEpisode;
  }

  async updateEpisode(id: number, updates: Partial<InsertEpisode>): Promise<Episode> {
    const [updated] = await db.update(episodes)
      .set(updates)
      .where(eq(episodes.id, id))
      .returning();
    return updated;
  }

  async getEpisodeIdeas(): Promise<EpisodeIdea[]> {
    return await db.select().from(episodeIdeas).orderBy(sql`${episodeIdeas.createdAt} desc`);
  }

  async createEpisodeIdea(idea: InsertEpisodeIdea): Promise<EpisodeIdea> {
    const [newIdea] = await db.insert(episodeIdeas).values(idea).returning();
    return newIdea;
  }

  async getDailyBroadcasts(): Promise<DailyBroadcast[]> {
    return await db.select().from(dailyBroadcasts).orderBy(dailyBroadcasts.order);
  }

  async createDailyBroadcast(broadcast: InsertDailyBroadcast): Promise<DailyBroadcast> {
    const [newBroadcast] = await db.insert(dailyBroadcasts).values(broadcast).returning();
    return newBroadcast;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teamMembers).values(member).returning();
    return newMember;
  }

  async getTasks(): Promise<(Task & { assignee: TeamMember | null, episode: Episode | null })[]> {
    return await db.select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      priority: tasks.priority,
      assignedToId: tasks.assignedToId,
      episodeId: tasks.episodeId,
      createdAt: tasks.createdAt,
      assignee: teamMembers,
      episode: episodes
    })
    .from(tasks)
    .leftJoin(teamMembers, eq(tasks.assignedToId, teamMembers.id))
    .leftJoin(episodes, eq(tasks.episodeId, episodes.id));
  }

  async getTasksByEpisode(episodeId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.episodeId, episodeId));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task> {
    const [updated] = await db.update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  async getAssets(episodeId: number): Promise<ProductionAsset[]> {
    return await db.select().from(productionAssets).where(eq(productionAssets.episodeId, episodeId));
  }

  async createAsset(asset: InsertProductionAsset): Promise<ProductionAsset> {
    const [newAsset] = await db.insert(productionAssets).values(asset).returning();
    return newAsset;
  }

  async getDashboardStats() {
    const [episodeStats] = await db.select({
      total: sql<number>`count(*)`,
      completed: sql<number>`count(case when ${episodes.status} = 'completed' then 1 end)`
    }).from(episodes);

    const [taskStats] = await db.select({
      active: sql<number>`count(case when ${tasks.status} != 'completed' then 1 end)`
    }).from(tasks);

    const [teamStats] = await db.select({
      total: sql<number>`count(*)`
    }).from(teamMembers);

    return {
      totalEpisodes: Number(episodeStats?.total || 0),
      completedEpisodes: Number(episodeStats?.completed || 0),
      activeTasks: Number(taskStats?.active || 0),
      teamSize: Number(teamStats?.total || 0)
    };
  }
}

export const storage = new DatabaseStorage();
