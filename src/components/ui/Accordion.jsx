import { ChevronRight } from "lucide-react";

export default function Accordion({ open, onToggle, title, icon: Icon, children }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between border px-5 py-4 text-left transition-colors ${
          open
            ? "rounded-t-md border-border-soft bg-surface-800"
            : "rounded-md border-border-soft bg-surface-900 hover:bg-surface-800"
        }`}
      >
        <span className="display flex items-center gap-3 text-lg text-fg">
          {Icon && <Icon className="size-5 shrink-0 text-brand-300" aria-hidden="true" />}
          {title}
        </span>
        <ChevronRight
          className={`size-5 shrink-0 text-brand-300 transition-transform duration-300 ${
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
        <div className="overflow-hidden">
          <div
            className={
              open
                ? "rounded-b-md border-x border-b border-border-soft bg-surface-900 px-5 pb-4"
                : ""
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
