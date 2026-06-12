import { inputClasses } from "./Input";

export default function Select({ className = "", children, ...props }) {
  return (
    <select className={`${inputClasses} cursor-pointer ${className}`} {...props}>
      {children}
    </select>
  );
}
