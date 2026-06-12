import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function StepList({ steps, onRemove }) {
  const { t } = useTranslation();

  return (
    <Card variant="static">
      <h3 className="mb-4 text-lg font-semibold text-white">
        {t("admin.steps")} ({steps.length})
      </h3>

      {steps.length === 0 ? (
        <p className="text-sm text-fg-muted">{t("admin.noSteps")}</p>
      ) : (
        <ul className="space-y-2">
          {steps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-3 rounded-xl bg-ink-900 px-4 py-3"
            >
              <div className="min-w-0">
                <Badge variant="pending">{step.type}</Badge>
                <p className="mt-1.5 truncate text-sm text-fg-muted">
                  {step.question || step.description || "—"}
                </p>
              </div>
              <Button
                variant="subtle"
                size="sm"
                icon={Trash2}
                onClick={() => onRemove(idx)}
              >
                {t("admin.removeStep")}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {steps.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-fg-muted transition hover:text-fg">
            {t("admin.rawJson")}
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-lg border border-border-soft bg-ink-900 p-3 font-mono text-xs whitespace-pre-wrap">
            {JSON.stringify(steps, null, 2)}
          </pre>
        </details>
      )}
    </Card>
  );
}
