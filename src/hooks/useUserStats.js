import { useEffect, useRef, useState } from "react";
import { getUserStats } from "../lib/statsService";
import { useAuth } from "./useAuth";

export function useUserStats() {
  const { user, isGuest } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const seq = useRef(0);

  useEffect(() => {
    let alive = true;

    if (!user || isGuest) {
      setStats(null);
      setLoading(false);
      return;
    }

    const run = async () => {
      const mySeq = ++seq.current;
      setLoading(true);

      // If stats can't load we just show no stats; never crash the UI
      const s = await getUserStats().catch(() => null);

      // Ignore stale results (user may have changed while fetching)
      if (!alive || mySeq !== seq.current) return;
      setStats(s);
      setLoading(false);
    };

    run();

    return () => {
      alive = false;
    };
  }, [user, isGuest]);

  return { stats, loading };
}
