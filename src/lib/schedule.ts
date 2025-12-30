import { v4 as uuidv4 } from "uuid";
import type { Schedule } from "./types";

export function createSchedule(
  title: string,
  date: string,
  time: string,
  recurrenceType: "none" | "daily" | "weekly" | "monthly" = "none"
): Schedule {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    userId: null,
    title,
    date,
    time,
    recurrence: {
      type: recurrenceType,
      interval: 1,
      endDate: null,
    },
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    syncStatus: "pending",
    version: 1,
  };
}

export function getSchedulesForDate(
  schedules: Schedule[],
  targetDate: string
): Schedule[] {
  return schedules
    .filter((schedule) => {
      // Skip deleted schedules
      if (schedule.deletedAt) return false;

      // Handle one-time schedules
      if (schedule.recurrence.type === "none") {
        return schedule.date === targetDate;
      }

      // Handle recurring schedules
      const scheduleDate = new Date(schedule.date);
      const target = new Date(targetDate);

      // Check if target date is before schedule start date
      if (target < scheduleDate) return false;

      // Check if target date is after recurrence end date
      if (schedule.recurrence.endDate) {
        const endDate = new Date(schedule.recurrence.endDate);
        if (target > endDate) return false;
      }

      // Check recurrence pattern
      switch (schedule.recurrence.type) {
        case "daily":
          return true;

        case "weekly":
          return scheduleDate.getDay() === target.getDay();

        case "monthly":
          return scheduleDate.getDate() === target.getDate();

        default:
          return false;
      }
    })
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function toggleScheduleCompletion(schedule: Schedule): Schedule {
  const now = new Date().toISOString();
  return {
    ...schedule,
    completed: !schedule.completed,
    completedAt: !schedule.completed ? now : null,
    updatedAt: now,
  };
}
