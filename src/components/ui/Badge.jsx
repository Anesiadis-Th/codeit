const variants = {
  success: "bg-success-300/15 text-success-300",
  pending: "bg-accent-300/15 text-accent-300",
  muted: "bg-white/10 text-fg-muted",
  streak: "bg-streak/15 text-streak",
};

export default function Badge({ variant = "muted", icon: Icon, className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}
