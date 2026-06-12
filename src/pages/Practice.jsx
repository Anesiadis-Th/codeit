import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Code2 } from "lucide-react";
import { submitCode } from "../lib/codeService";
import { runCCode } from "../lib/judge0Service";
import { supabase } from "../lib/supabaseClient";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import CodeEditor from "../components/ui/CodeEditor";
import CodeBlock from "../components/ui/CodeBlock";

export default function Practice() {
  const { t } = useTranslation();
  const [code, setCode] = useState(
    `#include <stdio.h>\nint main() {\n  printf("Hello, C!");\n  return 0;\n}`
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isGuest = !session;

      let submission;

      if (!isGuest) {
        submission = await submitCode({
          lessonId: "c-practice",
          code,
        });
      }

      const result = await runCCode(code);

      if (!isGuest && submission?.id) {
        const { error: updateError } = await supabase
          .from("submissions")
          .update({
            status: result.status.includes("Accepted") ? "success" : "error",
            output: result.stdout || result.stderr || "No output",
          })
          .eq("id", submission.id);

        if (updateError) throw updateError;
      }

      setOutput(result.stdout || result.stderr || "No output");
    } catch (err) {
      setError(t("practice.executionFailed", { message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="animate-fade-up my-6 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
        <Code2 className="size-9 shrink-0 text-accent-300" aria-hidden="true" />
        <span className="text-gradient">{t("practice.title")}</span>
      </h1>

      <Card animated delay={100}>
        <CodeEditor value={code} onChange={setCode} />

        <Button className="mt-4" loading={loading} onClick={handleSubmit}>
          {loading ? t("practice.submitting") : t("practice.runCode")}
        </Button>

        {output && !error && output !== "No output" && (
          <CodeBlock variant="output" label={t("practice.output")} className="mt-4">
            {output}
          </CodeBlock>
        )}

        {(error || output === "No output") && (
          <CodeBlock variant="error" className="mt-4">
            {error || t("practice.noOutput")}
          </CodeBlock>
        )}
      </Card>
    </div>
  );
}
