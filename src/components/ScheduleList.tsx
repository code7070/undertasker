import { ScheduleItem } from "./ScheduleItem";
import type { Schedule } from "@/lib/types";

interface ScheduleListProps {
  readonly schedules: Schedule[];
  readonly onToggle: (schedule: Schedule) => void;
  readonly onDelete: (id: string) => void;
  readonly onEdit: (schedule: Schedule) => void;
}

export function ScheduleList({
  schedules,
  onToggle,
  onDelete,
  onEdit,
}: ScheduleListProps) {
  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No schedules found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          You don't have any tasks scheduled for this day. Click the "Add
          Schedule" button to get started.
        </p>
      </div>
    );
  }

  // Group by status if needed, or just list chronologically
  return (
    <div className="border-t-2 border-foreground">
      <div className="hidden md:grid grid-cols-[80px_60px_1fr_100px] gap-4 py-3 px-4 border-b-2 border-foreground bg-foreground text-background text-xs font-black uppercase tracking-widest">
        <div>Time</div>
        <div>Done</div>
        <div>Task Description</div>
        <div className="text-right">Manage</div>
      </div>
      <div className="divide-y divide-foreground/20">
        {schedules.map((schedule) => (
          <ScheduleItem
            key={schedule.id}
            schedule={schedule}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
