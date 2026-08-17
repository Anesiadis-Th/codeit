import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "rounded-md bg-brand-500 font-semibold text-surface-950 hover:bg-brand-300",
  secondary:
    "rounded-md border border-border-soft bg-transparent font-medium text-fg hover:border-brand-500 hover:bg-surface-800",
  subtle:
    "rounded-md border border-border-soft bg-surface-800 font-medium text-accent-300 hover:bg-surface-700",
  "oauth-google":
    "rounded-md border border-[#dadce0] bg-white font-medium text-[#3c4043] hover:bg-[#f1f1f1]",
  "oauth-github":
    "rounded-md border border-white/15 bg-[#1b1f23] font-medium text-white hover:bg-[#2b3137]",
};

const sizes = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon: Icon,
  type = "button",
  disabled,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 transition-colors duration-150 disabled:pointer-events-none disabled:opacity-45 ${
        variants[variant]
      } ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="size-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
