import { CheckCircle2, Info, XCircle } from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    classes: "border-success-300/30 bg-success-300/10 text-success-300",
  },
  error: {
    icon: XCircle,
    classes: "border-danger-300/30 bg-danger-300/10 text-danger-300",
  },
  info: {
    icon: Info,
    classes: "border-accent-300/30 bg-accent-300/10 text-accent-300",
  },
};

export default function Alert({ variant = "info", className = "", children }) {
  const { icon: Icon, classes } = variants[variant];

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium ${classes} ${className}`}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
