import { useTranslation } from "react-i18next";
import ProgressBar from "../ui/ProgressBar";

export default function LessonProgress({ current, total }) {
  const { t } = useTranslation();
  const percent = (current / total) * 100;

  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <p className="shrink-0 text-sm text-fg-muted">
        {t("lesson.percentComplete", { percent: percent.toFixed(0) })}
      </p>
      <ProgressBar value={percent} label={t("lesson.percentComplete", { percent: percent.toFixed(0) })} />
    </div>
  );
}
