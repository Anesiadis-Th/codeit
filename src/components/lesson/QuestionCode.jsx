import { useTranslation } from "react-i18next";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import CodeBlock from "../ui/CodeBlock";
import CodeEditor from "../ui/CodeEditor";

export default function QuestionCode({
  step,
  code,
  onCodeChange,
  onRun,
  isRunning,
  output,
  error,
  isCorrect,
}) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 space-y-4">
      <CodeBlock variant="expected" label={t("lesson.expectedOutput")}>
        {step.expectedOutput}
      </CodeBlock>

      <CodeEditor value={code} onChange={onCodeChange} />

      <Button variant="subtle" loading={isRunning} onClick={onRun}>
        {isRunning ? t("lesson.running") : t("lesson.runCode")}
      </Button>

      {output && (
        <CodeBlock variant="output" label={t("lesson.output")}>
          {output}
        </CodeBlock>
      )}

      {error && (
        <CodeBlock variant="error" label={t("lesson.error")}>
          {error}
        </CodeBlock>
      )}

      {isCorrect === true && (
        <Alert variant="success">{t("lesson.codeOutputCorrect")}</Alert>
      )}
      {isCorrect === false && (
        <Alert variant="error">{t("lesson.codeOutputIncorrect")}</Alert>
      )}
    </div>
  );
}
