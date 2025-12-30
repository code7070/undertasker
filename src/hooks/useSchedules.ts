import { useState, useEffect, useCallback } from "react";
import type { Schedule } from "@/lib/types";
import {
  getSchedules,
  addSchedule as addScheduleToStorage,
  updateSchedule as updateScheduleInStorage,
  deleteSchedule as deleteScheduleFromStorage,
} from "@/lib/storage";
import {
  createSchedule,
  getSchedulesForDate,
  toggleScheduleCompletion,
} from "@/lib/schedule";

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Load schedules from localStorage on mount
  useEffect(() => {
    const loadedSchedules = getSchedules();
    setSchedules(loadedSchedules);
  }, []);

  // Get schedules for the selected date
  const schedulesForDate = getSchedulesForDate(schedules, selectedDate);

  // Add a new schedule
  const addSchedule = useCallback(
    (
      title: string,
      date: string,
      time: string,
      recurrenceType: "none" | "daily" | "weekly" | "monthly" = "none"
    ) => {
      const newSchedule = createSchedule(title, date, time, recurrenceType);
      addScheduleToStorage(newSchedule);
      setSchedules((prev) => [...prev, newSchedule]);
    },
    []
  );

  // Update an existing schedule
  const updateSchedule = useCallback(
    (id: string, updates: Partial<Schedule>) => {
      updateScheduleInStorage(id, updates);
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === id
            ? { ...schedule, ...updates, updatedAt: new Date().toISOString() }
            : schedule
        )
      );
    },
    []
  );

  // Delete a schedule (soft delete)
  const deleteSchedule = useCallback((id: string) => {
    deleteScheduleFromStorage(id);
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id
          ? { ...schedule, deletedAt: new Date().toISOString() }
          : schedule
      )
    );
  }, []);

  // Toggle schedule completion
  const toggleCompletion = useCallback((schedule: Schedule) => {
    const updated = toggleScheduleCompletion(schedule);
    updateScheduleInStorage(schedule.id, {
      completed: updated.completed,
      completedAt: updated.completedAt,
    });
    setSchedules((prev) =>
      prev.map((s) => (s.id === schedule.id ? updated : s))
    );
  }, []);

  return {
    schedules,
    schedulesForDate,
    selectedDate,
    setSelectedDate,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleCompletion,
  };
}
