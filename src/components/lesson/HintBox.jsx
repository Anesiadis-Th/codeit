import { Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

export default function HintBox({ hint, show, onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="mt-3">
      <Button variant="subtle" size="sm" icon={Lightbulb} onClick={onToggle}>
        {show ? t("lesson.hideHint") : t("lesson.needHelp")}
      </Button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          show ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-start gap-2.5 rounded-md border-l-2 border-accent-300 bg-surface-800 px-4 py-3 leading-relaxed text-fg">
            <Lightbulb
              className="mt-0.5 size-5 shrink-0 text-accent-300"
              aria-hidden="true"
            />
            <p>{hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
