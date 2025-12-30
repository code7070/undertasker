import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/lib/types";

interface ScheduleItemProps {
  readonly schedule: Schedule;
  readonly onToggle: (schedule: Schedule) => void;
  readonly onDelete: (id: string) => void;
  readonly onEdit: (schedule: Schedule) => void;
}

export function ScheduleItem({
  schedule,
  onToggle,
  onDelete,
  onEdit,
}: ScheduleItemProps) {
  return (
    <div
      className={cn(
        "group transition-colors duration-150 hover:bg-foreground/5",
        "md:grid md:grid-cols-[80px_60px_1fr_100px] md:items-center py-4 px-4 gap-4",
        "flex flex-col md:flex-none",
        schedule.completed && "opacity-40"
      )}
    >
      <div className="flex items-center justify-between md:contents">
        {/* Time - Mobile Header / Desktop Col 1 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-black font-mono tracking-tighter bg-foreground text-background px-1.5 py-0.5">
            {schedule.time}
          </span>
          {schedule.recurrence.type !== "none" && (
            <Repeat className="h-3.5 w-3.5 text-foreground/50" />
          )}
        </div>

        {/* Checkbox - Mobile + Desktop Col 2 */}
        <div className="flex items-center md:justify-start">
          <Checkbox
            id={`complete-${schedule.id}`}
            checked={schedule.completed}
            onCheckedChange={() => onToggle(schedule)}
            className="h-6 w-6 border-2 border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background transition-colors"
          />
        </div>

        {/* Title - Mobile Body / Desktop Col 3 */}
        <div className="min-w-0 py-2 md:py-0">
          <h3
            className={cn(
              "text-lg font-bold leading-tight truncate",
              schedule.completed && "line-through"
            )}
          >
            {schedule.title}
          </h3>
        </div>

        {/* Actions - Mobile Footer / Desktop Col 4 */}
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(schedule)}
            className="h-9 w-9 rounded-none border border-transparent hover:border-foreground hover:bg-transparent transition-all"
          >
            <Edit2 className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(schedule.id)}
            className="h-9 w-9 rounded-none border border-transparent hover:border-foreground hover:bg-transparent transition-all text-foreground hover:text-foreground"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
