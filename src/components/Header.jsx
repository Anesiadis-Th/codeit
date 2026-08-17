import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Flame, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUserStats } from "../hooks/useUserStats";
import { computeLevel } from "../lib/levels";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import mascotLogo from "../assets/mascot_head.png";

function NavItem({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `border-b-2 px-1 py-1 text-sm font-medium transition-colors ${
          isActive
            ? "border-brand-500 text-fg"
            : "border-transparent text-fg-muted hover:text-fg"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function Stats({ stats }) {
  if (!stats) return null;
  return (
    <div className="flex items-center gap-1.5">
      <Badge variant="pending">Lv {computeLevel(stats.xp).level}</Badge>
      <Badge variant="muted">{stats.xp} XP</Badge>
      <Badge variant="streak" icon={Flame}>
        {stats.streak}
      </Badge>
    </div>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const { isGuest, signOut } = useAuth();
  const { stats } = useUserStats();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setMenuOpen(false);

  const handleLogout = async () => {
    await signOut();
    close();
    navigate("/");
  };

  const nav = (
    <>
      <NavItem to="/lessons" onClick={close}>
        {t("header.lessons")}
      </NavItem>
      <NavItem to="/practice" onClick={close}>
        {t("header.practice")}
      </NavItem>
      {!isGuest && (
        <NavItem to="/dashboard" onClick={close}>
          {t("header.dashboard")}
        </NavItem>
      )}
    </>
  );

  const authActions = (compact = false) =>
    !isGuest ? (
      <>
        <Stats stats={stats} />
        <button
          type="button"
          onClick={handleLogout}
          className={`cursor-pointer text-sm font-medium text-streak transition hover:brightness-125 ${
            compact ? "self-start" : ""
          }`}
        >
          {t("header.logout")}
        </button>
      </>
    ) : (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          onClick={close}
          className="text-sm font-medium text-fg-muted transition hover:text-fg"
        >
          {t("header.login")}
        </Link>
        <Button
          size="sm"
          onClick={() => {
            close();
            navigate("/signup");
          }}
        >
          {t("header.signup")}
        </Button>
      </div>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-surface-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-2.5 font-mono text-lg font-semibold tracking-tight text-fg"
        >
          <img src={mascotLogo} alt="" aria-hidden="true" className="h-7 w-8" />
          Code<span className="text-brand-500">IT</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{nav}</nav>

        <div className="hidden items-center gap-4 md:flex">{authActions()}</div>

        <button
          type="button"
          className="cursor-pointer text-fg-muted transition hover:text-fg md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border-soft bg-surface-950/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col items-start gap-3">{nav}</nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-border-soft pt-4">
            {authActions(true)}
          </div>
        </div>
      )}
    </header>
  );
}
