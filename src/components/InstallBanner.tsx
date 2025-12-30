import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { useState, useEffect } from "react";

export function InstallBanner() {
  const { isInstallable, install } = usePWA();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if installable AND not already in standalone mode
    const isStandalone = globalThis.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (isInstallable && !isStandalone) {
      setIsVisible(true);
    }
  }, [isInstallable]);

  if (!isVisible) return null;

  return (
    <div className="bg-foreground text-background p-4 mb-8 border-4 border-foreground relative animate-in fade-in slide-in-from-top duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mr-8">
        <div className="space-y-1">
          <h3 className="text-xl font-[1000] uppercase tracking-tighter leading-none">
            Offline Capability Detected
          </h3>
          <p className="text-sm font-medium opacity-80 tracking-tight">
            Install Undertasker to your device for deterministic access and
            system-level integration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            className="text-background hover:bg-background/10 hover:text-background rounded-none font-bold uppercase tracking-widest px-6"
          >
            Sustain
          </Button>
          <Button
            onClick={install}
            className="bg-background text-foreground hover:bg-background/90 rounded-none font-black uppercase tracking-widest px-8 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Download className="mr-2 h-5 w-5" />
            Initialize Installation
          </Button>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-background/50 hover:text-background transition-colors"
        aria-label="Close banner"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
