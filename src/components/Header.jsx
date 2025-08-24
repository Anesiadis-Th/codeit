import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { getUserStats } from "../lib/statsService";
import styles from "../styles/header.module.css";
import mascotLogo from "../assets/mascot_head.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!alive) return;
      setUser(user || null);
      // 💡 no stats fetch here
    };
    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setUser(session?.user || null);
      // 💡 no stats fetch here
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch stats safely whenever a real user is set
  const statsSeq = useRef(0);

  useEffect(() => {
    let alive = true;

    // if signed out, clear stats and bail
    if (!user) {
      setStats(null);
      return () => {};
    }

    const run = async () => {
      const mySeq = ++statsSeq.current;

      // Try to get stats; if it errors, we just show no stats (never crash UI)
      const s = await getUserStats().catch(() => null);

      // Ignore stale results (in case user changed while this was fetching)
      if (!alive || mySeq !== statsSeq.current) return;

      setStats(s);
    };

    run();

    return () => {
      alive = false;
    };
  }, [user]);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      console.error("signOut error:", e);
    } finally {
      setUser(null);
      setStats(null); // harmless; we won't render stats for now
      navigate("/"); // 👈 soft redirect keeps SPA stable after logout
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          <img
            src={mascotLogo}
            alt="Logo"
            style={{
              height: "28px",
              width: "32px",
              marginRight: "0.5rem",
              verticalAlign: "middle",
            }}
          />
          CodeIT
        </Link>
      </div>

      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      <div className={`${styles.right} ${menuOpen ? styles.showMenu : ""}`}>
        <nav className={styles.nav}>
          <Link to="/lessons">{t("header.lessons")}</Link>
          <Link to="/practice">{t("header.practice")}</Link>
          {user && <Link to="/dashboard">{t("header.dashboard")}</Link>}
          {!user && (
            <>
              <Link to="/signup">{t("header.signup")}</Link>
              <Link to="/login">{t("header.login")}</Link>
            </>
          )}
        </nav>

        {user && (
          <div className={styles.user}>
            {stats && (
              <div className={styles.statsLine}>
                <span>Lv {stats.level}</span>
                <span>· XP {stats.xp} ·</span>
                <span className={styles.streak}> 🔥 {stats.streak}</span>
              </div>
            )}
            <button className={styles.logout} onClick={handleLogout}>
              {t("header.logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
