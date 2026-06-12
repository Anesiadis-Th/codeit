import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { initUserStats } from "../lib/statsService";
import { AuthContext } from "../hooks/useAuth";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session, sign in as guest
      if (!session) {
        await supabase.auth.signInAnonymously();
      } else {
        await initUserStats();
      }

      if (!alive) return;
      setUser(session?.user ?? null);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) initUserStats();
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    const isGuest = !user || user.app_metadata?.provider === "anonymous";

    const signOut = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (e) {
        console.error("signOut error:", e);
      } finally {
        setUser(null);
      }
    };

    return { user, isGuest, loading, signOut };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
