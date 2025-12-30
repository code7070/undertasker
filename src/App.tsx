import { useState } from "react";
import { useSchedules } from "./hooks/useSchedules";
import { useTheme } from "./hooks/useTheme";
import { ScheduleList } from "./components/ScheduleList";
import { DatePicker } from "./components/DatePicker";
import { AddScheduleDialog } from "./components/AddScheduleDialog";
import { EditScheduleDialog } from "./components/EditScheduleDialog";
import { InstallButton } from "./components/InstallButton";
import { InstallBanner } from "./components/InstallBanner";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import type { Schedule } from "@/lib/types";

function App() {
  const {
    schedulesForDate,
    selectedDate,
    setSelectedDate,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleCompletion,
  } = useSchedules();
  const { theme, toggleTheme } = useTheme();

  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 antialiased font-sans">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <InstallBanner />
        <header className="border-b-4 border-foreground pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl lg:tex-6xl font-[1000] tracking-tighter uppercase leading-none">
              Undertasker
            </h1>
            <p className="text-lg lg:text-xl font-medium tracking-tight opacity-70">
              YOUR SCHEDULE MANAGEMENT
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InstallButton />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 fill-current" />
              ) : (
                <Moon className="h-5 w-5 fill-current" />
              )}
            </Button>
          </div>
        </header>

        <main className="space-y-12">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4 border-b-2 border-foreground/10">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
                Timeline Control
              </span>
              <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
            </div>
            <div className="hidden lg:block">
              <AddScheduleDialog
                onAdd={addSchedule}
                defaultDate={selectedDate}
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Active Matrix
              </h2>
              <div className="h-1 w-12 bg-foreground" />
            </div>
            <ScheduleList
              schedules={schedulesForDate}
              onToggle={toggleCompletion}
              onDelete={deleteSchedule}
              onEdit={handleEdit}
            />
          </section>

          <EditScheduleDialog
            schedule={editingSchedule}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onUpdate={updateSchedule}
          />
        </main>

        <div className="lg:hidden mt-8">
          <AddScheduleDialog onAdd={addSchedule} defaultDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}

export default App;
