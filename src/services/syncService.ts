import { supabase } from "@/lib/supabase";
import type { Schedule } from "@/lib/types";

/**
 * SyncService - Core logic for Supabase interactions.
 * Optimized for use with TanStack Query.
 */
export class SyncService {
  /**
   * Fetch all schedules for a specific user.
   * Maps snake_case (DB) to camelCase (App).
   */
  static async fetchSchedules(userId: string): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return (data || []).map((remote: any) => ({
      id: remote.id,
      userId: remote.user_id,
      title: remote.title,
      date: remote.date,
      time: remote.time,
      recurrence: remote.recurrence,
      completed: remote.completed || false,
      completedAt: remote.completed_at,
      createdAt: remote.created_at,
      updatedAt: remote.updated_at,
      deletedAt: remote.deleted_at,
      version: remote.version || 1,
      syncStatus: "synced",
    }));
  }

  /**
   * Upsert multiple schedules to Supabase.
   */
  static async upsertSchedules(
    userId: string,
    schedules: Schedule[]
  ): Promise<void> {
    if (schedules.length === 0) return;

    const { error } = await supabase.from("schedules").upsert(
      schedules.map((s) => ({
        id: s.id,
        user_id: userId,
        title: s.title,
        date: s.date,
        time: s.time,
        recurrence: s.recurrence,
        completed: s.completed,
        completed_at: s.completedAt,
        created_at: s.createdAt,
        updated_at: s.updatedAt,
        deleted_at: s.deletedAt,
        version: s.version,
      }))
    );

    if (error) throw error;
  }
}
