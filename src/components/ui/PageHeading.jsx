const kinds = {
  note: "text-accent-300",
  warning: "text-streak",
};

/* Overflows deliberately: the run is clipped to the width of whatever it
   underlines, so it needs more tildes than any heading is wide. */
function CaretUnderline({ tone = "text-accent-300" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-full mt-[0.06em] block select-none overflow-hidden font-mono text-[0.3em] leading-none tracking-[0.06em] whitespace-nowrap ${tone}`}
    >
      {`^${"~".repeat(240)}`}
    </span>
  );
}

export function Underlined({ children }) {
  return (
    <span className="relative inline-block">
      {children}
      <CaretUnderline />
    </span>
  );
}

export default function PageHeading({ locus, kind = "note", message, children }) {
  const tone = kinds[kind] || kinds.note;

  return (
    <header className="mb-10">
      {locus && (
        <p className="locus mb-3">
          {locus}: <span className={tone}>{kind}:</span>{" "}
          {message && <span className="label text-fg-muted">{message}</span>}
        </p>
      )}

      <h1 className="display pb-[0.42em] text-3xl text-fg sm:text-4xl">
        <span className="relative inline-block">
          {children}
          <CaretUnderline tone={tone} />
        </span>
      </h1>
    </header>
  );
}
