import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export function InstallButton() {
  const { isInstallable, install } = usePWA();

  if (!isInstallable) return null;

  return (
    <Button
      onClick={install}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-200 rounded-none font-bold uppercase tracking-widest px-4"
    >
      <Download className="h-4 w-4" />
      Install
    </Button>
  );
}
