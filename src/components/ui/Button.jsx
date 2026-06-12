import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "rounded-full bg-gradient-to-r from-brand-500 to-brand-300 font-semibold text-white shadow-lg shadow-brand-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/50",
  secondary:
    "rounded-full bg-surface-700 font-semibold text-fg shadow-md shadow-black/30 hover:-translate-y-0.5 hover:brightness-115",
  subtle:
    "rounded-lg border border-border-soft bg-surface-800 font-medium text-accent-300 hover:-translate-y-px hover:bg-surface-700",
  "oauth-google":
    "rounded-full border border-[#dadce0] bg-white font-medium text-[#3c4043] hover:-translate-y-px hover:bg-[#f1f1f1]",
  "oauth-github":
    "rounded-full bg-[#353b41] font-medium text-white hover:-translate-y-px hover:bg-[#1b1f23]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
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
      className={`inline-flex cursor-pointer items-center justify-center gap-2 transition duration-200 disabled:pointer-events-none disabled:opacity-50 ${
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
