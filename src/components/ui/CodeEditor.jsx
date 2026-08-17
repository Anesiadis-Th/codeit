import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c";
// Token colours come from index.css

export default function CodeEditor({
  value,
  onChange,
  minHeight = 250,
  className = "",
}) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-md border border-border-soft bg-ink-900 font-mono text-sm leading-relaxed text-fg ${className}`}
    >
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => Prism.highlight(code, Prism.languages.c, "c")}
        padding={16}
        textareaClassName="outline-none"
        style={{
          minHeight,
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
        }}
      />
    </div>
  );
}
