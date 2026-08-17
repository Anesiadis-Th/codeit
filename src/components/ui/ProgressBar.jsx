export default function ProgressBar({ value, label, className = "" }) {
  const clamped = Math.min(100, Math.max(0, value || 0));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-1.5 w-full overflow-hidden rounded-xs bg-surface-700 ${className}`}
    >
      <div
        className="h-full bg-brand-500 transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
