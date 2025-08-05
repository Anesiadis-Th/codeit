import * as Icons from "lucide-react";

export default function Icon({
  name,
  size = 20,
  color = "currentColor",
  ...props
}) {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react.`);
    return null;
  }

  return <LucideIcon size={size} color={color} {...props} />;
}
