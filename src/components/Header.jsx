import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getUserStats } from "../lib/statsService";
import styles from "../styles/header.module.css";
import mascotLogo from "../assets/mascot_head.png";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation(); // ✅

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const userStats = await getUserStats();
        setStats(userStats);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
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

        {user && stats && (
          <div className={styles.user}>
            <div className={styles.statsLine}>
              <span>Lv {stats.level}</span>
              <span>· XP {stats.xp} ·</span>
              <span className={styles.streak}> 🔥 {stats.streak}</span>
            </div>
            <button className={styles.logout} onClick={handleLogout}>
              {t("header.logout")}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
