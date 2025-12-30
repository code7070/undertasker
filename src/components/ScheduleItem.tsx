import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Repeat } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/lib/types";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div
        className={cn(
          "group transition-colors duration-150 hover:bg-foreground/5",
          "md:grid md:grid-cols-[80px_60px_1fr_100px] md:items-center py-4 px-4 gap-x-4 gap-y-2",
          "flex flex-col md:flex-none",
          schedule.completed && "opacity-40"
        )}
      >
        {/* Row 1: Time and Actions (Mobile) / Grid Columns 1 & 4 (Desktop) */}
        <div className="flex items-center justify-between md:contents">
          {/* Time - Mobile Header / Desktop Col 1 */}
          <div className="flex md:flex-col gap-2 items-center md:order-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-mono tracking-tighter bg-foreground text-background px-1.5 py-0.5">
                {schedule.time}
              </span>
            </div>
            {schedule.recurrence.type !== "none" && (
              <div className="flex items-center gap-1 text-[9px] font-black uppercase text-foreground/50">
                <Repeat className="h-3 w-3 shrink-0" />
                <span className="truncate">{schedule.recurrence.type}</span>
              </div>
            )}
          </div>

          {/* Actions - Mobile Footer / Desktop Col 4 */}
          <div className="flex items-center justify-end gap-1.5 md:order-4">
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
              onClick={() => setShowDeleteConfirm(true)}
              className="h-9 w-9 rounded-none border border-transparent hover:border-foreground hover:bg-transparent transition-all text-foreground hover:text-foreground"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>

        {/* Row 2: Checkbox and Title (Mobile) / Grid Columns 2 & 3 (Desktop) */}
        <div className="flex items-center gap-4 md:contents">
          {/* Checkbox - Mobile + Desktop Col 2 */}
          <div className="flex items-center md:justify-start md:order-2">
            <Checkbox
              id={`complete-${schedule.id}`}
              checked={schedule.completed}
              onCheckedChange={() => onToggle(schedule)}
              className="h-6 w-6 border-2 border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background transition-colors"
            />
          </div>

          {/* Title - Mobile Body / Desktop Col 3 */}
          <div className="min-w-0 py-2 md:py-0 md:order-3 md:flex-1">
            <h3
              className={cn(
                "text-lg font-bold leading-tight truncate",
                schedule.completed && "line-through"
              )}
            >
              {schedule.title}
            </h3>
          </div>
        </div>
      </div>
      <DeleteConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={() => onDelete(schedule.id)}
        title="Delete Task"
        description={`Are you sure you want to delete "${schedule.title}"?`}
      />
    </>
  );
}
