export default function ProgressBar({ value, label, className = "" }) {
  const clamped = Math.min(100, Math.max(0, value || 0));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-3.5 w-full overflow-hidden rounded-full bg-surface-800 shadow-inner shadow-black/60 ${className}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-300 to-brand-500 transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
