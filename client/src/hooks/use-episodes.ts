import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useEpisodes() {
  return useQuery({
    queryKey: [api.episodes.list.path],
    queryFn: async () => {
      const res = await fetch(api.episodes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch episodes");
      return api.episodes.list.responses[200].parse(await res.json());
    },
  });
}

export function useEpisode(id: number) {
  return useQuery({
    queryKey: [api.episodes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.episodes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch episode");
      return api.episodes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.episodes.create.input>) => {
      const res = await fetch(api.episodes.create.path, {
        method: api.episodes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create episode");
      return api.episodes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.episodes.list.path] }),
  });
}

export function useUpdateEpisode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & z.infer<typeof api.episodes.update.input>) => {
      const url = buildUrl(api.episodes.update.path, { id });
      const res = await fetch(url, {
        method: api.episodes.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update episode");
      return api.episodes.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.episodes.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.episodes.get.path, id] });
    },
  });
}
