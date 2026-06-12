import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// The app stores content under the non-standard "gr" code (not ISO "el");
// browser locales may report either, so both normalize to "gr".
export function normalizeLang(language) {
  const raw = (language || "en").toLowerCase();
  return raw.startsWith("gr") || raw.startsWith("el") ? "gr" : "en";
}

export function useLang() {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);

  const localize = useCallback(
    (record, field) =>
      lang === "gr"
        ? record?.[`${field}_gr`] || record?.[`${field}_en`]
        : record?.[`${field}_en`] || record?.[`${field}_gr`],
    [lang]
  );

  return { lang, localize };
}
