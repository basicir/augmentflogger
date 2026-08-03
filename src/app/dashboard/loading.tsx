import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', background: 'var(--bg-background)' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary, #3b82f6)" />
    </div>
  );
}
