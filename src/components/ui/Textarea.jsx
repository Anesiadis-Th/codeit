import { inputClasses } from "./Input";

export default function Textarea({ className = "", rows = 4, ...props }) {
  return <textarea rows={rows} className={`${inputClasses} ${className}`} {...props} />;
}
