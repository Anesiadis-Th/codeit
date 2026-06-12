import { ChevronRight } from "lucide-react";

export default function Accordion({ open, onToggle, title, icon: Icon, children }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-gradient-to-r from-surface-800 to-surface-700 px-5 py-4 text-left text-lg font-semibold text-fg shadow-inner shadow-brand-500/20 transition hover:brightness-115"
      >
        <span className="flex items-center gap-2.5">
          {Icon && <Icon className="size-5 shrink-0 text-accent-300" aria-hidden="true" />}
          {title}
        </span>
        <ChevronRight
          className={`size-5 shrink-0 text-accent-300 transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
