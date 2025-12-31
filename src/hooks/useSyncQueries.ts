import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SyncService } from "@/services/syncService";
import { getSchedules, saveSchedules } from "@/lib/storage";
import type { Schedule } from "@/lib/types";

export const QUERY_KEYS = {
  schedules: ["schedules"] as const,
};

/**
 * Hook to manage schedules with Supabase sync via TanStack Query.
 */
export function useSyncQueries(userId: string | null) {
  const queryClient = useQueryClient();

  // Query to fetch schedules from Supabase
  const schedulesQuery = useQuery({
    queryKey: QUERY_KEYS.schedules,
    queryFn: async () => {
      if (!userId) return getSchedules();

      const remoteSchedules = await SyncService.fetchSchedules(userId);
      const localSchedules = getSchedules();

      // Basic merge logic: Last Write Wins
      const merged = [...localSchedules];
      remoteSchedules.forEach((remote) => {
        const index = merged.findIndex((s) => s.id === remote.id);
        if (index === -1) {
          merged.push(remote);
        } else {
          const local = merged[index];
          if (new Date(remote.updatedAt) > new Date(local.updatedAt)) {
            merged[index] = remote;
          }
        }
      });

      saveSchedules(merged);
      return merged;
    },
    enabled: !!userId,
  });

  // Mutation to push local changes to Supabase
  const syncMutation = useMutation({
    mutationFn: async (schedulesToSync: Schedule[]) => {
      if (!userId) return;
      await SyncService.upsertSchedules(userId, schedulesToSync);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules });
    },
  });

  return {
    schedulesQuery,
    syncMutation,
  };
}
