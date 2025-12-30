import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  readonly date: string;
  readonly onDateChange: (date: string) => void;
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = new Date(date);

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      onDateChange(newDate.toISOString().split("T")[0]);
      setOpen(false);
    }
  };

  const shiftDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate.toISOString().split("T")[0]);
  };

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center bg-card border rounded-lg p-1 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => shiftDate(-1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-8 px-3 justify-start text-left font-semibold min-w-[140px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "EEE, MMM d")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              initialFocus
              className="rounded-md border shadow-md"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => shiftDate(1)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {!isToday && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(new Date().toISOString().split("T")[0])}
          className="h-9 px-3 text-xs"
        >
          Today
        </Button>
      )}
    </div>
  );
}
