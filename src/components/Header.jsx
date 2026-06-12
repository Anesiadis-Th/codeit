import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Flame, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUserStats } from "../hooks/useUserStats";
import { computeLevel } from "../lib/levels";
import Badge from "./ui/Badge";
import mascotLogo from "../assets/mascot_head.png";

const navLinkClasses =
  "font-medium text-fg-muted transition hover:text-accent-300";

export default function Header() {
  const { t } = useTranslation();
  const { isGuest, signOut } = useAuth();
  const { stats } = useUserStats();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-brand-900/95 to-brand-700/90 shadow-lg shadow-black/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-2xl font-bold tracking-wide text-accent-300"
          onClick={() => setMenuOpen(false)}
        >
          <img src={mascotLogo} alt="" aria-hidden="true" className="h-7 w-8" />
          CodeIT
        </Link>

        <button
          type="button"
          className="cursor-pointer text-accent-300 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } w-full flex-col items-start gap-4 pb-2 md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:pb-0`}
          onClick={() => setMenuOpen(false)}
        >
          <nav className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <Link to="/lessons" className={navLinkClasses}>
              {t("header.lessons")}
            </Link>
            <Link to="/practice" className={navLinkClasses}>
              {t("header.practice")}
            </Link>
            {!isGuest && (
              <Link to="/dashboard" className={navLinkClasses}>
                {t("header.dashboard")}
              </Link>
            )}
            {isGuest && (
              <>
                <Link to="/signup" className={navLinkClasses}>
                  {t("header.signup")}
                </Link>
                <Link to="/login" className={navLinkClasses}>
                  {t("header.login")}
                </Link>
              </>
            )}
          </nav>

          {!isGuest && (
            <div className="flex flex-wrap items-center gap-3">
              {stats && (
                <div className="flex items-center gap-1.5">
                  <Badge variant="pending">
                    Lv {computeLevel(stats.xp).level}
                  </Badge>
                  <Badge variant="muted">{stats.xp} XP</Badge>
                  <Badge variant="streak" icon={Flame}>
                    {stats.streak}
                  </Badge>
                </div>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer text-sm font-medium text-streak transition hover:brightness-125"
              >
                {t("header.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
