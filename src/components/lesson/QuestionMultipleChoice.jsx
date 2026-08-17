export default function QuestionMultipleChoice({ options, selected, onSelect }) {
  return (
    <fieldset className="my-4 w-full max-w-xl">
      {options.map((option, idx) => (
        <label
          key={idx}
          className="mb-2 flex cursor-pointer items-start gap-3 rounded-md border border-border-soft bg-surface-900 p-4 transition-colors hover:border-brand-500 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-500/10"
        >
          <input
            type="radio"
            name="quiz"
            value={idx}
            checked={selected === idx}
            onChange={() => onSelect(idx)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative mt-0.5 size-5 shrink-0 rounded-full bg-ink-900 ring-1 ring-hint transition after:absolute after:inset-1 after:scale-0 after:rounded-full after:bg-brand-500 after:transition-transform after:duration-200 peer-checked:ring-brand-500 peer-checked:after:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-300 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-900"
          />
          <span className="leading-relaxed break-words">{option}</span>
        </label>
      ))}
    </fieldset>
  );
}
