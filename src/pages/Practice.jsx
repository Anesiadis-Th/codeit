import globalStyles from "../styles/globals.module.css";
import { useState } from "react";
import { submitCode } from "../lib/codeService";
import { runCCode } from "../lib/judge0Service";
import { supabase } from "../lib/supabaseClient";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/themes/prism-tomorrow.css";
import Footer from "../components/Footer";
import CodeIcon from "../assets/code.png";
import editorStyles from "../styles/editor.module.css";
import { useTranslation } from "react-i18next"; // ✅ added

export default function Practice() {
  const { t } = useTranslation(); // ✅ added
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
    <div className={globalStyles.container}>
      <h1 className={globalStyles.title}>
        <img
          src={CodeIcon}
          alt="Code"
          className={globalStyles.inlineIconLarge}
        />
        {t("practice.title")}
      </h1>

      <div className={`${globalStyles.card} ${globalStyles.cardAnimated}`}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => Prism.highlight(code, Prism.languages.c, "c")}
          padding={16}
          className={editorStyles.editorBox}
        />

        <button
          className={globalStyles.buttonPrimary}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t("practice.submitting") : t("practice.runCode")}
        </button>

        {output && !error && output !== "No output" && (
          <pre
            style={{
              backgroundColor: "#e0ffe0",
              color: "#003300",
              padding: "1rem",
              marginTop: "1rem",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            ✅ {t("practice.output")}: {output}
          </pre>
        )}

        {(error || output === "No output") && (
          <pre
            style={{
              backgroundColor: "#ffe0e0",
              color: "#550000",
              padding: "1rem",
              marginTop: "1rem",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            ❌ {error || t("practice.noOutput")}
          </pre>
        )}
      </div>
      <Footer />
    </div>
  );
}
