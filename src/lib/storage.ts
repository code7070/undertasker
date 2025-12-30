import type { Schedule, AppSettings, SyncMetadata } from "./types";

const STORAGE_KEYS = {
  SCHEDULES: "schedules",
  APP_SETTINGS: "app_settings",
  SYNC_METADATA: "sync_metadata",
} as const;

// Generic localStorage wrapper with type safety
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

// Schedule operations
export function getSchedules(): Schedule[] {
  return getItem<Schedule[]>(STORAGE_KEYS.SCHEDULES, []);
}

export function saveSchedules(schedules: Schedule[]): void {
  setItem(STORAGE_KEYS.SCHEDULES, schedules);
}

export function getScheduleById(id: string): Schedule | undefined {
  const schedules = getSchedules();
  return schedules.find((s) => s.id === id && !s.deletedAt);
}

export function addSchedule(schedule: Schedule): void {
  const schedules = getSchedules();
  schedules.push(schedule);
  saveSchedules(schedules);
}

export function updateSchedule(id: string, updates: Partial<Schedule>): void {
  const schedules = getSchedules();
  const index = schedules.findIndex((s) => s.id === id);
  if (index !== -1) {
    schedules[index] = {
      ...schedules[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveSchedules(schedules);
  }
}

export function deleteSchedule(id: string): void {
  const schedules = getSchedules();
  const index = schedules.findIndex((s) => s.id === id);
  if (index !== -1) {
    schedules[index].deletedAt = new Date().toISOString();
    saveSchedules(schedules);
  }
}

// App settings operations
export function getAppSettings(): AppSettings {
  return getItem<AppSettings>(STORAGE_KEYS.APP_SETTINGS, {
    theme: "dark",
    timeFormat: "24h",
    notifications: false,
  });
}

export function saveAppSettings(settings: AppSettings): void {
  setItem(STORAGE_KEYS.APP_SETTINGS, settings);
}

// Sync metadata operations
export function getSyncMetadata(): SyncMetadata {
  return getItem<SyncMetadata>(STORAGE_KEYS.SYNC_METADATA, {
    lastSyncAt: null,
    userId: null,
  });
}

export function saveSyncMetadata(metadata: SyncMetadata): void {
  setItem(STORAGE_KEYS.SYNC_METADATA, metadata);
}
