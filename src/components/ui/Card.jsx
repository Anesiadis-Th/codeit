const variants = {
  raised:
    "rounded-2xl bg-surface-900 p-6 shadow-xl shadow-black/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-brand-500/20 sm:p-8",
  static: "rounded-xl bg-surface-800 p-5 shadow-md shadow-black/30 sm:p-6",
  intro:
    "rounded-xl border-y border-border-soft bg-[radial-gradient(circle_at_top_left,#3d1a5c,#261339)] p-5 leading-relaxed shadow-lg shadow-black/30 sm:p-6",
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
          className="pointer-events-none absolute -right-px bottom-0 z-0 w-24 opacity-15 select-none"
        />
      )}
    </div>
  );
}
