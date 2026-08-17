import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { useLang } from "../hooks/useLang";
import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { lang } = useLang();

  const langButtonClasses = (active) =>
    `cursor-pointer px-2 py-1 font-mono text-xs transition-colors ${
      active ? "bg-brand-500 text-surface-950" : "text-fg-muted hover:text-fg"
    }`;

  const linkClasses =
    "inline-flex items-center gap-1.5 transition-colors hover:text-accent-300";

  return (
    <footer className="mt-16 border-t border-border-soft">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-8 text-center text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
        <p className="flex flex-wrap items-center justify-center gap-1.5">
          {t("footer.builtWith")}
          <Heart
            className="size-3.5 text-streak"
            fill="currentColor"
            aria-hidden="true"
          />
          {t("footer.by")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="https://github.com/Anesiadis-Th"
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <img src={githubIcon} alt="" aria-hidden="true" className="size-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anesiadis-theocharis/"
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <img
              src={linkedinIcon}
              alt=""
              aria-hidden="true"
              className="size-4"
            />
            LinkedIn
          </a>

          <div className="inline-flex items-center overflow-hidden rounded-sm border border-border-soft">
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              aria-label="Switch to English"
              aria-pressed={lang === "en"}
              className={langButtonClasses(lang === "en")}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("gr")}
              aria-label="Switch to Greek"
              aria-pressed={lang === "gr"}
              className={langButtonClasses(lang === "gr")}
            >
              ΕΛ
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
