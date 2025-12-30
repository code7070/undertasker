import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/lib/types";

interface EditScheduleDialogProps {
  readonly schedule: Schedule | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onUpdate: (id: string, updates: Partial<Schedule>) => void;
}

export function EditScheduleDialog({
  schedule,
  open,
  onOpenChange,
  onUpdate,
}: EditScheduleDialogProps) {
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [recurrence, setRecurrence] = React.useState<
    "none" | "daily" | "weekly" | "monthly"
  >("none");

  React.useEffect(() => {
    if (schedule && open) {
      setTitle(schedule.title);
      setDate(schedule.date);
      setTime(schedule.time);
      setRecurrence(schedule.recurrence.type);
    }
  }, [schedule, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule || !title.trim()) return;

    onUpdate(schedule.id, {
      title,
      date,
      time,
      recurrence: {
        ...schedule.recurrence,
        type: recurrence,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-4 border-foreground p-0 overflow-hidden rounded-none">
        <DialogHeader className="p-6 bg-foreground text-background">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">
            Task Modification
          </DialogTitle>
          <DialogDescription className="text-background/70 font-medium">
            Adjust parameters for the existing schedule entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="edit-title"
                className="text-xs font-black uppercase tracking-widest"
              >
                Description
              </label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="border-2 border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-11 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="edit-date"
                  className="text-xs font-black uppercase tracking-widest"
                >
                  Execution Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-mono text-sm border-2 border-foreground rounded-none h-11 hover:bg-muted-extra/20",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(new Date(date), "yyyy-MM-dd")
                      ) : (
                        <span>Pick date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-2 border-foreground rounded-none"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date ? new Date(date) : undefined}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(format(newDate, "yyyy-MM-dd"));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="edit-time"
                  className="text-xs font-black uppercase tracking-widest"
                >
                  Time (24h)
                </label>
                <Input
                  id="edit-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-2 border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-11 font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="edit-recurrence"
                className="text-xs font-black uppercase tracking-widest"
              >
                Recurrence Logic
              </label>
              <Select
                value={recurrence}
                onValueChange={(value: any) => setRecurrence(value)}
              >
                <SelectTrigger className="border-2 border-foreground focus:ring-0 focus:ring-offset-0 rounded-none h-11">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground rounded-none">
                  <SelectItem value="none">One-time iteration</SelectItem>
                  <SelectItem value="daily">Daily iteration</SelectItem>
                  <SelectItem value="weekly">Weekly iteration</SelectItem>
                  <SelectItem value="monthly">Monthly iteration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="md:grid md:grid-cols-2 gap-3 pt-4 border-t-2 border-foreground/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-2 border-foreground font-bold uppercase tracking-widest rounded-none h-12"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest rounded-none h-12"
            >
              Update Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
