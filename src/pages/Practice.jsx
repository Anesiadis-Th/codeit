import globalStyles from "../styles/globals.module.css";
import { useState } from "react";
import { submitCode } from "../lib/codeService";
import { runCCode } from "../lib/judge0Service";
import { supabase } from "../lib/supabaseClient";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c"; // for C language support
import "prismjs/themes/prism-tomorrow.css"; // or another theme you like
import Footer from "../components/Footer";
import CodeIcon from "../assets/code.png";
import editorStyles from "../styles/editor.module.css";

export default function Practice() {
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
      // ✅ Check for authenticated user
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

      // Run code with Judge0
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
      setError("Execution failed: " + err.message);
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
        Practice C Code
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
          {loading ? "Submitting..." : "Run Code"}
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
            ✅ Output: {output}
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
            ❌ {error || "No output, please check your code."}
          </pre>
        )}
      </div>
      <Footer />
    </div>
  );
}
