import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./ui/Spinner";
import EmptyState from "./ui/EmptyState";

export default function ProtectedRoute({ requireAdmin = false, children }) {
  const { t } = useTranslation();
  const { user, isGuest, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null); // null = still checking

  useEffect(() => {
    let alive = true;

    if (!requireAdmin || !user || isGuest) return;

    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error) console.error("Error fetching admin status:", error.message);
      if (!alive) return;
      setIsAdmin(!error && data?.is_admin === true);
    };

    checkAdmin();

    return () => {
      alive = false;
    };
  }, [requireAdmin, user, isGuest]);

  if (loading) {
    return <Spinner className="mx-auto my-16" />;
  }

  if (isGuest) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    if (isAdmin === null) return <Spinner className="mx-auto my-16" />;
    if (!isAdmin) {
      return (
        <EmptyState
          icon={ShieldX}
          title={t("admin.accessDenied")}
          description={t("admin.accessDeniedHint")}
        />
      );
    }
  }

  return children;
}
