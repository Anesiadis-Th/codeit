export default function Field({ label, htmlFor, error, className = "", children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-fg-muted">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-danger-300">{error}</p>}
    </div>
  );
}
