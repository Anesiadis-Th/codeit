import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { useLang } from "../hooks/useLang";
import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { lang } = useLang();

  const langButtonClasses = (active) =>
    `cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition ${
      active ? "bg-brand-500 text-white" : "text-fg-muted hover:text-fg"
    }`;

  return (
    <footer className="mt-16 border-t border-white/10 px-4 py-8 text-center text-sm text-fg-muted">
      <p className="flex flex-wrap items-center justify-center gap-1.5">
        {t("footer.builtWith")}
        <Heart className="size-4 text-streak" fill="currentColor" aria-hidden="true" />
        {t("footer.by")}
      </p>

      <div className="mt-4 flex items-center justify-center gap-6">
        <a
          href="https://github.com/Anesiadis-Th"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 transition hover:text-accent-300"
        >
          <img src={githubIcon} alt="" aria-hidden="true" className="size-4" />
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/anesiadis-theocharis/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 transition hover:text-accent-300"
        >
          <img src={linkedinIcon} alt="" aria-hidden="true" className="size-4" />
          LinkedIn
        </a>
      </div>

      <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/5 p-1">
        <button
          type="button"
          onClick={() => i18n.changeLanguage("en")}
          aria-label="Switch to English"
          className={langButtonClasses(lang === "en")}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage("gr")}
          aria-label="Switch to Greek"
          className={langButtonClasses(lang === "gr")}
        >
          ΕΛ
        </button>
      </div>
    </footer>
  );
}
