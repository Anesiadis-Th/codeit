const sizes = {
  sm: "size-5 border-2",
  md: "size-9 border-[3px]",
  lg: "size-14 border-4",
};

export default function Spinner({ size = "lg", className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-white/20 border-t-accent-300 ${sizes[size]} ${className}`}
    />
  );
}
