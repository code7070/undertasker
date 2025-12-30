export interface Schedule {
  id: string; // UUID v4
  userId: string | null; // null for local, populated on sync
  title: string;
  date: string; // ISO date: "2024-01-15"
  time: string; // 24h format: "14:30"
  recurrence: {
    type: "none" | "daily" | "weekly" | "monthly";
    interval: number; // default 1, for future: every 2 days, etc
    endDate: string | null; // optional end date
  };
  completed: boolean;
  completedAt: string | null; // ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  deletedAt: string | null; // soft delete timestamp
  syncStatus: "synced" | "pending" | "conflict"; // for future sync
  version: number; // conflict resolution
}

export interface AppSettings {
  theme: "light" | "dark";
  timeFormat: "12h" | "24h";
  notifications: boolean;
}

export interface SyncMetadata {
  lastSyncAt: string | null;
  userId: string | null;
}
