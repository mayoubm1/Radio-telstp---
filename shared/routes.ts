import { z } from 'zod';
import { 
  insertEpisodeSchema, 
  insertTaskSchema, 
  insertTeamMemberSchema,
  insertAssetSchema,
  episodes,
  tasks,
  teamMembers,
  productionAssets
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  episodes: {
    list: {
      method: 'GET' as const,
      path: '/api/episodes',
      responses: {
        200: z.array(z.custom<typeof episodes.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/episodes/:id',
      responses: {
        200: z.custom<typeof episodes.$inferSelect & { tasks: any[], assets: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/episodes',
      input: insertEpisodeSchema,
      responses: {
        201: z.custom<typeof episodes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/episodes/:id',
      input: insertEpisodeSchema.partial(),
      responses: {
        200: z.custom<typeof episodes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  team: {
    list: {
      method: 'GET' as const,
      path: '/api/team',
      responses: {
        200: z.array(z.custom<typeof teamMembers.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/team',
      input: insertTeamMemberSchema,
      responses: {
        201: z.custom<typeof teamMembers.$inferSelect>(),
      },
    },
  },
  tasks: {
    list: {
      method: 'GET' as const,
      path: '/api/tasks',
      responses: {
        200: z.array(z.custom<typeof tasks.$inferSelect & { assignee: typeof teamMembers.$inferSelect | null, episode: typeof episodes.$inferSelect | null }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tasks',
      input: insertTaskSchema,
      responses: {
        201: z.custom<typeof tasks.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/tasks/:id',
      input: insertTaskSchema.partial(),
      responses: {
        200: z.custom<typeof tasks.$inferSelect>(),
      },
    },
  },
  assets: {
    create: {
      method: 'POST' as const,
      path: '/api/assets',
      input: insertAssetSchema,
      responses: {
        201: z.custom<typeof productionAssets.$inferSelect>(),
      },
    },
  },
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      responses: {
        200: z.object({
          totalEpisodes: z.number(),
          completedEpisodes: z.number(),
          activeTasks: z.number(),
          teamSize: z.number(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
