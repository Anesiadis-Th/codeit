export const inputClasses =
  "w-full rounded-lg border border-border-soft bg-ink-900 px-4 py-2.5 text-fg placeholder:text-fg-muted/50 transition outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/40";

export default function Input({ className = "", ...props }) {
  return <input className={`${inputClasses} ${className}`} {...props} />;
}
