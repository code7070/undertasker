import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { getSyncMetadata } from "@/lib/storage";
import { useEffect, useState } from "react";

/**
 * SyncStatus - A plug-and-play component to show the last sync status.
 * Can be placed in a sidebar or header.
 */
export function SyncStatus() {
  const [metadata, setMetadata] = useState(getSyncMetadata());

  useEffect(() => {
    // Polling or listener could be added here if needed
    const interval = setInterval(() => {
      setMetadata(getSyncMetadata());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!metadata.userId) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1 text-[10px] font-bold uppercase tracking-widest opacity-50 bg-foreground/5 rounded border border-foreground/10">
      {metadata.lastSyncAt ? (
        <>
          <Cloud className="h-3 w-3" />
          <span>
            Synced:{" "}
            {new Date(metadata.lastSyncAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </>
      ) : (
        <>
          <CloudOff className="h-3 w-3" />
          <span>Not Synced</span>
        </>
      )}
    </div>
  );
}
