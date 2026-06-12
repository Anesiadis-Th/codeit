const variants = {
  output: "border-success-300/20 bg-success-300/10 text-success-300",
  error: "border-danger-300/20 bg-danger-300/10 text-danger-300",
  expected: "border-border-soft bg-ink-900 text-fg",
};

export default function CodeBlock({ variant = "expected", label, className = "", children }) {
  return (
    <div className={className}>
      {label && (
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-fg-muted uppercase">
          {label}
        </p>
      )}
      <pre
        className={`rounded-lg border px-4 py-3 font-mono text-sm whitespace-pre-wrap ${variants[variant]}`}
      >
        {children}
      </pre>
    </div>
  );
}
