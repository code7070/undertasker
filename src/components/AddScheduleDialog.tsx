import * as React from "react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { cn } from "@/lib/utils";

interface AddScheduleDialogProps {
  readonly onAdd: (
    title: string,
    date: string,
    time: string,
    recurrence: "none" | "daily" | "weekly" | "monthly"
  ) => void;
  readonly defaultDate: string;
}

function formatCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function AddScheduleDialog({
  onAdd,
  defaultDate,
}: AddScheduleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState(defaultDate);
  const [time, setTime] = React.useState(formatCurrentTime());
  const [recurrence, setRecurrence] = React.useState<
    "none" | "daily" | "weekly" | "monthly"
  >("none");

  React.useEffect(() => {
    if (open) {
      setDate(defaultDate);
      setTitle("");
      setTime(formatCurrentTime());
    }
  }, [open, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title, date, time, recurrence);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest py-6 gap-2 border-2 border-foreground transition-all rounded-none h-14 lg:static fixed bottom-6 right-6 lg:h-12 lg:w-auto shadow-2xl lg:shadow-none z-50">
          <Plus className="h-6 w-6 lg:h-5 lg:w-5" />
          <span className="lg:inline">Initialize Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-4 border-foreground p-0 overflow-hidden rounded-none">
        <DialogHeader className="p-6 bg-foreground text-background">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">
            System Input
          </DialogTitle>
          <DialogDescription className="text-background/70 font-medium">
            Define parameters for the new schedule entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="text-xs font-black uppercase tracking-widest"
              >
                Description
              </label>
              <Input
                id="title"
                placeholder="Core objective..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="border-2 border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-11 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest">
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
                      selected={new Date(date)}
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
                  htmlFor="time"
                  className="text-xs font-black uppercase tracking-widest"
                >
                  Time (24h)
                </label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border-2 border-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-11 font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="recurrence"
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
              onClick={() => setOpen(false)}
              className="border-2 border-foreground font-bold uppercase tracking-widest rounded-none h-12"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest rounded-none h-12"
            >
              Commit Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
