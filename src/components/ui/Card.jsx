const variants = {
  raised: "rounded-md border border-border-soft bg-surface-900 p-6 sm:p-7",
  static: "rounded-md border border-border-soft bg-surface-800 p-5 sm:p-6",
  intro:
    "rounded-md border-l-2 border-brand-500 bg-surface-900 p-5 leading-relaxed sm:p-6",
};

export default function Card({
  variant = "raised",
  animated = false,
  delay = 0,
  mascot,
  className = "",
  children,
  ...props
}) {
  return (
    <div
      className={`${variants[variant]} ${
        animated ? "animate-fade-up" : ""
      } ${mascot ? "relative overflow-hidden" : ""} ${className}`}
      style={animated && delay ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
      {mascot && (
        <img
          src={mascot}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 z-0 w-24 opacity-20 select-none"
        />
      )}
    </div>
  );
}
