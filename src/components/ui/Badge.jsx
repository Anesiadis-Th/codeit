const variants = {
  success: "border-success-300/40 bg-success-300/10 text-success-300",
  pending: "border-accent-300/40 bg-accent-300/10 text-accent-300",
  muted: "border-border-soft bg-surface-800 text-fg-muted",
  streak: "border-streak/40 bg-streak/10 text-streak",
};

export default function Badge({
  variant = "muted",
  icon: Icon,
  className = "",
  children,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}
